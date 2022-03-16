import { Avatar } from '@chakra-ui/react';

import { EveCharacterPortraitApiV3 } from 'services/types/character-api';

interface CharacterAvatarProps {
  portrait: EveCharacterPortraitApiV3;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ portrait }) => (
  <Avatar src={portrait.px64x64} />
);
