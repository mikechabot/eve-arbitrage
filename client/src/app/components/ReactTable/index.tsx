import React from 'react';
import { Flex, Table, Box, useBreakpointValue } from '@chakra-ui/react';
import { useFilters, useGroupBy, useRowSelect, useSortBy, useTable } from 'react-table';

import { TableBody } from 'app/components/ReactTable/TableBody';
import { TableHeaders } from 'app/components/ReactTable/TableHeaders';

import { BasicCell } from 'app/components/ReactTable/components/Cells/BasicCell';
import { IconCell } from 'app/components/ReactTable/components/Cells/IconCell';

import { DefaultColumnFilter } from 'app/components/ReactTable/components/Filters';
import { IndeterminateCheckbox } from 'app/components/ReactTable/components/IndeterminateCheckbox';

import { fuzzyTextFilterFn } from 'app/components/ReactTable/components/Filters/utils';

interface ReactTableProps {
  columns: any[];
  data: any[];
}

export const ReactTable: React.FC<ReactTableProps> = ({ columns, data }) => {
  const tableHeight = useBreakpointValue({ base: '80vh', sm: '500px', md: '80vh' });

  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    [],
  );

  const defaultColumn = React.useMemo(
    () => ({
      Cell: BasicCell,
      Icon: IconCell,
      Filter: DefaultColumnFilter,
    }),
    [],
  );

  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      disableMultiSort: true,
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((cols) => {
        return [
          {
            id: 'selection',
            groupByBoundary: true,
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...cols,
        ];
      });
    },
  );

  const typeIds: number[] = [];
  const indices = Object.keys(selectedRowIds || []);
  indices.forEach((index) => {
    typeIds.push(data[index].type_id);
  });

  return (
    <Box border="1px solid red" height={tableHeight} overflow="auto">
      <Table {...getTableProps()} width="100%" size="sm" colorScheme="gray">
        <TableHeaders headerGroups={headerGroups} />
        <TableBody rows={rows} prepareRow={prepareRow} getTableBodyProps={getTableBodyProps} />
      </Table>
    </Box>
  );
};
