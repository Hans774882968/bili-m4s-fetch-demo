import { describe, it, expect } from 'vitest';
import { getPlayurlApiUrl, getWebSeasonApiUrl } from '../src/common/getCoursePagePlayInfo';

describe('getCoursePagePlayInfo', () => {
  describe('getWebSeasonApiUrl', () => {
    it('should generate URL with epId when epId is provided', () => {
      const params = { epId: '12345', seasonId: null };
      const result = getWebSeasonApiUrl(params);
      expect(result).toBe(
        'https://api.bilibili.com/pugv/view/web/season?ep_id=12345&isGaiaAvoided=false'
      );
    });

    it('should generate URL with seasonId when seasonId is provided', () => {
      const params = { epId: null, seasonId: '67890' };
      const result = getWebSeasonApiUrl(params);
      expect(result).toBe(
        'https://api.bilibili.com/pugv/view/web/season?season_id=67890&isGaiaAvoided=false'
      );
    });

    it('should prefer epId over seasonId when both are provided', () => {
      const params = { epId: '12345', seasonId: '67890' };
      const result = getWebSeasonApiUrl(params);
      expect(result).toContain('ep_id=12345');
      expect(result).not.toContain('season_id=67890');
    });

    it('should always include isGaiaAvoided=false', () => {
      const params1 = { epId: '12345' };
      const params2 = { seasonId: '67890' };
      expect(getWebSeasonApiUrl(params1)).toContain('isGaiaAvoided=false');
      expect(getWebSeasonApiUrl(params2)).toContain('isGaiaAvoided=false');
    });
  });

  describe('getPlayurlApiUrl', () => {
    const baseUrl = 'https://api.bilibili.com/pugv/player/web/playurl';
    const defaultParams = {
      avid: '1001',
      cid: '2002',
      seasonIdPlayUrlUse: '3003',
      epIdPlayUrlUse: '4004'
    };

    it('should generate correct base URL with all required params', () => {
      const result = getPlayurlApiUrl(
        defaultParams.avid,
        defaultParams.cid,
        defaultParams.seasonIdPlayUrlUse,
        defaultParams.epIdPlayUrlUse
      );

      expect(result.startsWith(baseUrl)).toBe(true);
      expect(result).toContain('avid=1001');
      expect(result).toContain('cid=2002');
      expect(result).toContain('season_id=3003');
      expect(result).toContain('ep_id=4004');
    });

    it('should include all fixed parameters', () => {
      const result = getPlayurlApiUrl(
        defaultParams.avid,
        defaultParams.cid,
        defaultParams.seasonIdPlayUrlUse,
        defaultParams.epIdPlayUrlUse
      );

      expect(result).toContain('fnver=0');
      expect(result).toContain('fnval=16');
      expect(result).toContain('fourk=1');
      expect(result).toContain('from_client=BROWSER');
      expect(result).toContain('is_main_page=true');
      expect(result).toContain('need_fragment=false');
      expect(result).toContain('isGaiaAvoided=false');
      expect(result).toContain('voice_balance=1');
      expect(result).toContain('drm_tech_type=2');
    });

    it('should URL encode parameters correctly', () => {
      const result = getPlayurlApiUrl('a&b', 'c=d', 'e?f', 'g#h');
      expect(result).toContain('avid=a%26b');
      expect(result).toContain('cid=c%3Dd');
      expect(result).toContain('season_id=e%3Ff');
      expect(result).toContain('ep_id=g%23h');
    });
  });
});
