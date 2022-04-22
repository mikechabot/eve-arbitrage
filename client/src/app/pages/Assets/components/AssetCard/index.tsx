import { FC } from 'react';
import { Box, Divider, Text, VStack, Flex } from '@chakra-ui/react';

import { AssetIcon } from 'app/pages/Assets/components/AssetCard/AssetIcon';

import { EveInventoryAssetV5 } from 'services/types/character-api';

interface AssetCardProps {
  asset: EveInventoryAssetV5;
}

export const AssetCard: FC<AssetCardProps> = ({ asset }) => (
  <Box
    p={2}
    borderColor="gray.200"
    borderWidth="1px"
    borderStyle="solid"
    paddingBottom={1}
    borderRadius={6}
  >
    <VStack minWidth={0} align="left">
      <AssetIcon
        typeId={asset.type_id}
        categoryName={asset.categoryName}
        typeName={asset.typeName}
      />

      <Box>
        <Divider />
        <Flex width="100%" alignItems="center">
          <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" width="60px">
            Category
          </Text>
          <Text flex={1} fontSize="sm">
            {asset.categoryName}
          </Text>
        </Flex>
        <Divider />

        <Flex width="100%" alignItems="center">
          <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" width="60px">
            Group
          </Text>
          <Text flex={1} fontSize="sm">
            {asset.groupName}
          </Text>
        </Flex>
        <Divider />

        <Flex width="100%" alignItems="center">
          <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" width="60px">
            Quantity
          </Text>
          <Text flex={1} fontSize="sm">
            {asset.quantity}
          </Text>
        </Flex>
        <Divider />

        <Flex width="100%" alignItems="center">
          <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" width="60px">
            Location
          </Text>
          <Text
            flex={1}
            fontSize="sm"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {asset.stationName}
          </Text>
        </Flex>
      </Box>
    </VStack>
  </Box>
);
