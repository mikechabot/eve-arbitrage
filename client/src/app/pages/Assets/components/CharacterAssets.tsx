import { useCallback, useState } from 'react';
import sort from 'lodash.sortby';
import { Flex, Heading } from '@chakra-ui/react';
import BaseTable, { AutoResizer, Column, SortOrder } from 'react-base-table';

import { EveInventoryAssetsApiV5, PaginatedCharacterAssets } from 'services/types/character-api';

interface CharacterAssetsProps {
  assets: PaginatedCharacterAssets;
}

interface SortedData {
  sortBy: {
    key: string;
    order: SortOrder;
  };
  data: EveInventoryAssetsApiV5;
}

export const CharacterAssets: React.FC<CharacterAssetsProps> = ({ assets }) => {
  const [sortedData, setSortedData] = useState<SortedData>({
    sortBy: {
      key: 'typeName',
      order: 'asc',
    },
    data: sort(assets.data, ['typeName']),
  });

  const onColumnSort = useCallback(
    ({ key, order }) => {
      setSortedData(({ data }) => {
        const newData = sort(data, [key]);
        return {
          sortBy: {
            key,
            order,
          },
          data: order === 'desc' ? newData.reverse() : newData,
        };
      });
    },
    [setSortedData],
  );

  const { sortBy, data } = sortedData;

  return (
    <Flex flex={1} width="100%" pl={6} pt={2}>
      <Flex flexDirection="column" width="100%">
        <Heading as="h3" color="gray.200" size="md" pb={2}>
          Character Assets
        </Heading>
        <AutoResizer>
          {({ width }) => (
            <BaseTable
              fixed
              data={data}
              sortBy={sortBy}
              width={width}
              height={400}
              rowKey="item_id"
              rowHeight={36}
              onColumnSort={onColumnSort}
            >
              <Column sortable key="typeName" dataKey="typeName" width={250} title="Type Name" />
              <Column sortable key="quantity" dataKey="quantity" width={100} title="Quantity" />
              <Column
                sortable
                key="location_flag"
                dataKey="location_flag"
                width={125}
                title="Location Flag"
              />
              <Column
                sortable
                key="stationName"
                dataKey="stationName"
                width={300}
                title="Station Name"
              />
              <Column
                sortable
                key="location_id"
                dataKey="location_id"
                width={200}
                title="Location Id"
              />
              <Column
                sortable
                key="location_type"
                dataKey="location_type"
                width={150}
                title="Location Type"
              />
            </BaseTable>
          )}
        </AutoResizer>
      </Flex>
    </Flex>
  );
};
