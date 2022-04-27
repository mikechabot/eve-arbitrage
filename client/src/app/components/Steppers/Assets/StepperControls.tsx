import { FC } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';

interface StepperControlsProps {
  activeStep: number;
  selectedAssetCount: number;
  prevStep: () => void;
  nextStep: () => void;
}

export const StepperControls: FC<StepperControlsProps> = ({
  activeStep,
  prevStep,
  nextStep,
  selectedAssetCount,
}) => (
  <Flex width="100%" justify="center">
    <Button isDisabled={activeStep === 0} mr={4} onClick={prevStep} variant="ghost" size="sm">
      <Text>Back</Text>
    </Button>
    {activeStep === 0 && (
      <Button onClick={nextStep} disabled={selectedAssetCount === 0} size="sm">
        <Text>Create Order ({selectedAssetCount})</Text>
      </Button>
    )}
    {activeStep === 1 && (
      <Button onClick={nextStep} disabled={selectedAssetCount === 0} size="sm">
        <Text>Share</Text>
      </Button>
    )}
  </Flex>
);
