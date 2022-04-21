import { FC, Dispatch, SetStateAction } from 'react';
import { Box, Accordion } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { AccordionFilter } from 'app/pages/Assets/components/FilterSlider/AccordionFilter';
import { FilterSlideTitle } from 'app/pages/Assets/components/FilterSlider/FilterSlideTitle';

import {
  FilterOptions,
  FilterFunc,
  FilterState,
} from 'app/pages/Assets/components/FilterSlider/types';

interface FilterSliderProps {
  isOpen: boolean;
  filters: FilterOptions;
  selectedFilters: FilterState;
  toggleOpen: Dispatch<SetStateAction<boolean>>;
  onFilterGroup: FilterFunc;
  onFilterStation: FilterFunc;
  onFilterCategory: FilterFunc;
}

const list = {
  hidden: { width: 50 },
};

const item = {
  visible: { width: 250, display: 'block' },
  hidden: { display: 'none', height: 0 },
};

export const FilterSlider: FC<FilterSliderProps> = ({
  isOpen,
  filters,
  selectedFilters,
  toggleOpen,
  onFilterGroup,
  onFilterStation,
  onFilterCategory,
}) => {
  // When collapsed, make sure we offset the height again
  const heightCalc = isOpen ? 'auto' : 'calc(100vh - 98px)';

  return (
    <motion.aside
      initial={false}
      key="asset-filter"
      animate={isOpen ? 'visible' : 'hidden'}
      variants={list}
      style={{
        position: 'sticky',
        height: 'calc(100vh - 98px)',
        // This offset is required since we're setting the header as sticky
        top: 98,
      }}
    >
      <Box
        borderRightColor="gray.200"
        borderRightWidth="1px"
        borderRightStyle="solid"
        height={heightCalc}
      >
        <FilterSlideTitle isOpen={isOpen} toggleOpen={toggleOpen} />
        <motion.div variants={item} style={{ overflowY: 'auto', height: 'calc(100vh - 145px)' }}>
          <Accordion allowToggle allowMultiple defaultIndex={[0, 1, 2]}>
            <AccordionFilter
              label="Categories"
              options={filters.categories}
              selectedOptions={selectedFilters.categories}
              onChange={onFilterCategory}
            />
            <AccordionFilter
              label="Groups"
              options={filters.groups}
              selectedOptions={selectedFilters.groups}
              onChange={onFilterGroup}
            />
            <AccordionFilter
              label="Stations"
              options={filters.stations}
              selectedOptions={selectedFilters.stations}
              onChange={onFilterStation}
            />
          </Accordion>
        </motion.div>
      </Box>
    </motion.aside>
  );
};
