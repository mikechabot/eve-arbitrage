import { useEffect, useMemo, useState } from 'react';

import { FilterState } from 'app/pages/Assets/components/FilterSlider/types';
import { EveInventoryAssetsApiV5 } from 'services/types/character-api';
import { FetchPaginatedCharacterAssetsResponse } from 'services/types/response-type-api';

interface FilteredAssets {
  filteredData: EveInventoryAssetsApiV5;
}

export const useFilteredAssets = (
  data: FetchPaginatedCharacterAssetsResponse | undefined,
  selectedFilters: FilterState,
  searchValue: string | undefined,
): FilteredAssets => {
  const assets = useMemo(() => data?.assets || [], [data]);
  const [filteredData, setFilteredData] = useState<EveInventoryAssetsApiV5>(assets);
  const regex = useMemo(() => new RegExp(searchValue || '', 'i'), [searchValue]);

  useEffect(() => {
    if (assets.length > 0) {
      setFilteredData(assets);
    }
  }, [assets]);

  useEffect(() => {
    const { groups, categories, stations } = selectedFilters;

    const hasFilters = groups.size > 0 || categories.size > 0 || stations.size > 0;

    /**
     * Reset filters
     */
    if (!hasFilters && !searchValue) {
      setFilteredData(assets);
      return;
    }

    /**
     * Only filter on the search value
     */
    if (!hasFilters && searchValue) {
      setFilteredData(assets.filter((asset) => asset.typeName?.match(regex)));
      return;
    }

    /**
     * Only filter on filter selections
     */
    if (hasFilters && !searchValue) {
      setFilteredData(
        assets.filter(
          (datum) =>
            categories.has(datum.categoryName || '') ||
            groups.has(datum.groupName || '') ||
            stations.has(datum.stationName || ''),
        ),
      );
      return;
    }

    /**
     * At this point, we have both filter selections and a search value
     */
    setFilteredData(
      assets.filter(
        (asset) =>
          Boolean(asset.typeName?.match(regex)) &&
          (categories.has(asset.categoryName || '') ||
            groups.has(asset.groupName || '') ||
            stations.has(asset.stationName || '')),
      ),
    );
  }, [assets, selectedFilters, searchValue, regex, setFilteredData]);

  return { filteredData };
};
