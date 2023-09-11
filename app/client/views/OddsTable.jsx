import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@components';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import React from 'react';

const marketMapping = {
  h2h: 'Moneyline',
  spreads: 'Points Spread',
  totals: 'Total Points'
};

const OddsTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        header: 'EV',
        accessorKey: 'ev',
        cell: (info) => `${parseFloat(info.getValue() * 100).toFixed(2)}%`
      },
      { header: 'Event Date', accessorKey: 'date' },
      { header: 'Event', accessorKey: 'event' },
      { header: 'Market', accessorKey: 'market' },
      { header: 'Bets', accessorKey: 'bets' },
      { header: 'Best Book', accessorKey: 'bestBook' },
      {
        header: 'No Vig Odds',
        accessorKey: 'noVigOdds',
        cell: (info) => parseFloat(info.getValue()).toFixed(2)
      },
      { header: 'Width', accessorKey: 'width' },
      { header: 'Updated', accessorKey: 'updated' }
    ],
    []
  );

  const tableData = data.flatMap((event) =>
    Object.entries(event.Market).flatMap(([marketKey, marketValue]) =>
      Object.entries(marketValue.Bets).map(([betName, betDetails]) => ({
        ev: betDetails['Expected Value'],
        date: event.Date,
        event: event.Event,
        market: marketMapping[marketKey],
        bets: `${betName} ${betDetails.BestPoint || ''}`.trim(),
        bestBook: `${betDetails['BestOdds']} (${betDetails['BestBook']})`,
        noVigOdds: betDetails.NoVigOdds,
        width: marketValue.width,
        updated: betDetails.Updated
      }))
    )
  );

  const [sorting, setSorting] = React.useState([]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  align='center'
                  onClick={header.column.getToggleSortingHandler()}
                  className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted()] ?? null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} align='center'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OddsTable;
