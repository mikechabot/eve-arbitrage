import { FC } from 'react';
import { Button, Flex, HStack, SimpleGrid, Text } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';

import { FilterFunc, FilterState } from 'app/pages/Assets/components/FilterSlider/types';
import { MemoizedFilterPillSet } from 'app/pages/Assets/components/FilterPills/FilterPillSet';

interface FilterPillsProps {
  searchValue: string | undefined;
  selectedFilters: FilterState;
  onChangeSearch: (e: any) => void;
  onFilterGroup: FilterFunc;
  onFilterStation: FilterFunc;
  onFilterCategory: FilterFunc;
}

/**
 * Maintain a list of pills that denote which filters have been selected
 * and which text value is being searched on.
 *
 * Note: Add "style={{marginTop: 'unset'}}" to the outer container. We need
 * to unset the padding that comes from the parent component's <VStack /> as
 * the buttons are adding padding on their own (used for flex wrapping).
 * @param searchValue
 * @param selectedFilters
 * @param onChangeSearch
 * @param onFilterGroup
 * @param onFilterStation
 * @param onFilterCategory
 * @constructor
 */
export const FilterPills: FC<FilterPillsProps> = ({
  searchValue,
  selectedFilters,
  onChangeSearch,
  onFilterGroup,
  onFilterStation,
  onFilterCategory,
}) => (
  <Flex width="100%" flexWrap="wrap" style={{ marginTop: 'unset' }}>
    {searchValue && (
      <Button
        mt={2}
        mr={2}
        maxWidth={200}
        rightIcon={<MdClose />}
        onClick={() =>
          onChangeSearch({
            target: {
              value: '',
            },
          })
        }
      >
        <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          "{searchValue}"
        </Text>
      </Button>
    )}
    <MemoizedFilterPillSet set={selectedFilters.categories} onClick={onFilterCategory} />
    <MemoizedFilterPillSet set={selectedFilters.groups} onClick={onFilterGroup} />
    <MemoizedFilterPillSet set={selectedFilters.stations} onClick={onFilterStation} />
  </Flex>
);
