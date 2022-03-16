import { FetchCharacterDetailsResponse } from 'services/types/response-type-api';

export const mockCharacterResponse: FetchCharacterDetailsResponse = {
  character: {
    details: {
      birthday: '2014-05-25T02:17:10Z',
      bloodline_id: 1,
      corporation_id: 1000006,
      description: 'Express yourself without yourself',
      gender: 'female',
      name: 'Ginna Fatokad',
      race_id: 1,
      security_status: 0.07768005500000001,
    },
    portrait: {
      px128x128:
        'https://images.evetech.net/characters/94666309/portrait?tenant=tranquility&size=128',
      px256x256:
        'https://images.evetech.net/characters/94666309/portrait?tenant=tranquility&size=256',
      px512x512:
        'https://images.evetech.net/characters/94666309/portrait?tenant=tranquility&size=512',
      px64x64: 'https://images.evetech.net/characters/94666309/portrait?tenant=tranquility&size=64',
    },
    wallet: 25052895.79,
  },
  corporation: {
    ceo_id: 3004089,
    creator_id: 1,
    description:
      'Deep Core Mining is a young company that was founded on the basis of a revolutionary new mining drill technology. This new technology, details of which have never been revealed, gives much higher yield than older techniques and has promoted DCM to the top echelon of mining companies very quickly.',
    home_station_id: 60000610,
    member_count: 200776,
    name: 'Deep Core Mining Inc.',
    shares: 1319961277,
    tax_rate: 0.10999999940395355,
    ticker: 'DCMI',
    url: '',
  },
  verified: true,
};
