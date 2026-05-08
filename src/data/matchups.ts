import type { Outcome, SerumType, SkinType } from '../core/game/types';

export type MatchupTable = Record<SkinType, Record<SerumType, Outcome>>;

export const matchupTable: MatchupTable = {
  dry: {
    retinol: 'bad',
    vitamin_c: 'bad',
    niacinamide: 'success',
    ceramide: 'success',
    aha_bha: 'disaster',
  },
  oily: {
    retinol: 'success',
    vitamin_c: 'success',
    niacinamide: 'success',
    ceramide: 'bad',
    aha_bha: 'bad',
  },
  sensitive: {
    retinol: 'disaster',
    vitamin_c: 'bad',
    niacinamide: 'success',
    ceramide: 'success',
    aha_bha: 'disaster',
  },
  pores: {
    retinol: 'success',
    vitamin_c: 'bad',
    niacinamide: 'success',
    ceramide: 'bad',
    aha_bha: 'success',
  },
};
