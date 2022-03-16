import { Text } from '@chakra-ui/react';

export const ErrorMessage = ({ children }) => (
  <Text fontSize="xl" color="secondary">
    {children}
  </Text>
);
