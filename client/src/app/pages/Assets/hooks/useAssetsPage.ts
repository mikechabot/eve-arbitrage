import { useUserAssetsQuery } from 'services/hooks/useQueries';

export const useAssetsPage = () => {
  const { data, isFetching, isError, error, refetch } = useUserAssetsQuery({
    enabled: false,
  });
  return { data, isFetching, isError, error, fetchUserAssets: refetch };
};
