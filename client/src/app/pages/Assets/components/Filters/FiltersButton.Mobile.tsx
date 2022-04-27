import { FC } from 'react';
import { Box, Button } from '@chakra-ui/react';

interface FiltersButtonMobileProps {
  isLargerThan768: boolean;
  toggleOpen: () => void;
}

export const FiltersButtonMobile: FC<FiltersButtonMobileProps> = ({
  isLargerThan768,
  toggleOpen,
}) => {
  if (isLargerThan768) {
    return null;
  }

  return (
    <Box
      py={2}
      display="flex"
      width="100%"
      justifyContent="center"
      position="fixed"
      zIndex={999}
      bottom={0}
    >
      <Button onClick={toggleOpen} backgroundColor="primary" color="white">
        Filters
      </Button>
    </Box>
  );
};
