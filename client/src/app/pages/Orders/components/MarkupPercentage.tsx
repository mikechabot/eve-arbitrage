import { FC, Dispatch, SetStateAction, useCallback } from 'react';
import {
  Text,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';

interface MarkupPercentageProps {
  markupPercentage: number;
  setMarkupPercentage: Dispatch<SetStateAction<number>>;
}

export const MarkupPercentage: FC<MarkupPercentageProps> = ({
  markupPercentage,
  setMarkupPercentage,
}) => {
  /**
   * Control the number input field
   */
  const onChangeMarkupInput = useCallback(
    (_, valueAsNumber) => setMarkupPercentage(valueAsNumber),
    [setMarkupPercentage],
  );

  /**
   * Control the number slider
   */
  const onChangeMarkupSlider = useCallback(
    (val) => setMarkupPercentage(val),
    [setMarkupPercentage],
  );

  return (
    <HStack alignItems="center" spacing={2}>
      <Text flexShrink={0} fontWeight={600}>
        Price Percentage:{' '}
      </Text>
      <NumberInput
        defaultValue={markupPercentage}
        min={75}
        max={200}
        value={markupPercentage}
        size="sm"
        minWidth="75px"
        maxWidth="100px"
        onChange={onChangeMarkupInput}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Slider min={75} max={200} step={1} onChange={onChangeMarkupSlider}>
        <SliderTrack>
          <SliderFilledTrack bgColor="twitter.500" />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </HStack>
  );
};
