function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  if (isToday(date)) {
    return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-US', options);
  }
}

function getBestOdds(bookmakers, marketKey, outcomeName) {
  let bestPrice = Number.NEGATIVE_INFINITY;
  let bestBook = '';
  let bestPoint = '';
  let bestUpdated = '';

  const nonPinnacleBookmakers = bookmakers.filter((b) => b.key !== 'pinnacle');
  for (const bookmaker of nonPinnacleBookmakers) {
    const market = bookmaker.markets.find((m) => m.key === marketKey);
    if (market) {
      for (const outcome of market.outcomes) {
        if (outcome.name === outcomeName && outcome.price > bestPrice) {
          bestPrice = outcome.price;
          bestBook = bookmaker.key;
          bestPoint = outcome?.point || '';
          bestUpdated = market.last_update;
        }
      }
    }
  }

  return {
    bestBook,
    bestPrice,
    bestPoint,
    bestUpdated
  };
}

function getPinnacleOdds(bookmakers, marketKey, outcomeName) {
  const pinnacleBookmaker = bookmakers.find((b) => b.key === 'pinnacle');
  if (pinnacleBookmaker) {
    const market = pinnacleBookmaker.markets.find((m) => m.key === marketKey);
    if (market) {
      for (const outcome of market.outcomes) {
        if (outcome.name === outcomeName) {
          return outcome.price;
        }
      }
    }
  }
  return null;
}

function calculateNoVigOdds(price, totalProb) {
  const impliedProb = calculateImpliedProbability(price);
  const trueProb = impliedProb / totalProb;

  // Convert true probability back to American odds
  if (trueProb > 0.5) {
    return -(trueProb / (1 - trueProb)) * 100;
  } else {
    return ((1 - trueProb) / trueProb) * 100;
  }
}

function calculateImpliedProbability(odds) {
  if (odds > 0) {
    return 100 / (odds + 100);
  } else {
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
}

function normalizeProbability(probA, probB) {
  return probA / (probA + probB);
}

function calculateEV(trueProb, bestOdds) {
  const bestOddsProb = calculateImpliedProbability(bestOdds);
  return trueProb * (1 / bestOddsProb) - 1;
}

function oddsTransformer(data) {
  const events = [];

  for (const entry of data) {
    const eventDetails = {
      Date: formatDate(entry.commence_time),
      Event: `${entry.home_team} vs ${entry.away_team}`,
      Market: {}
    };

    const markets = new Set(entry.bookmakers.flatMap((b) => b.markets.map((m) => m.key)));
    markets.forEach((marketKey) => {
      eventDetails.Market[marketKey] = { Bets: {} };

      const outcomes = new Set(
        entry.bookmakers.flatMap((b) => {
          const market = b.markets.find((m) => m.key === marketKey);
          return market ? market.outcomes.map((o) => o.name) : [];
        })
      );

      // Calculate total implied probability using Pinnacle odds for normalization
      const totalPinnacleProb = Array.from(outcomes).reduce((sum, outcomeName) => {
        const pinnacleOddsForOutcome = getPinnacleOdds(entry.bookmakers, marketKey, outcomeName);
        return sum + calculateImpliedProbability(pinnacleOddsForOutcome);
      }, 0);

      let width = 0;
      outcomes.forEach((outcomeName) => {
        const bestOddsDetails = getBestOdds(entry.bookmakers, marketKey, outcomeName);
        const pinnaclePrice = getPinnacleOdds(entry.bookmakers, marketKey, outcomeName);
        if (width === 0) {
          width += Math.abs(pinnaclePrice);
        } else {
          width -= Math.abs(pinnaclePrice);
        }

        // Normalize the Pinnacle probability
        const pinnacleProb = calculateImpliedProbability(pinnaclePrice);
        const trueProb = pinnacleProb / totalPinnacleProb;

        const bet = {
          BestBook: bestOddsDetails.bestBook,
          BestOdds: bestOddsDetails.bestPrice,
          BestPoint: bestOddsDetails.bestPoint,
          NoVigOdds: calculateNoVigOdds(pinnaclePrice, totalPinnacleProb),
          PinnacleOdds: pinnaclePrice,
          Updated: formatDate(bestOddsDetails.bestUpdated)
        };

        if (pinnaclePrice) {
          bet['Expected Value'] = calculateEV(trueProb, bestOddsDetails.bestPrice);
        }

        eventDetails.Market[marketKey].Bets[outcomeName] = bet;
      });

      eventDetails.Market[marketKey]['width'] = Math.abs(width);
    });

    events.push(eventDetails);
  }

  return events;
}

const processOddsData = (rawData) => {
  const result = oddsTransformer(rawData);
  return result;
};

module.exports = {
  processOddsData
};
