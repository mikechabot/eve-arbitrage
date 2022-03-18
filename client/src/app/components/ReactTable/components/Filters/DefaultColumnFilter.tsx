import React from 'react';
import { Input } from '@chakra-ui/react';

export const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
  const count = preFilteredRows.length;
  return (
    <Input
      size="xs"
      mt={2}
      value={filterValue || ''}
      onChange={({ target }) => {
        setFilter(target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};
