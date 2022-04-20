import { useMemo } from 'react';
import { Checkbox, CheckboxGroup as ChakraCheckboxGroup, VStack } from '@chakra-ui/react';

interface CheckboxGroupProps {
  options: Set<string>;
  onClickOption: (val: string) => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ options, onClickOption }) => {
  const sorted = useMemo<string[]>(() => Array.from(options).sort(), [options]);
  return (
    <ChakraCheckboxGroup>
      <VStack direction="column" alignItems="flex-start">
        {sorted.map((option) => (
          <Checkbox key={option} onChange={() => onClickOption(option)}>
            {option}
          </Checkbox>
        ))}
      </VStack>
    </ChakraCheckboxGroup>
  );
};
