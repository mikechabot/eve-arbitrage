import { useCallback, useEffect, useMemo, useState } from 'react';

import { FilterState } from 'app/pages/Assets/components/AssetsFilter/types';

import { EveInventoryAssetsApiV5 } from 'services/types/character-api';
import { FetchPaginatedCharacterAssetsResponse } from 'services/types/response-type-api';

export interface FilterOptions {
  groups: Set<string>;
  stations: Set<string>;
  categories: Set<string>;
  quantityRange: {
    min: number;
    max: number;
  };
}

export interface AssetFilters {
  filterOptions: FilterOptions;
  filteredData: EveInventoryAssetsApiV5;
  onClickFilterOption: (key: keyof FilterState, value: string) => void;
}

export const useAssetFilters = (data?: FetchPaginatedCharacterAssetsResponse): AssetFilters => {
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

    data?.assets.forEach((asset) => {
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
  }, [data]);

  /**
   * Track the selected filters
   */
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    groups: new Set(),
    stations: new Set(),
    categories: new Set(),
  });

  const [filteredData, setFilteredData] = useState<EveInventoryAssetsApiV5>([]);

  useEffect(() => {
    if (data?.assets) {
      setFilteredData((prev) => {
        return prev || data.assets;
      });
    }
  }, [data]);

  /**
   * Whenever a filter option is selected, update the "selectedFilters" state
   */
  const onClickFilterOption = useCallback(
    (key: keyof FilterState, value: string) => {
      setSelectedFilters((prev) => {
        const newState = { ...prev };
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

  useEffect(() => {
    const { groups, categories, stations } = selectedFilters;

    if (data?.assets) {
      if (groups.size === 0 && categories.size === 0 && stations.size === 0) {
        setFilteredData(data?.assets);
      } else {
        setFilteredData(
          data.assets.filter(
            (datum) =>
              groups.has(datum.groupName || '') ||
              categories.has(datum.categoryName || '') ||
              stations.has(datum.stationName || ''),
          ),
        );
      }
    }
  }, [data, selectedFilters, setFilteredData]);

  return {
    filteredData,
    filterOptions,
    onClickFilterOption,
  };
};
