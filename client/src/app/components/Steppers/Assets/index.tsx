import { FC } from 'react';
import {VStack} from "@chakra-ui/react";
import { Step, Steps } from 'chakra-ui-steps';

import { StepperControls } from './StepperControls';

import { steps } from './constants';


interface StepperProps {
  activeStep: number;
  selectedAssetCount: number;
  prevStep: () => void;
  nextStep: () => void;
}

export const Stepper: FC<StepperProps> = ({ activeStep, prevStep, nextStep, selectedAssetCount = 0 }) => {
  return (
    <VStack spacing={1} width="100%">
      <Steps activeStep={activeStep} size="lg" colorScheme="twitter">
        {steps.map(({ label, icon }) => (
          <Step label={label} key={label} icon={icon} />
        ))}
      </Steps>
      <StepperControls
        activeStep={activeStep}
        prevStep={prevStep}
        nextStep={nextStep}
        selectedAssetCount={selectedAssetCount}
      />
    </VStack>
  );
};
