import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import {
  formatFileSize,
  getM4sFileName,
  getValidFileName,
  M4S_FILENAME_SRC_TIME,
  removeUselessSuffix
} from '../src/utils/utils';

describe('utils', () => {
  describe('formatFileSize', () => {
    it('formatFileSize', () => {
      const inps = [0, 1023, 1024, 1025, 1111111, 1145141919810];
      const anss = ['0B', '1023B', '1.00KB', '1.00KB', '1.06MB', '1066.50GB'];
      inps.forEach((inp, i) => {
        const res = formatFileSize(inp);
        expect(res).toBe(anss[i]);
      });
    });
  });

  describe('getM4sFileName src time', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      const date = new Date(2023, 0, 13, 14, 15, 16);
      vi.setSystemTime(date);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const WANTED_FILENAME = '20230113141516';

    it('should return correct audio file name with .mp3 extension', () => {
      const mockM4sUrlDesc = {
        isAudio: vi.fn(() => true)
      };
      const result = getM4sFileName(mockM4sUrlDesc, '', M4S_FILENAME_SRC_TIME);
      expect(result).toBe(`${WANTED_FILENAME}.mp3`);
      expect(mockM4sUrlDesc.isAudio).toHaveBeenCalled();
    });

    it('should use current time when no mock is provided', () => {
      vi.useRealTimers();
      const mockM4sUrlDesc = {
        isAudio: vi.fn(() => false)
      };
      const result = getM4sFileName(mockM4sUrlDesc, '', M4S_FILENAME_SRC_TIME);
      console.log('getM4sFileName() result', result);
      const expectedPattern = /^\d{14}\.mp4$/;
      expect(result).toMatch(expectedPattern);
    });

    it('should return correct video file name with .mp4 extension', () => {
      const mockM4sUrlDesc = {
        isAudio: vi.fn(() => false)
      };
      const result = getM4sFileName(mockM4sUrlDesc, '', M4S_FILENAME_SRC_TIME);
      expect(result).toBe(`${WANTED_FILENAME}.mp4`);
      expect(mockM4sUrlDesc.isAudio).toHaveBeenCalled();
    });
  });

  describe('getM4sFileName src title', () => {
    it('test clean', () => {
      const mockM4sUrlDesc = {
        isAudio: vi.fn(() => false)
      };
      const result = getM4sFileName(mockM4sUrlDesc, '../</<\\>>|<||.?][><');
      expect(result).toBe('_._][_.mp4');
      expect(mockM4sUrlDesc.isAudio).toHaveBeenCalled();
    });

    it('test remove .', () => {
      const mockM4sUrlDesc = {
        isAudio: vi.fn(() => false)
      };
      const result = getM4sFileName(mockM4sUrlDesc, '..xyz.test.js...');
      expect(result).toBe('xyz.test.js.mp4');
      expect(mockM4sUrlDesc.isAudio).toHaveBeenCalled();
    });

    it('invalid fileName', () => {
      const mockM4sUrlDesc = {
        isAudio: vi.fn(() => false)
      };
      const result = getM4sFileName(mockM4sUrlDesc, '.........');
      expect(result).toBe('_.mp4');
      expect(mockM4sUrlDesc.isAudio).toHaveBeenCalled();
    });
  });

  describe('removeUselessSuffix', () => {
    it('base', () => {
      expect(removeUselessSuffix('abc123')).toBe('abc123');
      expect(removeUselessSuffix('abc223_哔哩哔哩_bilibili')).toBe('abc223');
      expect(removeUselessSuffix('abc223-哔哩哔哩-bilibili')).toBe('abc223');
      expect(removeUselessSuffix('abc223-bilibili-哔哩哔哩')).toBe('abc223');
      expect(removeUselessSuffix('abc223_bilibili-哔哩哔哩')).toBe('abc223_bilibili-');
      expect(removeUselessSuffix('abc223_哔哩哔哩-bilibili')).toBe('abc223_哔哩哔哩-');
      expect(removeUselessSuffix('测不准的阿波连同学 第二季第5集-番剧-高清独家在线观看-bilibili-哔哩哔哩')).toBe('测不准的阿波连同学 第二季第5集');
      expect(removeUselessSuffix('测不准的阿波连同学 第二季第5集-bilibili-哔哩哔哩-番剧-高清独家在线观看')).toBe('测不准的阿波连同学 第二季第5集');
      expect(removeUselessSuffix('测不准的阿波连同学 第二季第5集-bilibili-哔哩哔哩-bilibili-哔哩哔哩')).toBe('测不准的阿波连同学 第二季第5集');
    });
  });

  describe('getValidFileName', () => {
    it('base', () => {
      expect(getValidFileName('abc123')).toBe('abc123');
    });

    it('remove useless suffix', () => {
      expect(getValidFileName('abc223_哔哩哔哩_bilibili')).toBe('abc223');
    });

    it('make fileName valid', () => {
      const fileName = '【Hi-Res无损】后弦《娃娃脸》“你发的娃娃脸 降落在身边  可惜我 还没有发现”| 音乐可视化 | 动态歌词_哔哩哔哩_bilibili';
      const validFileName = '【Hi-Res无损】后弦《娃娃脸》“你发的娃娃脸 降落在身边  可惜我 还没有发现”_ 音乐可视化 _ 动态歌词';
      expect(getValidFileName(fileName)).toBe(validFileName);
    });
  });
});
