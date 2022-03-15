import { Box, Spinner as UiSpinner, Flex, Stack, Text } from '@chakra-ui/react';

interface SpinnerProps {
  label?: string | React.ReactNode;
}

export const Spinner: React.FC<SpinnerProps> = ({ label }) => (
  <Flex flexDirection="column" justifyContent="center">
    <Stack spacing={2}>
      <Flex justifyContent="center">
        <UiSpinner color="secondary" size="lg" speed="0.75s" />
      </Flex>
      {label && <Text fontSize="md">{label}</Text>}
    </Stack>
  </Flex>
);
