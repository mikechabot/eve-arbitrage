import React from 'react';
import { Flex, Icon, Thead, Tr, Th, Text } from '@chakra-ui/react';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const SortDown = () => <Icon ml={1} as={FaSortAmountDown} />;
const SortUp = () => <Icon ml={1} as={FaSortAmountUp} />;

export const TableHeaders = ({ headerGroups }) => (
  <Thead>
    {headerGroups.map((headerGroup) => (
      <Tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map((column) => (
          <Th {...column.getHeaderProps()}>
            <Flex alignItems="center">
              <Text as="span" fontSize="sm" {...column.getSortByToggleProps()}>
                {column.render('Header')}
              </Text>
              <Flex alignContent="center">
                {/* eslint-disable-next-line no-nested-ternary */}
                {column.isSorted ? column.isSortedDesc ? <SortDown /> : <SortUp /> : ''}
              </Flex>
            </Flex>
            <div>{column.canFilter ? column.render('Filter') : null}</div>
          </Th>
        ))}
      </Tr>
    ))}
  </Thead>
);
