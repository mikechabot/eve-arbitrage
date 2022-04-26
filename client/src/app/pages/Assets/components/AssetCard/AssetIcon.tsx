import React from 'react';
import { Box, Button, Flex, Image } from '@chakra-ui/react';

interface AssetIconProps {
  typeId: number;
  categoryName: string | undefined;
  typeName: string | undefined;
  onClickAsset: (() => void) | undefined;
  isSelected: boolean;
}

const isBlueprint = (categoryName: string) => categoryName === 'Blueprint';
const deriveCategoryPath = (categoryName: string) => (isBlueprint(categoryName) ? 'bp' : 'icon');

export const AssetIcon: React.FC<AssetIconProps> = ({
  typeId,
  categoryName,
  typeName,
  onClickAsset,
  isSelected,
}) => {
  if (!typeId || !categoryName || !typeName) {
    return null;
  }

  const src = `https://images.evetech.net/types/${typeId}/${deriveCategoryPath(categoryName)}`;

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex alignItems="center">
        <Image
          boxSize={10}
          borderRadius={6}
          src={src}
          fallbackSrc="https://via.placeholder.com/40"
        />
        <Box pl={2} fontWeight="bold" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
          {typeName}
        </Box>
      </Flex>
      {onClickAsset && (
        <Button
          onClick={onClickAsset}
          size="xs"
          backgroundColor={isSelected ? 'red.100' : 'green.100'}
          color="white"
        >
          {isSelected ? 'Remove' : 'Add'}
        </Button>
      )}
    </Flex>
  );
};
