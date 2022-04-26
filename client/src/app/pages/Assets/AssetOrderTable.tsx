import { FC, memo, useState, useEffect, useCallback } from 'react';
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

import { usePostOrder } from 'services/hooks/useMutations';

import { AssetIcon } from 'app/pages/Assets/components/AssetCard/AssetIcon';

import { EveMarketOrderApiV1 } from 'services/types/assets-api';
import { EveInventoryAssetsApiV5, EveInventoryAssetV5 } from 'services/types/character-api';

interface AssetOrderTableProps {
  assets: EveInventoryAssetsApiV5;
  selectedItemIds: Set<number>;
}

interface MergedAsset {
  order?: EveMarketOrderApiV1;
  asset: EveInventoryAssetV5;
}

type SellPriceMap = Record<number, number>;

const MemoizedSpinner = memo(() => <Spinner color="secondary" size="sm" speed="0.5s" />);

export const AssetOrderTable: FC<AssetOrderTableProps> = ({ assets, selectedItemIds }) => {
  const [sellPriceMap, setSellPriceMap] = useState<SellPriceMap>({});
  const [mergedAssets, setMergedAssets] = useState<MergedAsset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<EveInventoryAssetsApiV5>([]);

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
    const merged: MergedAsset[] = [];
    selectedAssets.forEach((asset) => {
      const map = data?.orderByTypeId || {};
      const order = map[asset.type_id];
      merged.push({ asset, order });
    });
    setMergedAssets(merged);
  }, [data, selectedAssets, setMergedAssets]);

  const onChangeQuantity = useCallback(
    (itemId: number, quantity: number) => {
      setSellPriceMap((prev) => ({ ...prev, [itemId]: quantity }));
    },
    [setSellPriceMap],
  );

  let defaultPriceCell;
  let defaultSellPrice;
  if (isLoading) {
    defaultPriceCell = <MemoizedSpinner />;
    defaultSellPrice = <MemoizedSpinner />;
  } else if (isError) {
    defaultPriceCell = <Text color="red.100">Error</Text>;
    defaultSellPrice = <Text color="red.100">No Calc</Text>;
  }

  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>Asset</Th>
          <Th>Price (ISK)</Th>
          <Th>Quantity</Th>
          <Th>Sell Price (ISK)</Th>
        </Tr>
      </Thead>
      <Tbody>
        {mergedAssets.map(({ asset, order }) => {
          return (
            <Tr key={asset.item_id}>
              <Td>
                <AssetIcon
                  typeId={asset.type_id}
                  categoryName={asset.categoryName}
                  typeName={asset.typeName}
                  isSelected={false}
                  onClickAsset={undefined}
                />
              </Td>
              <Td>{defaultPriceCell || Number(order?.price || 0).toLocaleString()}</Td>
              <Td>
                <NumberInput
                  defaultValue={asset.quantity}
                  min={1}
                  max={asset.quantity}
                  size="sm"
                  onChange={(_, valueAsNumber) => onChangeQuantity(asset.item_id, valueAsNumber)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Td>
              <Td>
                {/* @ts-ignore  */}
                {defaultSellPrice ||
                  Number(
                    (order?.price || 0) * (sellPriceMap[asset.item_id] || asset.quantity),
                  ).toLocaleString()}
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
