import React from 'react';
import { Flex, Button, Select, NumberInput, NumberInputField, Text } from '@chakra-ui/react';
import { Divider } from '../Divider';

const buttonsProps = {
  size: 'sm',
  color: 'secondary',
  backgroundColor: 'base',
  _hover: { backgroundColor: 'primary', color: 'secondary' },
};

export const Pagination = ({
  goToPage,
  nextPage,
  previousPage,
  setPageSize,
  pageSize,
  pageCount,
  pageIndex,
  pageOptions,
  canPreviousPage,
  canNextPage,
}) => (
  <Flex alignItems="center" justifyContent="center" width="100%">
    <Button onClick={() => goToPage(0)} disabled={!canPreviousPage} {...buttonsProps}>
      {'<<'}
    </Button>
    <Button onClick={previousPage} disabled={!canPreviousPage} {...buttonsProps}>
      {'<'}
    </Button>
    <Button onClick={nextPage} disabled={!canNextPage} {...buttonsProps}>
      {'>'}
    </Button>
    <Button onClick={() => goToPage(pageCount - 1)} disabled={!canNextPage} {...buttonsProps}>
      {'>>'}
    </Button>
    <Divider />
    <Flex>
      Page
      <Text fontWeight="bold" pl={2}>
        {pageIndex + 1} of {pageOptions.length}
      </Text>{' '}
    </Flex>
    <Divider />
    <Flex alignItems="center">
      Go to page:
      <NumberInput
        pl={2}
        size="sm"
        width={20}
        defaultValue={pageIndex + 1}
        onChange={(valueString) => {
          goToPage(valueString ? Number(valueString) - 1 : 0);
        }}
      >
        <NumberInputField />
      </NumberInput>
    </Flex>
    <Divider />
    <Select
      size="sm"
      width={32}
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
      }}
    >
      {[10, 25, 50, 100, 200].map((pgSize) => (
        <option key={pgSize} value={pgSize}>
          Show {pgSize}
        </option>
      ))}
    </Select>
  </Flex>
);
