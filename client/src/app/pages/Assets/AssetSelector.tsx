import { FC, memo } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { MdOutlineSearch } from 'react-icons/md';

import { AssetCard } from 'app/pages/Assets/components/AssetCard';
import { FilterPills } from 'app/pages/Assets/components/Filters';
import { FilterState, FilterFunc } from 'app/pages/Assets/components/Filters/types';

import { EveInventoryAssetsApiV5 } from 'services/types/character-api';

const MemoizedAssetCard = memo(AssetCard);

interface AssetSelectorProps {
  searchValue: string | undefined;
  selectedFilters: FilterState;
  filteredData: EveInventoryAssetsApiV5;
  resultsCount: number;
  selectedItemIds: Set<number>;
  onChangeSearch: (e: any) => void;
  onFilterGroup: FilterFunc;
  onFilterStation: FilterFunc;
  onFilterCategory: FilterFunc;
  onSelectAsset: (itemId: number) => void;
  onClearAll: () => void;
  onRemoveAll: () => void;
}

export const AssetSelector: FC<AssetSelectorProps> = ({
  searchValue,
  selectedFilters,
  filteredData,
  resultsCount,
  selectedItemIds,
  onChangeSearch,
  onFilterGroup,
  onFilterStation,
  onFilterCategory,
  onSelectAsset,
  onClearAll,
  onRemoveAll,
}) => (
  <>
    <Flex width="100%">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <MdOutlineSearch color="gray.300" />
        </InputLeftElement>
        <Input type="text" value={searchValue} placeholder="Search" onChange={onChangeSearch} />
      </InputGroup>
    </Flex>
    <Flex py={2} alignItems="center" justifyContent="space-between" width="100%">
      <Text fontSize="sm" fontWeight={600}>
        Showing {resultsCount} results
      </Text>
      <Button
        disabled={selectedItemIds.size === 0}
        backgroundColor="red.100"
        color="white"
        onClick={onRemoveAll}
        size="xs"
      >
        Remove All
      </Button>
    </Flex>
    <FilterPills
      searchValue={searchValue}
      selectedFilters={selectedFilters}
      onChangeSearch={onChangeSearch}
      onFilterGroup={onFilterGroup}
      onFilterStation={onFilterStation}
      onFilterCategory={onFilterCategory}
      onClearAll={onClearAll}
    />
    <SimpleGrid width="100%" minChildWidth={275} spacing={2}>
      {filteredData?.map((asset) => (
        <MemoizedAssetCard
          key={asset.item_id}
          asset={asset}
          onSelectAsset={onSelectAsset}
          isSelected={selectedItemIds.has(asset.item_id)}
        />
      ))}
    </SimpleGrid>
  </>
);
