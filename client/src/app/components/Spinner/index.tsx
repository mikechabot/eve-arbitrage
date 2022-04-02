import { Spinner as UiSpinner, Flex, Stack, Text } from '@chakra-ui/react';

interface SpinnerProps {
  label?: string | React.ReactNode;
}

export const Spinner: React.FC<SpinnerProps> = ({ label }) => (
  <Flex flexDirection="column" justifyContent="center">
    <Stack spacing={2} alignItems="center">
      <Flex justifyContent="center">
        <UiSpinner color="secondary" size="lg" speed="0.5s" />
      </Flex>
      {label && (
        <Text fontSize="md" fontWeight="bold" color="secondary">
          {label}
        </Text>
      )}
    </Stack>
  </Flex>
);
