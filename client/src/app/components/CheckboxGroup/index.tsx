import { useMemo } from 'react';
import { CheckboxGroup as ChakraCheckboxGroup, VStack } from '@chakra-ui/react';

import { CheckboxGroupProps } from './types';
import { MemoizedCheckboxes } from './Checkboxes';

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedOptions,
  onClickOption,
}) => {
  const sorted = useMemo<string[]>(() => Array.from(options).sort(), [options]);

  return (
    <ChakraCheckboxGroup>
      <VStack direction="column" alignItems="flex-start">
        <MemoizedCheckboxes
          options={sorted}
          selectedOptions={selectedOptions}
          onClickOption={onClickOption}
        />
      </VStack>
    </ChakraCheckboxGroup>
  );
};
