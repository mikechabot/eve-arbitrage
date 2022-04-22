import { FC, memo, ReactNode } from 'react';
import { Button, Text } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';

import { FilterFunc } from 'app/pages/Assets/components/FilterSlider/types';

interface FilterPillSetProps {
  set: Set<string>;
  onClick: FilterFunc;
}

const FilterPillSet: FC<FilterPillSetProps> = ({ set, onClick }) => {
  const buttons: ReactNode[] = [];
  set.forEach((item) =>
    buttons.push(
      <Button
        key={item}
        rightIcon={<MdClose />}
        onClick={() => onClick(item)}
        maxWidth={250}
        mt={2}
        mr={2}
      >
        <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          {item}
        </Text>
      </Button>,
    ),
  );
  return <>{buttons}</>;
};

export const MemoizedFilterPillSet = memo(FilterPillSet);
