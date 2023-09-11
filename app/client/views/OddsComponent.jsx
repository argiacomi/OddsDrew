import React from 'react';
import { useOdds } from '@utils';
import OddsTable from './OddsTable';

const OddsComponent = () => {
  const { data, error, isLoading } = useOdds();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <OddsTable data={data} />;
};

export default OddsComponent;
