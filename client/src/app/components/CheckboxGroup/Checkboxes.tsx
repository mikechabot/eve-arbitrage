import { FC, memo, useCallback } from 'react';
import { Checkbox } from '@chakra-ui/react';

import { CheckboxGroupProps } from './types';

interface CheckboxesProps extends CheckboxGroupProps {
  options: string[];
}

const MemoizedCheckbox = memo(Checkbox);

export const Checkboxes: FC<CheckboxesProps> = ({ options, onClickOption, selectedOptions }) => {
  const onClick = useCallback(
    (e) => {
      onClickOption(e.target.id);
    },
    [onClickOption],
  );

  return (
    <>
      {options.map((option) => {
        return (
          <MemoizedCheckbox
            id={option}
            key={option}
            onChange={onClick}
            isChecked={selectedOptions.has(option)}
          >
            {option}
          </MemoizedCheckbox>
        );
      })}
    </>
  );
};

export const MemoizedCheckboxes = memo(Checkboxes);
