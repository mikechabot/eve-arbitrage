import { Dispatch, SetStateAction } from 'react';
import { Box, Divider, Flex, Icon, Text } from '@chakra-ui/react';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

interface FilterSlideTitleProps {
  isOpen: boolean;
  toggleOpen: Dispatch<SetStateAction<boolean>>;
}

export const FilterSlideTitle: React.FC<FilterSlideTitleProps> = ({ isOpen, toggleOpen }) => {
  if (isOpen) {
    return (
      <Box onClick={() => toggleOpen(!isOpen)} cursor="pointer" role="button">
        <Flex alignItems="center" px={4} py={2}>
          <Text fontSize="xl" fontWeight={600} flex={1}>
            Filters
          </Text>
          <Icon as={MdArrowBack} w={6} h={6} />
        </Flex>
        <Divider />
      </Box>
    );
  }
  return (
    <Box onClick={() => toggleOpen(!isOpen)}>
      <Flex height={46} justifyContent="center" alignItems="center" cursor="pointer">
        <Icon as={MdArrowForward} w={6} h={6} />
      </Flex>
    </Box>
  );
};
