import { memo } from 'react';
import { Th, Thead, Tr } from '@chakra-ui/react';

const RawOrderAssetTableHeader = () => (
  <Thead>
    <Tr>
      <Th>Asset</Th>
      <Th>Quantity</Th>
      <Th>Max Buy</Th>
      <Th>Sell Price</Th>
      <Th> </Th>
    </Tr>
  </Thead>
);

export const OrderAssetTableHeader = memo(RawOrderAssetTableHeader);
