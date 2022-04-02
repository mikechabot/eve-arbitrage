import { ReactTable } from 'app/components/ReactTable';
import { useCharacterAssetsSchema } from 'app/pages/Assets/utils/character-assets-schema';
import { EveInventoryAssetsApiV5 } from 'services/types/character-api';

interface AssetsTableProps {
  assets: EveInventoryAssetsApiV5;
}

export const AssetsTable: React.FC<AssetsTableProps> = ({ assets }) => {
  const columns = useCharacterAssetsSchema();
  return <ReactTable columns={columns} data={assets} />;
};
