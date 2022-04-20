import React from 'react';
import { Tbody, Tr, Td } from '@chakra-ui/react';

export const TableBody = ({ rows, prepareRow, getTableBodyProps }) => (
  <Tbody {...getTableBodyProps()}>
    {rows.map((row) => {
      prepareRow(row);
      return (
        <Tr {...row.getRowProps()}>
          {row.cells.map((cell) => {
            return (
              <Td {...cell.getCellProps()}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {cell.isAggregated
                  ? // If the cell is aggregated, use the Aggregated
                    // renderer for cell
                    cell.render('Aggregated')
                  : cell.isPlaceholder
                  ? null // For cells with repeated values, render null
                  : // Otherwise, just render the regular cell
                    cell.render('Cell', { editable: true })}
              </Td>
            );
          })}
        </Tr>
      );
    })}
  </Tbody>
);
