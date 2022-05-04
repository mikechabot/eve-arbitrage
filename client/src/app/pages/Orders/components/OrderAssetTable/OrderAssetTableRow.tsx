import { FC, ReactNode } from 'react';

import {
  Tr,
  Td,
  Text,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
} from '@chakra-ui/react';

import { AssetIcon } from 'app/components/AssetIcon';

import { EveMarketOrderAsset, OrderAssetSalePrice } from 'app/pages/Orders/types';

interface OrderAssetTableRowProps {
  orderAsset: EveMarketOrderAsset;
  defaultPriceCell: ReactNode | undefined;
  defaultSalePrice: ReactNode | undefined;
  salePriceMap: OrderAssetSalePrice;
  markupPercentage: number;
  onSelectAsset: (itemId: number) => void;
  onChangeAssetQuantity: (itemId: number, quantity: number) => void;
}

export const OrderAssetTableRow: FC<OrderAssetTableRowProps> = ({
  orderAsset,
  defaultPriceCell,
  defaultSalePrice,
  salePriceMap,
  markupPercentage,
  onSelectAsset,
  onChangeAssetQuantity,
}) => {
  const { asset, order } = orderAsset;
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
      <Td>
        <NumberInput
          isDisabled={asset.quantity === 1}
          defaultValue={asset.quantity}
          min={1}
          max={asset.quantity}
          size="sm"
          width="150px"
          onChange={(_, valueAsNumber) => onChangeAssetQuantity(asset.item_id, valueAsNumber)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Td>
      <Td isNumeric>
        {defaultPriceCell || (
          <Text fontFamily="mono" fontSize="xs">
            {Number(order?.price || 0).toLocaleString('us-en', {
              minimumFractionDigits: 2,
            })}{' '}
            ISK
          </Text>
        )}
      </Td>
      <Td isNumeric>
        {/* @ts-ignore  */}
        {defaultSalePrice || (
          <Text color="green.200" fontFamily="mono" fontSize="xs" fontWeight="bold">
            {Number(
              (order?.price || 0) *
                (salePriceMap[asset.item_id] || asset.quantity) *
                (markupPercentage / 100),
            ).toLocaleString('us-en', { minimumFractionDigits: 2 })}{' '}
            ISK
          </Text>
        )}
      </Td>
      <Td isNumeric>
        <Button
          onClick={() => onSelectAsset(asset.item_id)}
          size="xs"
          backgroundColor="red.100"
          color="white"
        >
          Remove
        </Button>
      </Td>
    </Tr>
  );
};
