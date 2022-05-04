import { FC, memo, useMemo } from 'react';
import { Spinner, Table, Tbody, Text } from '@chakra-ui/react';

import { useSelectedAssets } from 'hooks/useSelectedAssetsContext';

import { EveMarketOrderAsset, OrderAssetSalePrice } from 'app/pages/Orders/types';

import { OrderAssetTableHeader } from 'app/pages/Orders/components/OrderAssetTable/OrderAssetTableHeader';
import { OrderAssetTableRow } from 'app/pages/Orders/components/OrderAssetTable/OrderAssetTableRow';

interface OrderAssetTableProps {
  orderAssets: EveMarketOrderAsset[];
  salePriceMap: OrderAssetSalePrice;
  markupPercentage: number;
  isError: boolean;
  isLoading: boolean;
  onChangeAssetQuantity: (itemId: number, quantity: number) => void;
}

const MemoizedSpinner = memo(() => <Spinner color="secondary" size="sm" speed="0.5s" />);
const Error = memo(() => <Text color="red.100">Error</Text>);
const NoCalc = memo(() => <Text color="red.100">No Calc</Text>);

export const OrderAssetTable: FC<OrderAssetTableProps> = ({
  orderAssets,
  salePriceMap,
  markupPercentage,
  isLoading,
  isError,
  onChangeAssetQuantity,
}) => {
  const { onSelectAsset } = useSelectedAssets();

  const defaultPriceCell = useMemo(() => {
    if (isLoading) {
      return <MemoizedSpinner />;
    }
    if (isError) {
      return <Error />;
    }
    return undefined;
  }, [isLoading, isError]);

  const defaultSalePrice = useMemo(() => {
    if (isLoading) {
      return <MemoizedSpinner />;
    }
    if (isError) {
      return <NoCalc />;
    }
    return undefined;
  }, [isLoading, isError]);

  return (
    <Table size="sm">
      <OrderAssetTableHeader />
      <Tbody>
        {orderAssets.map((orderAsset) => (
          <OrderAssetTableRow
            orderAsset={orderAsset}
            defaultPriceCell={defaultPriceCell}
            defaultSalePrice={defaultSalePrice}
            salePriceMap={salePriceMap}
            markupPercentage={markupPercentage}
            onChangeAssetQuantity={onChangeAssetQuantity}
            onSelectAsset={onSelectAsset}
          />
        ))}
      </Tbody>
    </Table>
  );
};
