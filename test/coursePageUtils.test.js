import { expect, describe, it } from 'vitest';
import { getEpIdOrSeasonId } from '../src/utils/coursePage';

describe('coursePageUtils', () => {
  it('getEpIdOrSeasonId', () => {
    const urls = [
      'https://www.bilibili.com/cheese/play/ep712009',
      'https://www.bilibili.com/cheese/play/ss20821?csource=private_space_class_null'
    ];
    const anss = [
      { epId: 712009, seasonId: null },
      { epId: null, seasonId: 20821 },
    ];
    urls.forEach((url, i) => {
      const epOrSeason = getEpIdOrSeasonId(url);
      expect(epOrSeason).toStrictEqual(anss[i]);
    });
  });
});
