import { AppEnv } from 'utils/appEnv';
import { AppRoutes } from 'app/pages/appRoutes';

/**
 * Scope EVE permissions
 */
const Scope = {
  ReadCharacterAssets: 'esi-assets.read_assets.v1',
  ReadCharacterWallet: 'esi-wallet.read_character_wallet.v1',
  ReadCorporationAssets: 'esi-assets.read_corporation_assets.v1',
} as const;

/**
 * Arrayify the scoped permissions
 */
const scopes = [Scope.ReadCharacterAssets, Scope.ReadCorporationAssets, Scope.ReadCharacterWallet];

/**
 * Tell EVE to send us to this URI
 */
const redirectUrl = `${AppEnv.BaseUrl}${AppRoutes.AuthSso}`;

/**
 * Ensure scopes are encoded for transfer over URLs
 */
const encodedScope = encodeURIComponent(scopes.join(' '));

export const buildEveAuthBaseUrl = (stateKey: string) =>
  `${AppEnv.EveAuthUrl}?response_type=code&redirect_uri=${redirectUrl}&client_id=${AppEnv.EveClientId}&scope=${encodedScope}&state=${stateKey}`;
