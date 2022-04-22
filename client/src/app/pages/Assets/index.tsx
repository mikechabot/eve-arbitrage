import { memo, useCallback, useEffect, useState } from 'react';
import { Flex, SimpleGrid, InputGroup, InputLeftElement, Input, VStack } from '@chakra-ui/react';
import { MdOutlineSearch } from 'react-icons/md';
import { Redirect } from 'react-router';

import { AppRoutes } from 'app/pages/appRoutes';

import { useAuthContext } from 'hooks/useAuthContext';
import { useAssetsPage } from 'app/pages/Assets/hooks/useAssetsPage';
import { useAssetFilters } from 'app/pages/Assets/hooks/useAssetFilters';
import { useFilteredAssets } from 'app/pages/Assets/hooks/useFilteredAssets';

import { Fullscreen } from 'app/layout/Fullscreen';
import { Spinner } from 'app/components/Spinner';
import { Message } from 'app/components/Message';

import { AssetsTable } from 'app/pages/Assets/components/AssetsTable';
import { FilterSlider } from 'app/pages/Assets/components/FilterSlider';
import { AssetCard } from 'app/pages/Assets/components/AssetCard';
import { FilterPills } from 'app/pages/Assets/components/FilterPills';

const MemoizedAssetCard = memo(AssetCard);

export const Assets = () => {
  const { isVerified } = useAuthContext();

  const [isOpen, toggleOpen] = useState<boolean>(true);

  const {
    data: dataAssets,
    isFetching: isFetchingAssets,
    isError: isErrorAssets,
    refetch: fetchAssets,
  } = useAssetsPage();

  const { filterOptions, selectedFilters, onFilterGroup, onFilterStation, onFilterCategory } =
    useAssetFilters(dataAssets);

  const [searchValue, setSearchValue] = useState<string | undefined>('');

  const { filteredData } = useFilteredAssets(dataAssets, selectedFilters, searchValue);

  useEffect(() => {
    if (isVerified) {
      fetchAssets();
    }
  }, [isVerified, fetchAssets]);

  const onChangeSearch = useCallback(
    (e) => {
      setSearchValue(e.target.value);
    },
    [setSearchValue],
  );

  if (!isVerified) {
    return <Redirect to={AppRoutes.Home} />;
  }

  if (isErrorAssets) {
    return (
      <Fullscreen>
        <Message message="Error fetching assets" />
      </Fullscreen>
    );
  }

  if (!dataAssets || isFetchingAssets) {
    return (
      <Fullscreen>
        <Spinner label="Loading Assets..." />
      </Fullscreen>
    );
  }

  return (
    <Flex>
      <FilterSlider
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        filters={filterOptions}
        selectedFilters={selectedFilters}
        onFilterGroup={onFilterGroup}
        onFilterStation={onFilterStation}
        onFilterCategory={onFilterCategory}
      />
      <VStack spacing={2} py={2} px={4} width="100%" alignItems="flex-start">
        <Flex width="100%">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <MdOutlineSearch color="gray.300" />
            </InputLeftElement>
            <Input type="text" value={searchValue} placeholder="Search" onChange={onChangeSearch} />
          </InputGroup>
        </Flex>
        <FilterPills
          searchValue={searchValue}
          selectedFilters={selectedFilters}
          onChangeSearch={onChangeSearch}
          onFilterGroup={onFilterGroup}
          onFilterStation={onFilterStation}
          onFilterCategory={onFilterCategory}
        />
        <SimpleGrid width="100%" minChildWidth={275} spacing={2}>
          {filteredData?.map((asset) => (
            <MemoizedAssetCard key={asset.item_id} asset={asset} />
          ))}
        </SimpleGrid>
      </VStack>
    </Flex>
  );
};
