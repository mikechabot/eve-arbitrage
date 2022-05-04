import React, { FC, useState, useEffect, useCallback } from 'react';
import { Box, Divider } from '@chakra-ui/react';

import { usePostOrder } from 'services/hooks/useMutations';

import { OrderAssetTable } from 'app/pages/Orders/components/OrderAssetTable';
import { MarkupPercentage } from 'app/pages/Orders/components/MarkupPercentage';

import { EveInventoryAssetsApiV5 } from 'services/types/character-api';
import { EveMarketOrderAsset, OrderAssetSalePrice } from 'app/pages/Orders/types';

interface OrderManagementProps {
  assets: EveInventoryAssetsApiV5;
  selectedItemIds: Set<number>;
}

export const OrderManagement: FC<OrderManagementProps> = ({ assets, selectedItemIds }) => {
  const [salePriceMap, setSalePriceMap] = useState<OrderAssetSalePrice>({});
  const [marketOrderAssets, setMarketOrderAssets] = useState<EveMarketOrderAsset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<EveInventoryAssetsApiV5>([]);
  const [markupPercentage, setMarkupPercentage] = useState<number>(102);

  const { data, isError, isLoading, mutate } = usePostOrder();

  /**
   * Map selectedItemIds to actual assets
   */
  useEffect(() => {
    const items = assets.filter((asset) => selectedItemIds.has(asset.item_id));
    setSelectedAssets(items);
  }, [assets, selectedItemIds, setSelectedAssets]);

  /**
   * Fetch asset orders by type ids
   */
  useEffect(() => {
    const typeIds = selectedAssets.map((asset) => asset.type_id);
    mutate(typeIds);
  }, [selectedAssets, mutate]);

  /**
   * Merge fetched orders with selected assets
   */
  useEffect(() => {
    const orderAssets: EveMarketOrderAsset[] = [];
    selectedAssets.forEach((asset) => {
      const map = data?.orderByTypeId || {};
      const order = map[asset.type_id];
      orderAssets.push({ asset, order });
    });
    setMarketOrderAssets(orderAssets);
  }, [data, selectedAssets, setMarketOrderAssets]);

  const onChangeAssetQuantity = useCallback(
    (itemId: number, quantity: number) => {
      setSalePriceMap((prev) => ({ ...prev, [itemId]: quantity }));
    },
    [setSalePriceMap],
  );

  return (
    <>
      <Box py={2} px={6} width="100%">
        <MarkupPercentage
          markupPercentage={markupPercentage}
          setMarkupPercentage={setMarkupPercentage}
        />
      </Box>
      <Divider />
      <OrderAssetTable
        orderAssets={marketOrderAssets}
        salePriceMap={salePriceMap}
        markupPercentage={markupPercentage}
        isLoading={isLoading}
        isError={isError}
        onChangeAssetQuantity={onChangeAssetQuantity}
      />
    </>
  );
};
