import React from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

interface AssetIconProps {
  typeId: number;
  categoryName: string | undefined;
  typeName: string | undefined;
}

export const AssetIcon: React.FC<AssetIconProps> = ({ typeId, categoryName, typeName }) => {
  if (!typeId || !categoryName || !typeName) {
    return null;
  }

  const src = `https://images.evetech.net/types/${typeId}/${
    categoryName === 'Blueprint' ? 'bp' : 'icon'
  }`;

  return (
    <Flex alignItems="center">
      <Image boxSize={10} borderRadius={6} src={src} fallbackSrc="https://via.placeholder.com/40" />
      <Box pl={2} fontWeight="bold" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
        {typeName}
      </Box>
    </Flex>
  );
};
