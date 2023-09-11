import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Text
} from '@components';
import React from 'react';
import OddsComponent from './OddsComponent';

export default function EvDash() {
  const [filters, setFilters] = React.useState();

  const handleFilter = (label) => {
    setFilters(label);
  };

  return (
    <Box mx={4}>
      <Text my={3} variant='h3'>
        Positive Expected Value (EV) Bets
      </Text>
      <Stack mb={3} direction='row' spacing={1}>
        <Chip
          label='Upcoming'
          sx={{ color: 'white' }}
          size='large'
          variant={filters === 'Upcoming' ? 'filled' : 'outlined'}
          onClick={() => handleFilter('Upcoming')}
        />
        <Chip
          label='Live (In-Play)'
          sx={{ color: 'white' }}
          size='large'
          variant={filters === 'Live (In-Play)' ? 'filled' : 'outlined'}
          onClick={() => handleFilter('Live (In-Play)')}
        />
      </Stack>
      <Stack mb={3} direction='row' spacing={1}>
        <Button
          color='default'
          slotProps={{ startIcon: { size: 'small' } }}
          startIcon='FiRefreshCw'
          variant='filled'
        >
          Refresh
        </Button>
        <Button
          color='default'
          slotProps={{ startIcon: { size: 'small' } }}
          startIcon='FiSliders'
          variant='filled'
        >
          Filters
        </Button>
      </Stack>
      <OddsComponent />
    </Box>
  );
}
