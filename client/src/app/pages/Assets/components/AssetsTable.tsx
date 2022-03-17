import { ReactTable } from 'app/components/ReactTable';
import { useCharacterAssetsSchema } from 'app/pages/Assets/utils/character-assets-schema';

export const AssetsTable = ({ assets }) => {
  const columns = useCharacterAssetsSchema();
  return <ReactTable columns={columns} data={assets} />;
};
