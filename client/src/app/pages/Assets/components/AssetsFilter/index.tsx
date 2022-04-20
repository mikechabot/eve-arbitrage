import { useCallback } from 'react';
import { Box, Accordion } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { FilterOptions } from 'app/pages/Assets/hooks/useAssetFilters';
import { AccordionFilter } from 'app/pages/Assets/components/AssetsFilter/AccordionFilter';

import { FilterState } from './types';

interface AssetsFilterProps {
  isOpen: boolean;
  filters: FilterOptions;
  onClickFilter: (key: keyof FilterState, value: string) => void;
}

export const AssetsFilter: React.FC<AssetsFilterProps> = ({ isOpen, filters, onClickFilter }) => {
  const onClickCategory = useCallback(
    (val: string) => {
      onClickFilter('categories', val);
    },
    [onClickFilter],
  );

  const onClickGroup = useCallback(
    (val: string) => {
      onClickFilter('groups', val);
    },
    [onClickFilter],
  );

  const onClickStation = useCallback(
    (val: string) => {
      onClickFilter('stations', val);
    },
    [onClickFilter],
  );

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.aside
          key="asset-filter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, width: 250 }}
          transition={{duration: 0.2}}
          exit={{ opacity: 0, width: 0 }}
        >
          <Accordion allowToggle allowMultiple defaultIndex={[0, 1, 2]}>
            <AccordionFilter
              label="Categories"
              options={filters.categories}
              onChange={onClickCategory}
            />
            <AccordionFilter label="Groups" options={filters.groups} onChange={onClickGroup} />
            <AccordionFilter
              label="Stations"
              options={filters.stations}
              onChange={onClickStation}
            />
          </Accordion>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
