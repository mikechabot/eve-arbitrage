import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, VStack, useMediaQuery, Box } from '@chakra-ui/react';
import { Redirect, useHistory } from 'react-router';

import { useSelectedAssets } from 'hooks/useSelectedAssetsContext';

import { AppRoutes } from 'app/pages/appRoutes';

import { useAuthContext } from 'hooks/useAuthContext';
import { useAssetsPage } from 'app/pages/Assets/hooks/useAssetsPage';
import { useAssetFilters } from 'app/pages/Assets/hooks/useAssetFilters';
import { useFilteredAssets } from 'app/pages/Assets/hooks/useFilteredAssets';

import {
  FilterDrawer,
  FilterSlider,
  FiltersButtonMobile,
} from 'app/pages/Assets/components/Filters';

import { Fullscreen } from 'app/layout/Fullscreen';
import { Spinner } from 'app/components/Spinner';
import { Message } from 'app/components/Message';
import { Stepper } from 'app/components/Steppers/Assets';

import { AssetSelector } from 'app/pages/Assets/AssetSelector';

const MemoizedAssetSelector = memo(AssetSelector);

export const Assets = () => {
  const { isVerified } = useAuthContext();
  const history = useHistory();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const {
    data: dataAssets,
    isFetching: isFetchingAssets,
    isError: isErrorAssets,
    refetch: fetchAssets,
  } = useAssetsPage();

  const { selectedItemIds, onSelectAsset, onRemoveAll} = useSelectedAssets();

  const {
    filterOptions,
    selectedFilters,
    onFilterGroup,
    onFilterStation,
    onFilterCategory,
    onClearAll,
  } = useAssetFilters(dataAssets);

  const [searchValue, setSearchValue] = useState<string | undefined>('');

  const { filteredData } = useFilteredAssets(dataAssets, selectedFilters, searchValue);

  const filterProps = useMemo(
    () => ({
      selectedFilters,
      onFilterGroup,
      onFilterStation,
      onFilterCategory,
      filters: filterOptions,
    }),
    [filterOptions, selectedFilters, onFilterGroup, onFilterStation, onFilterCategory],
  );

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

  const toggleSliderOpen = useCallback(() => {
    setIsSliderOpen((prev) => !prev);
  }, [setIsSliderOpen]);

  const toggleDrawerOpen = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, [setIsDrawerOpen]);

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
    <VStack width="100%" spacing={0}>
      <Box py={2} px={4} width="100%">
        <Stepper
          activeStep={0}
          nextStep={() => history.push(AppRoutes.Orders)}
          prevStep={() => ({})}
          selectedAssetCount={selectedItemIds.size}
          isLargerThan768={isLargerThan768}
        />
      </Box>
      <Flex width="100%" borderTop="1px solid" borderColor="gray.200">
        <FilterSlider
          isOpen={isSliderOpen}
          toggleOpen={toggleSliderOpen}
          isLargerThan768={isLargerThan768}
          {...filterProps}
        />
        <FilterDrawer
          isOpen={isDrawerOpen}
          resultsCount={filteredData.length}
          toggleDrawerOpen={toggleDrawerOpen}
          {...filterProps}
        />

        <FiltersButtonMobile toggleOpen={toggleDrawerOpen} isLargerThan768={isLargerThan768} />

        <VStack spacing={2} py={2} px={4} width="100%" alignItems="flex-start">
          <MemoizedAssetSelector
            searchValue={searchValue}
            filteredData={filteredData}
            resultsCount={filteredData.length}
            selectedItemIds={selectedItemIds}
            onChangeSearch={onChangeSearch}
            onSelectAsset={onSelectAsset}
            onClearAll={onClearAll}
            onRemoveAll={onRemoveAll}
            {...filterProps}
          />
        </VStack>
      </Flex>
    </VStack>
  );
};
