import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ParseRet,
  PlayInfoParser,
  VideoDetailPlayInfoParser,
  BangumiPlayInfoParser,
  CoursePlayInfoParser
} from '../src/common/PlayInfoParsers';
import { M4sUrlDesc } from '../src/common/M4sUrlDesc';

describe('ParseRet', () => {
  it('should initialize with empty arrays if no arguments provided', () => {
    const ret = new ParseRet();
    expect(ret.audioUrls).toEqual([]);
    expect(ret.videoUrls).toEqual([]);
  });

  it('should initialize with provided audio and video URLs', () => {
    const audioUrls = ['audio1', 'audio2'];
    const videoUrls = ['video1', 'video2'];
    const ret = new ParseRet(audioUrls, videoUrls);
    expect(ret.audioUrls).toEqual(audioUrls);
    expect(ret.videoUrls).toEqual(videoUrls);
  });
});

describe('PlayInfoParser', () => {
  let parser;

  beforeEach(() => {
    parser = new PlayInfoParser({});
  });

  it('should initialize with playInfo', () => {
    const playInfo = { data: 'test' };
    const instance = new PlayInfoParser(playInfo);
    expect(instance.playInfo).toEqual(playInfo);
  });

  it('isVipPlayInfo should return false by default', () => {
    expect(parser.isVipPlayInfo()).toBe(false);
  });

  it('parseVipMp4 should return empty array by default', () => {
    expect(parser.parseVipMp4()).toEqual([]);
  });

  it('parseOrdinaryVideo should return empty array by default', () => {
    expect(parser.parseOrdinaryVideo()).toEqual([]);
  });

  it('parseOrdinaryAudio should return empty array by default', () => {
    expect(parser.parseOrdinaryAudio()).toEqual([]);
  });

  describe('_parseVipMp4VideoListCommon', () => {
    it('should return empty array for invalid input', () => {
      expect(parser._parseVipMp4VideoListCommon(null)).toEqual([]);
      expect(parser._parseVipMp4VideoListCommon(undefined)).toEqual([]);
      expect(parser._parseVipMp4VideoListCommon({})).toEqual([]);
    });

    it('should parse valid mp4 video list', () => {
      const mp4VideoList = [
        {
          quality: 1080,
          durl: [{ url: 'http://example.com/video1.mp4' }]
        },
        {
          quality: 720,
          durl: [{ url: 'http://example.com/video2.mp4' }]
        }
      ];

      const result = parser._parseVipMp4VideoListCommon(mp4VideoList);
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(M4sUrlDesc);
      expect(result[0].url).toBe('http://example.com/video1.mp4');
      expect(result[0].quality).toBe('1080');
      expect(result[1].url).toBe('http://example.com/video2.mp4');
      expect(result[1].quality).toBe('720');
    });
  });

  describe('_parseOrdinaryVideoCommon', () => {
    it('should parse valid video list', () => {
      const videoList = [
        { id: 1, baseUrl: 'http://example.com/video1' },
        { id: 2, baseUrl: 'http://example.com/video2' }
      ];

      const result = parser._parseOrdinaryVideoCommon(videoList);
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(M4sUrlDesc);
      expect(result[0].url).toBe('http://example.com/video1');
      expect(result[1].url).toBe('http://example.com/video2');
    });
  });

  describe('_parseOrdinaryAudioCommon', () => {
    it('should return empty array for invalid input', () => {
      expect(parser._parseOrdinaryAudioCommon(null)).toEqual([]);
      expect(parser._parseOrdinaryAudioCommon(undefined)).toEqual([]);
      expect(parser._parseOrdinaryAudioCommon({})).toEqual([]);
    });

    it('should parse valid audio list', () => {
      const audioList = [
        { id: 1, baseUrl: 'http://example.com/audio1' },
        { id: 2, base_url: 'http://example.com/audio2' }
      ];

      const result = parser._parseOrdinaryAudioCommon(audioList);
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(M4sUrlDesc);
      expect(result[0].url).toBe('http://example.com/audio1');
      expect(result[1].url).toBe('http://example.com/audio2');
    });
  });

  describe('parse', () => {
    it('should return ParseRet with empty arrays by default', () => {
      const result = parser.parse();
      expect(result).toBeInstanceOf(ParseRet);
      expect(result.audioUrls).toEqual([]);
      expect(result.videoUrls).toEqual([]);
    });

    it('should call parseVipMp4 when isVipPlayInfo returns true', () => {
      const realParser = new PlayInfoParser({});
      vi.spyOn(realParser, 'isVipPlayInfo').mockReturnValue(true);
      vi.spyOn(realParser, 'parseVipMp4').mockReturnValue(['vip1', 'vip2']);
      vi.spyOn(realParser, 'parseOrdinaryAudio').mockReturnValue(['audio1']);
      vi.spyOn(realParser, 'parseOrdinaryVideo').mockReturnValue(['video1']);
      const result = realParser.parse();
      expect(result.videoUrls).toEqual(['vip1', 'vip2']);
      expect(result.audioUrls).toEqual([]);
      // 验证方法被调用
      expect(realParser.isVipPlayInfo).toHaveBeenCalled();
      expect(realParser.parseVipMp4).toHaveBeenCalled();
      expect(realParser.parseOrdinaryAudio).not.toHaveBeenCalled();
      expect(realParser.parseOrdinaryVideo).not.toHaveBeenCalled();
    });
  });
});

describe('VideoDetailPlayInfoParser', () => {
  it('should identify VIP play info when dash.video is not an array', () => {
    const parser1 = new VideoDetailPlayInfoParser({ data: { dash: { video: null } } });
    const parser2 = new VideoDetailPlayInfoParser({ data: { dash: { video: [] } } });

    expect(parser1.isVipPlayInfo()).toBe(true);
    expect(parser2.isVipPlayInfo()).toBe(false);
  });

  it('should parse ordinary video from data.dash.video', () => {
    const playInfo = {
      data: {
        dash: {
          video: [
            { id: 1, baseUrl: 'http://example.com/video1' },
            { id: 2, baseUrl: 'http://example.com/video2' }
          ]
        }
      }
    };

    const parser = new VideoDetailPlayInfoParser(playInfo);
    const result = parser.parseOrdinaryVideo();
    expect(result.length).toBe(2);
    expect(result[0].url).toBe('http://example.com/video1');
  });

  it('should parse ordinary audio from data.dash.audio', () => {
    const playInfo = {
      data: {
        dash: {
          audio: [
            { id: 1, baseUrl: 'http://example.com/audio1' }
          ]
        }
      }
    };

    const parser = new VideoDetailPlayInfoParser(playInfo);
    const result = parser.parseOrdinaryAudio();
    expect(result.length).toBe(1);
    expect(result[0].url).toBe('http://example.com/audio1');
  });
});

describe('BangumiPlayInfoParser', () => {
  it('should identify VIP play info when data.video_info.dash.video is not an array', () => {
    const parser1 = new BangumiPlayInfoParser({ data: { video_info: { dash: { video: null } } } });
    const parser2 = new BangumiPlayInfoParser({ data: { video_info: { dash: { video: [] } } } });

    expect(parser1.isVipPlayInfo()).toBe(true);
    expect(parser2.isVipPlayInfo()).toBe(false);
  });

  it('should parse VIP mp4 from data.video_info.durls', () => {
    const playInfo = {
      data: {
        video_info: {
          durls: [
            { quality: 1080, durl: [{ url: 'http://example.com/vip.mp4' }] }
          ]
        }
      }
    };

    const parser = new BangumiPlayInfoParser(playInfo);
    const result = parser.parseVipMp4();
    expect(result.length).toBe(1);
    expect(result[0].url).toBe('http://example.com/vip.mp4');
  });

  it('should parse ordinary video from data.video_info.dash.video', () => {
    const playInfo = {
      data: {
        video_info: {
          dash: {
            video: [
              { id: 1, baseUrl: 'http://example.com/video1' }
            ]
          }
        }
      }
    };

    const parser = new BangumiPlayInfoParser(playInfo);
    const result = parser.parseOrdinaryVideo();
    expect(result.length).toBe(1);
    expect(result[0].url).toBe('http://example.com/video1');
  });
});

describe('CoursePlayInfoParser', () => {
  it('should identify VIP play info when data.dash.video is not an array', () => {
    const parser1 = new CoursePlayInfoParser({ data: { dash: { video: null } } });
    const parser2 = new CoursePlayInfoParser({ data: { dash: { video: [] } } });

    expect(parser1.isVipPlayInfo()).toBe(true);
    expect(parser2.isVipPlayInfo()).toBe(false);
  });

  it('should parse VIP mp4 from data.durls', () => {
    const playInfo = {
      data: {
        durls: [
          { quality: 720, durl: [{ url: 'http://example.com/course.mp4' }] }
        ]
      }
    };

    const parser = new CoursePlayInfoParser(playInfo);
    const result = parser.parseVipMp4();
    expect(result.length).toBe(1);
    expect(result[0].url).toBe('http://example.com/course.mp4');
  });

  it('should parse ordinary video from data.dash.video', () => {
    const playInfo = {
      data: {
        dash: {
          video: [
            { id: 1, baseUrl: 'http://example.com/course-video1' }
          ]
        }
      }
    };

    const parser = new CoursePlayInfoParser(playInfo);
    const result = parser.parseOrdinaryVideo();
    expect(result.length).toBe(1);
    expect(result[0].url).toBe('http://example.com/course-video1');
  });
});
