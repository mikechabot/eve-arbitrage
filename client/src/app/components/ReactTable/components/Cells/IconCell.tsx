import React from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

interface IconCellProps {
  value: {
    typeId: number;
    typeName: string;
    categoryName: string;
  };
}

export const IconCell: React.FC<IconCellProps> = ({ value }) => {
  if (!value.typeId || !value.categoryName || !value.typeName) {
    return null;
  }

  const src = `https://images.evetech.net/types/${value.typeId}/${
    value.categoryName === 'Blueprint' ? 'bp' : 'icon'
  }`;

  return (
    <Flex alignItems="center">
      <Image boxSize={10} borderRadius={6} src={src} fallbackSrc="https://via.placeholder.com/40" />
      <Box pl={4} fontWeight="bold" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
        {value.typeName}
      </Box>
    </Flex>
  );
};
