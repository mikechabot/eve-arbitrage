import { FC, Dispatch, SetStateAction } from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { FilterAccordions } from 'app/pages/Assets/components/Filters/FilterAccordions';
import { FilterSliderTitle } from 'app/pages/Assets/components/Filters/FilterSlider/FilterSliderTitle';

import { FilterOptions, FilterFunc, FilterState } from 'app/pages/Assets/components/Filters/types';

interface FilterSliderProps {
  isOpen: boolean;
  isLargerThan768: boolean;
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
  isLargerThan768,
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
        display: isLargerThan768 ? 'block' : 'none',
      }}
    >
      <Box
        borderRightColor="gray.200"
        borderRightWidth="1px"
        borderRightStyle="solid"
        height={heightCalc}
      >
        <FilterSliderTitle isOpen={isOpen} toggleOpen={toggleOpen} />
        <motion.div variants={item} style={{ overflowY: 'auto', height: 'calc(100vh - 145px)' }}>
          <FilterAccordions
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterGroup={onFilterGroup}
            onFilterStation={onFilterStation}
            onFilterCategory={onFilterCategory}
          />
        </motion.div>
      </Box>
    </motion.aside>
  );
};
