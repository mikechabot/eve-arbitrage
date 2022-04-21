import { Flex } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

import { Message } from 'app/components/Message';

type FontSize = 'sm' | 'md' | 'lg';
type BannerType = 'info' | 'error';

interface BannerProps {
  type: BannerType;
  message: string;
  icon?: IconType;
  color?: string;
  fontSize?: FontSize;
  backgroundColor?: string;
}

function deriveIcon(type: BannerType) {
  switch (type) {
    case 'info':
      return FaInfoCircle;
    case 'error':
      return FaExclamationTriangle;
    default:
      return undefined;
  }
}

function deriveColor(type: BannerType) {
  switch (type) {
    case 'info':
      return 'white';
    case 'error':
      return 'white';
    default:
      return 'base';
  }
}

function deriveBackgroundColor(type: BannerType) {
  switch (type) {
    case 'info':
      return 'blue.500';
    case 'error':
      return 'red.100';
    default:
      return 'primary';
  }
}

export const Banner: React.FC<BannerProps> = ({
  type,
  message,
  color,
  backgroundColor,
  fontSize = 'md',
  icon,
}) => {
  let overrideIcon = icon;
  if (!overrideIcon) {
    overrideIcon = deriveIcon(type);
  }

  let overrideColor = color;
  if (!overrideColor) {
    overrideColor = deriveColor(type);
  }

  let overrideBackgroundColor = backgroundColor;
  if (!overrideBackgroundColor) {
    overrideBackgroundColor = deriveBackgroundColor(type);
  }

  return (
    <Flex width="100%" justifyContent="center" backgroundColor={overrideBackgroundColor} py={2}>
      <Message message={message} color={overrideColor} fontSize={fontSize} icon={overrideIcon} />
    </Flex>
  );
};
