import { Box } from '@chakra-ui/react';

import { AssetIcon } from 'app/pages/Assets/components/AssetCard/AssetIcon';

import { EveInventoryAssetV5 } from 'services/types/character-api';

interface AssetCardProps {
  asset: EveInventoryAssetV5;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => (
  <Box
    key={asset.item_id}
    borderColor="gray.200"
    borderWidth="1px"
    borderStyle="solid"
    height={150}
    p={1}
    borderRadius={6}
  >
    <AssetIcon typeId={asset.type_id} categoryName={asset.categoryName} typeName={asset.typeName} />
    {asset.categoryName} - {asset.groupName}
  </Box>
);
