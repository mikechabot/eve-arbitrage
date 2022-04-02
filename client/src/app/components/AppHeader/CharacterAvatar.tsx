import { Avatar, useBreakpointValue } from '@chakra-ui/react';

import { EveCharacterPortraitApiV3 } from 'services/types/character-api';

interface CharacterAvatarProps {
  portrait: EveCharacterPortraitApiV3;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ portrait }) => {
  const avatarSize = useBreakpointValue({ base: 'sm', sm: 'md', md: 'md' });
  return <Avatar size={avatarSize} src={portrait.px64x64} />;
};
