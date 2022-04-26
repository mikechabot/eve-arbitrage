import { memo, useCallback, useEffect, useState } from 'react';
import { Flex, VStack, Divider } from '@chakra-ui/react';
import { useSteps } from 'chakra-ui-steps';
import { Redirect } from 'react-router';

import { AppRoutes } from 'app/pages/appRoutes';

import { useAuthContext } from 'hooks/useAuthContext';
import { useAssetsPage } from 'app/pages/Assets/hooks/useAssetsPage';
import { useAssetFilters } from 'app/pages/Assets/hooks/useAssetFilters';
import { useFilteredAssets } from 'app/pages/Assets/hooks/useFilteredAssets';
import { useSelectedAssets } from 'app/pages/Assets/hooks/useSelectedAssets';

import { Fullscreen } from 'app/layout/Fullscreen';
import { Spinner } from 'app/components/Spinner';
import { Message } from 'app/components/Message';
import { Stepper } from 'app/components/Steppers/Assets';

import { AssetSelector } from 'app/pages/Assets/AssetSelector';
import { AssetsTable } from 'app/pages/Assets/components/AssetsTable';
import { FilterSlider } from 'app/pages/Assets/components/FilterSlider';
import { AssetOrderTable } from './AssetOrderTable';

const MemoizedAssetSelector = memo(AssetSelector);

export const Assets = () => {
  const { isVerified } = useAuthContext();

  const [isOpen, toggleOpen] = useState<boolean>(true);

  const {
    data: dataAssets,
    isFetching: isFetchingAssets,
    isError: isErrorAssets,
    refetch: fetchAssets,
  } = useAssetsPage();

  const { selectedItemIds, onSelectAsset } = useSelectedAssets();
  const { filterOptions, selectedFilters, onFilterGroup, onFilterStation, onFilterCategory } =
    useAssetFilters(dataAssets);

  const [searchValue, setSearchValue] = useState<string | undefined>('');

  const { filteredData } = useFilteredAssets(dataAssets, selectedFilters, searchValue);

  const { activeStep, nextStep, prevStep, setStep } = useSteps({
    initialStep: 0,
  });

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
        <Stepper
          activeStep={activeStep}
          nextStep={nextStep}
          prevStep={prevStep}
          selectedAssetCount={selectedItemIds.size}
        />
        <Divider />
        {activeStep === 0 && (
          <MemoizedAssetSelector
            searchValue={searchValue}
            selectedFilters={selectedFilters}
            filteredData={filteredData}
            selectedItemIds={selectedItemIds}
            onChangeSearch={onChangeSearch}
            onFilterGroup={onFilterGroup}
            onFilterStation={onFilterStation}
            onFilterCategory={onFilterCategory}
            onSelectAsset={onSelectAsset}
          />
        )}
        {activeStep === 1 && (
          <AssetOrderTable assets={dataAssets.assets} selectedItemIds={selectedItemIds} />
        )}
      </VStack>
    </Flex>
  );
};
