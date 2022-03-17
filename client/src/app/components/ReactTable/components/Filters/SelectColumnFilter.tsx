import React from 'react';
import { Select } from '@chakra-ui/react';

export const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const opts = new Set();
    preFilteredRows.forEach((row) => {
      opts.add(row.values[id]);
    });
    return [...opts.values()];
  }, [id, preFilteredRows]);

  return (
    <Select
      size="xs"
      mt={2}
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={`${option}`} value={option as string}>
          {option as string}
        </option>
      ))}
    </Select>
  );
};
