import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import { formatFileSize, getM4sFileName } from '../src/common/utils';

describe('utils', () => {
  it('formatFileSize', () => {
    const inps = [0, 1023, 1024, 1025, 1111111, 1145141919810];
    const anss = ['0B', '1023B', '1.00KB', '1.00KB', '1.06MB', '1066.50GB'];
    inps.forEach((inp, i) => {
      const res = formatFileSize(inp);
      expect(res).toBe(anss[i]);
    });
  });

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
    const result = getM4sFileName(mockM4sUrlDesc);
    expect(result).toBe(`${WANTED_FILENAME}.mp3`);
    expect(mockM4sUrlDesc.isAudio).toHaveBeenCalled();
  });

  it('should use current time when no mock is provided', () => {
    vi.useRealTimers();
    const mockM4sUrlDesc = {
      isAudio: vi.fn(() => false)
    };
    const result = getM4sFileName(mockM4sUrlDesc);
    console.log('getM4sFileName() result', result);
    const expectedPattern = /^\d{14}\.mp4$/;
    expect(result).toMatch(expectedPattern);
  });

  it('should return correct video file name with .mp4 extension', () => {
    const mockM4sUrlDesc = {
      isAudio: vi.fn(() => false)
    };
    const result = getM4sFileName(mockM4sUrlDesc);
    expect(result).toBe(`${WANTED_FILENAME}.mp4`);
    expect(mockM4sUrlDesc.isAudio).toHaveBeenCalled();
  });
});
