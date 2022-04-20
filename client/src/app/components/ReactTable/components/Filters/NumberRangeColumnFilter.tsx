// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
import React from 'react';
import {
  Flex,
  Text,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';

export const NumberRangeColumnFilter = ({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) => {
  const [min, max] = React.useMemo(() => {
    let mn = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let mx = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      mn = Math.min(row.values[id], mn);
      mx = Math.max(row.values[id], mx);
    });
    return [mn, mx];
  }, [id, preFilteredRows]);

  return (
    <Flex alignItems="center" mt={2}>
      <NumberInput
        size="xs"
        width={32}
        min={1}
        max={max}
        value={filterValue[0] || ''}
        onChange={(valueString) => {
          setFilter((old = []) => [valueString ? parseInt(valueString, 10) : undefined, old[1]]);
        }}
      >
        <NumberInputField placeholder={`Min (${min})`} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Text px={2}>to</Text>
      <NumberInput
        size="xs"
        width={32}
        min={1}
        max={max}
        value={filterValue[1] || ''}
        onChange={(valueString) => {
          setFilter((old = []) => [old[0], valueString ? parseInt(valueString, 10) : undefined]);
        }}
      >
        <NumberInputField placeholder={`Max (${max})`} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
};
