import { useEffect, useState } from 'react';
import { Flex, Button, SimpleGrid } from '@chakra-ui/react';
import { Redirect } from 'react-router';

import { AppRoutes } from 'app/pages/appRoutes';

import { useAuthContext } from 'hooks/useAuthContext';
import { useAssetsPage } from 'app/pages/Assets/hooks/useAssetsPage';
import { useAssetFilters } from 'app/pages/Assets/hooks/useAssetFilters';

import { Fullscreen } from 'app/layout/Fullscreen';
import { Spinner } from 'app/components/Spinner';
import { ErrorMessage } from 'app/components/ErrorMessage';

import { AssetsTable } from 'app/pages/Assets/components/AssetsTable';
import { AssetsFilter } from 'app/pages/Assets/components/AssetsFilter';
import { AssetCard } from 'app/pages/Assets/components/AssetCard';

export const Assets = () => {
  const { isVerified } = useAuthContext();

  const [isOpen, toggleOpen] = useState<boolean>(true);

  const {
    data: dataAssets,
    isFetching: isFetchingAssets,
    isError: isErrorAssets,
    refetch: fetchAssets,
  } = useAssetsPage();

  const { filterOptions, onClickFilterOption, filteredData } = useAssetFilters(dataAssets);

  useEffect(() => {
    if (isVerified) {
      fetchAssets();
    }
  }, [isVerified, fetchAssets]);

  if (!isVerified) {
    return <Redirect to={AppRoutes.Home} />;
  }

  if (isErrorAssets) {
    return (
      <Fullscreen>
        <ErrorMessage message="Error fetching assets" />
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
    <>
      <Button onClick={() => toggleOpen((prev) => !prev)}>Open Drawer</Button>
      <Flex>
        <AssetsFilter isOpen={isOpen} filters={filterOptions} onClickFilter={onClickFilterOption} />
        <Flex flex={1} height="100%">
          <SimpleGrid width="100%" minChildWidth={200} spacing={10} pl={isOpen ? 6 : 0}>
            {filteredData?.map((asset) => (
              <AssetCard key={asset.item_id} asset={asset} />
            ))}
          </SimpleGrid>
        </Flex>
      </Flex>
    </>
  );
};

// <Box bg="tomato" height="80px"></Box>
// <Box bg="tomato" height="80px"></Box>
// <Box bg="tomato" height="80px"></Box>
// <Box bg="tomato" height="80px"></Box>
// <Box bg="tomato" height="80px"></Box>
