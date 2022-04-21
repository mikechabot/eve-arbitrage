import { Flex, Icon, Text } from '@chakra-ui/react';

import { IconType } from 'react-icons';

type FontSize = 'sm' | 'md' | 'lg';

export interface MessageProps {
  message: string;
  color?: string;
  icon?: IconType;
  fontSize?: FontSize;
}

function deriveIconSize(fontSize: FontSize): number {
  if (fontSize === 'sm') {
    return 4;
  }
  if (fontSize === 'lg') {
    return 8;
  }
  return 6;
}

export const Message: React.FC<MessageProps> = ({
  message,
  fontSize = 'md',
  color = 'red.100',
  icon,
}) => {
  const iconSize = deriveIconSize(fontSize);
  return (
    <Flex alignItems="center" color={color}>
      <Icon as={icon} h={iconSize} w={iconSize} />
      <Text pl={2} pt={0.5} fontWeight="bold" fontSize={fontSize}>
        {message}
      </Text>
    </Flex>
  );
};
