import React from 'react';
import { Select } from '@chakra-ui/react';

/**
 * Calculate the options for filtering using the preFilteredRows
 * @param filterValue
 * @param setFilter
 * @param preFilteredRows
 * @param id
 * @constructor
 */
export const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  const countMap: Record<string, number> = React.useMemo(() => ({}), []);

  const options = React.useMemo(() => {
    const opts = new Set();

    preFilteredRows.forEach((row) => {
      const val = row.values[id];
      if (opts.has(val)) {
        countMap[val] += 1;
      } else {
        countMap[val] = 1;
        opts.add(val);
      }
    });
    return [...opts.values()];
  }, [id, countMap, preFilteredRows]);

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
          {option as string} ({countMap[option as string]})
        </option>
      ))}
    </Select>
  );
};
