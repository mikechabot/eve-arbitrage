import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Button, Select, NumberInput, NumberInputField, Text, Icon } from '@chakra-ui/react';
import { MdFirstPage, MdLastPage, MdChevronLeft, MdChevronRight } from 'react-icons/md';

import { Divider } from 'app/components/Divider';

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
  selectedTypeIds,
}) => (
  <Flex alignItems="center" justifyContent="center" width="100%" flexWrap="wrap">
    <Button onClick={() => goToPage(0)} disabled={!canPreviousPage} {...buttonsProps}>
      <Icon w={6} h={6} as={MdFirstPage} />
    </Button>
    <Button onClick={previousPage} disabled={!canPreviousPage} {...buttonsProps}>
      <Icon w={6} h={6} as={MdChevronLeft} />
    </Button>
    <Button onClick={nextPage} disabled={!canNextPage} {...buttonsProps}>
      <Icon w={6} h={6} as={MdChevronRight} />
    </Button>
    <Button onClick={() => goToPage(pageCount - 1)} disabled={!canNextPage} {...buttonsProps}>
      <Icon w={6} h={6} as={MdLastPage} />
    </Button>
    <Divider />
    <Flex>
      Page
      <Text fontWeight="bold" pl={2}>
        {pageIndex + 1} of {pageOptions.length}
      </Text>{' '}
    </Flex>
    <Flex>
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

      <Link
        to={{
          pathname: '/orders',
          state: { selectedTypeIds },
        }}
      >
        <Button
          ml={2}
          size="sm"
          color="primary"
          backgroundColor="secondary"
          _hover={{ backgroundColor: 'primary', color: 'secondary' }}
          disabled={selectedTypeIds.length === 0}
        >
          Fetch {selectedTypeIds.length} Order(s)
        </Button>
      </Link>
    </Flex>
  </Flex>
);
