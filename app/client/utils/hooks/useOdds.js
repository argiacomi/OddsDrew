import { useQuery } from '@tanstack/react-query';

const fetchOdds = async () => {
  const response = await fetch('http://localhost:3000/odds');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export function useOdds() {
  return useQuery(['oddsData'], fetchOdds);
}
