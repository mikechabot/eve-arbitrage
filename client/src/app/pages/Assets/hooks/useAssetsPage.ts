import { useCharacterAssetsQuery } from 'services/hooks/useQueries';

export const useAssetsPage = () => {
  const { data, isFetching, isError, error, refetch } = useCharacterAssetsQuery({
    enabled: false,
  });
  return { data, isFetching, isError, error, refetch };
};
