import React from 'react';
import { Flex, Table } from '@chakra-ui/react';
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGroupBy,
  useExpanded,
  useRowSelect,
} from 'react-table';

import { TableBody } from 'app/components/ReactTable/TableBody';
import { TableHeaders } from 'app/components/ReactTable/TableHeaders';
import { Pagination } from 'app/components/ReactTable/Pagination';

import { BasicCell } from 'app/components/ReactTable/components/Cells/BasicCell';
import { IconCell } from 'app/components/ReactTable/components/Cells/IconCell';

import { DefaultColumnFilter } from 'app/components/ReactTable/components/Filters';
import { IndeterminateCheckbox } from 'app/components/ReactTable/components/IndeterminateCheckbox';

import { fuzzyTextFilterFn } from 'app/components/ReactTable/components/Filters/utils';

export const ReactTable = ({ columns, data }) => {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
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

  // Use the state and functions returned from useTable to build your UI
  const {
    page,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
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
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((cols) => {
        return [
          {
            id: 'selection',
            // Make this column a groupByBoundary. This ensures that groupBy columns
            // are placed after it
            groupByBoundary: true,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
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

  return (
    <Flex flexDirection="column" width="100%" pt={4}>
      <Flex justifyContent="center">
        <Pagination
          goToPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          setPageSize={setPageSize}
          pageSize={pageSize}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageOptions={pageOptions}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
        />
      </Flex>
      <Flex width="100%" flex={1} overflowX="auto" overflowY="auto" pt={4}>
        <Table {...getTableProps()} width="100%" size="sm" colorScheme="pink">
          <TableHeaders headerGroups={headerGroups} />
          <TableBody page={page} prepareRow={prepareRow} getTableBodyProps={getTableBodyProps} />
        </Table>
      </Flex>
    </Flex>
  );
};
