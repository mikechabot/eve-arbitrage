import React from 'react';
import { Thead, Tr, Th } from '@chakra-ui/react';

export const TableHeaders = ({ headerGroups }) => (
  <Thead>
    {headerGroups.map((headerGroup) => (
      <Tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map((column) => (
          <Th {...column.getHeaderProps()}>
            <div>
              <span {...column.getSortByToggleProps()}>
                {column.render('Header')}
                {/* Add a sort direction indicator */}
                {/* eslint-disable-next-line no-nested-ternary */}
                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
              </span>
            </div>
            {/* Render the columns filter UI */}
            <div>{column.canFilter ? column.render('Filter') : null}</div>
          </Th>
        ))}
      </Tr>
    ))}
  </Thead>
);
