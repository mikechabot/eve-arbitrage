import { Redirect } from 'react-router';

import { AppRoutes } from 'app/pages/appRoutes';

import { useAuthContext } from 'hooks/useAuthContext';
import { useAssetsPage } from 'app/pages/Assets/hooks/useAssetsPage';
import { useEffect } from 'react';

export const Assets = () => {
  const { isVerified } = useAuthContext();
  const { data, isFetching, isError, fetchCharacter } = useAssetsPage();

  useEffect(() => {
    if (isVerified) {
      fetchCharacter();
    }
  }, [isVerified, fetchCharacter]);

  if (!isVerified) {
    return <Redirect to={AppRoutes.Home} />;
  }

  if (isError) {
    return <span>Error!</span>;
  }

  if (isFetching) {
    return <span>Loading assets...</span>;
  }

  if (!data) {
    return null;
  }

  const { character, characterDetails, characterPortrait } = data;

  return (
    <div>
      <img alt="character portrait" src={characterPortrait.px256x256} height={256} width={256} />
      <table>
        {Object.keys(characterDetails).map((key) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{characterDetails[key]}</td>
          </tr>
        ))}
      </table>
      <button type="button" onClick={() => ({})}>
        Fetch User assets
      </button>
      <button type="button" onClick={() => ({})}>
        Fetch Corporation assets
      </button>
    </div>
  );
};
