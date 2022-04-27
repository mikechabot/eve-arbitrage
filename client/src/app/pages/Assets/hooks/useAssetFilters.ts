import { useCallback, useMemo, useState } from 'react';

import { FilterFunc, FilterState, FilterOptions } from 'app/pages/Assets/components/Filters/types';

import { FetchPaginatedCharacterAssetsResponse } from 'services/types/response-type-api';

export interface AssetFilters {
  filterOptions: FilterOptions;
  selectedFilters: FilterState;
  onClickFilterOption: (key: keyof FilterState, value: string) => void;
  onFilterGroup: FilterFunc;
  onFilterStation: FilterFunc;
  onFilterCategory: FilterFunc;
  onClearAll: () => void;
}

const INITIAL_STATE: FilterState = {
  groups: new Set(),
  stations: new Set(),
  categories: new Set(),
};

export const useAssetFilters = (data?: FetchPaginatedCharacterAssetsResponse): AssetFilters => {
  const assets = useMemo(() => data?.assets || [], [data]);

  /**
   * Build the list of filter options
   */
  const filterOptions = useMemo<FilterOptions>(() => {
    const groups = new Set<string>();
    const stations = new Set<string>();
    const categories = new Set<string>();
    const quantityRange = {
      min: 1,
      max: Number.MIN_VALUE,
    };

    assets.forEach((asset) => {
      if (asset.groupName) {
        groups.add(asset.groupName);
      }
      if (asset.stationName) {
        stations.add(asset.stationName);
      }
      if (asset.categoryName) {
        categories.add(asset.categoryName);
      }
      if (asset.quantity > quantityRange.max) {
        quantityRange.max = asset.quantity;
      }
    });

    return {
      groups,
      stations,
      categories,
      quantityRange,
    };
  }, [assets]);

  /**
   * Track the selected filters
   */
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(INITIAL_STATE);

  /**
   * Whenever a filter option is selected, update the "selectedFilters" state
   */
  const onClickFilterOption = useCallback(
    (key: keyof FilterState, value: string) => {
      setSelectedFilters((prev) => {
        const newState = {
          ...prev,
          [key]: new Set(prev[key]),
        };
        if (newState[key].has(value)) {
          newState[key].delete(value);
        } else {
          newState[key].add(value);
        }
        return newState;
      });
    },
    [setSelectedFilters],
  );

  /**
   * Wrap category setter
   */
  const onFilterCategory = useCallback(
    (val: string) => {
      onClickFilterOption('categories', val);
    },
    [onClickFilterOption],
  );

  /**
   * Wrap station setter
   */
  const onFilterStation = useCallback(
    (val: string) => {
      onClickFilterOption('stations', val);
    },
    [onClickFilterOption],
  );

  /**
   * Wrap group setter
   */
  const onFilterGroup = useCallback(
    (val: string) => {
      onClickFilterOption('groups', val);
    },
    [onClickFilterOption],
  );

  const onClearAll = useCallback(() => {
    setSelectedFilters(INITIAL_STATE);
  }, [setSelectedFilters]);

  return {
    filterOptions,
    selectedFilters,
    onFilterGroup,
    onFilterStation,
    onFilterCategory,
    onClickFilterOption,
    onClearAll,
  };
};
