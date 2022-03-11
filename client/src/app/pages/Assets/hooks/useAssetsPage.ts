import { useCharacterQuery } from 'services/hooks/useQueries';

export const useAssetsPage = () => {
  const { data, isFetching, isError, error, refetch } = useCharacterQuery({
    enabled: false,
  });
  return { data, isFetching, isError, error, fetchCharacter: refetch };
};
