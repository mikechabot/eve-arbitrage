import { Flex, Heading } from '@chakra-ui/react';
import BaseTable, { AutoResizer, Column } from 'react-base-table';
import { PaginatedCharacterAssets } from 'services/types/character-api';

interface CharacterAssetsProps {
  assets: PaginatedCharacterAssets;
}

export const CharacterAssets: React.FC<CharacterAssetsProps> = ({ assets }) => {
  const { inventory } = assets;
  return (
    <Flex flex={1} width="100%" pl={6} pt={2}>
      <Flex flexDirection="column" width="100%">
        <Heading as="h3" color="gray.200" size="md" pb={2}>
          Character Assets
        </Heading>
        <AutoResizer>
          {({ width }) => (
            <BaseTable data={inventory} width={width} height={400}>
              <Column sortable key="typeName" dataKey="typeName" width={250} title="Type Name" />
              <Column sortable key="quantity" dataKey="quantity" width={100} title="Quantity" />

              <Column
                sortable
                key="location_flag"
                dataKey="location_flag"
                width={100}
                title="Location Flag"
              />
              <Column
                sortable
                key="location_id"
                dataKey="location_id"
                width={100}
                title="Location Id"
              />
              <Column
                sortable
                key="location_type"
                dataKey="location_type"
                width={100}
                title="Location Type"
              />
            </BaseTable>
          )}
        </AutoResizer>
      </Flex>
    </Flex>
  );
};
