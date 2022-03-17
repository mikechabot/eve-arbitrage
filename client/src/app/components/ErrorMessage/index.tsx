import { Flex, Icon, Text } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message = 'Error' }) => (
  <Flex alignItems="center" color="secondary">
    <Icon as={FaExclamationTriangle} />
    <Text pl={2} pt={0.5} fontWeight="bold">
      {message}
    </Text>
  </Flex>
);
