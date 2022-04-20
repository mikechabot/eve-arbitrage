import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Box } from '@chakra-ui/react';

import { StepperContent } from './StepperContent';
import { StepperControls } from './StepperControls';

import { steps } from './constants';

export const Stepper = () => {
  const { activeStep, nextStep, prevStep, reset, setStep } = useSteps({
    initialStep: 0,
  });

  return (
    <>
      <Steps
        activeStep={activeStep}
        onClickStep={(step) => setStep(step)}
        size="lg"
        colorScheme="twitter"
      >
        {steps.map(({ label, icon }, index) => (
          <Step label={label} key={label} icon={icon}>
            <Box px={4} py={4} textAlign="left">
              <StepperContent index={index} />
            </Box>
          </Step>
        ))}
      </Steps>
      <StepperControls
        activeStep={activeStep}
        prevStep={prevStep}
        nextStep={nextStep}
        reset={reset}
      />
    </>
  );
};
