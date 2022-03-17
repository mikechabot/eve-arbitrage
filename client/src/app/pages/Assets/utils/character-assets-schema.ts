import { useMemo } from 'react';

import {
  SelectColumnFilter,
  NumberRangeColumnFilter,
} from 'app/components/ReactTable/components/Filters';

import { IconCell } from 'app/components/ReactTable/components/Cells/IconCell';

export const useCharacterAssetsSchema = () => {
  return useMemo(
    () => [
      {
        Header: 'Type',
        accessor: (row) => ({
          typeId: row.type_id,
          categoryName: row.categoryName,
          typeName: row.typeName,
        }),
        filter: 'fuzzyText',
        aggregate: 'uniqueCount',
        Cell: IconCell,
        Aggregated: ({ value }) => `${value} Unique Names`,
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        Filter: NumberRangeColumnFilter,
        filter: 'between',
        aggregate: 'sum',
        Aggregated: ({ value }) => `${value} (total)`,
      },
      {
        Header: 'Station',
        accessor: 'stationName',
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: 'Category',
        accessor: 'categoryName',
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: 'Group',
        accessor: 'groupName',
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
    ],
    [],
  );
};
