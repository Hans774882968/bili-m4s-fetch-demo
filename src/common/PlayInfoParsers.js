import { M4sUrlDesc } from './M4sUrlDesc';

export class ParseRet {
  constructor(audioUrls, videoUrls) {
    this.audioUrls = audioUrls || [];
    this.videoUrls = videoUrls || [];
  }
}

export class PlayInfoParser {
  constructor(playInfo) {
    this.playInfo = playInfo;
  }

  isVipPlayInfo() {
    return false;
  }

  parseVipMp4() {
    return [];
  }

  _parseVipMp4VideoListCommon(mp4VideoList) {
    if (!Array.isArray(mp4VideoList)) return [];
    return mp4VideoList.map((cur) => {
      const mp4Url = cur.durl[0].url || '';
      const m4sUrlDesc = new M4sUrlDesc(mp4Url, cur.quality, M4sUrlDesc.VIDEO);
      return m4sUrlDesc;
    });
  }

  _parseOrdinaryVideoCommon(videoList) {
    const qualitySet = new Set();
    const res = videoList.reduce((res, cur) => {
      const baseUrl = cur.baseUrl || cur.base_url;
      // TODO: cur.id 原则上存在，先不管它不存在的情况了
      if (baseUrl && !qualitySet.has(cur.id)) {
        const m4sUrlDesc = new M4sUrlDesc(baseUrl, cur.id, M4sUrlDesc.VIDEO);
        res.push(m4sUrlDesc);
        qualitySet.add(cur.id);
      }
      return res;
    }, []);
    return res;
  }

  _parseOrdinaryAudioCommon(audioList) {
    if (!Array.isArray(audioList)) return [];
    const res = audioList.reduce((res, cur) => {
      const baseUrl = cur.baseUrl || cur.base_url;
      if (baseUrl) {
        const m4sUrlDesc = new M4sUrlDesc(baseUrl, cur.id, M4sUrlDesc.AUDIO);
        res.push(m4sUrlDesc);
      }
      return res;
    }, []);
    return res;
  }

  parseOrdinaryVideo() {
    return [];
  }

  parseOrdinaryAudio() {
    return [];
  }

  parse() {
    if (this.isVipPlayInfo()) {
      return new ParseRet([], this.parseVipMp4());
    }
    return new ParseRet(this.parseOrdinaryAudio(), this.parseOrdinaryVideo());
  }
}

export class VideoDetailPlayInfoParser extends PlayInfoParser {
  isVipPlayInfo() {
    const videoList = this.playInfo?.data?.dash?.video;
    return !Array.isArray(videoList);
  }

  // 视频详情页没有VIP版。理论上不会走这里
  parseVipMp4() {
    const mp4VideoList = this.playInfo?.result?.video_info?.durls;
    return this._parseVipMp4VideoListCommon(mp4VideoList);
  }

  parseOrdinaryVideo() {
    const videoList = this.playInfo?.data?.dash?.video;
    return this._parseOrdinaryVideoCommon(videoList);
  }

  parseOrdinaryAudio() {
    const audioList = this.playInfo?.data?.dash?.audio;
    return this._parseOrdinaryAudioCommon(audioList);
  }
}

export class BangumiPlayInfoParser extends PlayInfoParser {
  isVipPlayInfo() {
    const videoList = this.playInfo?.result?.video_info?.dash?.video;
    return !Array.isArray(videoList);
  }

  parseVipMp4() {
    const mp4VideoList = this.playInfo?.result?.video_info?.durls;
    return this._parseVipMp4VideoListCommon(mp4VideoList);
  }

  parseOrdinaryVideo() {
    const videoList = this.playInfo?.result?.video_info?.dash?.video;
    return this._parseOrdinaryVideoCommon(videoList);
  }

  parseOrdinaryAudio() {
    const audioList = this.playInfo?.result?.video_info?.dash?.audio;
    return this._parseOrdinaryAudioCommon(audioList);
  }
}

export class CoursePlayInfoParser extends PlayInfoParser {
  isVipPlayInfo() {
    const videoList = this.playInfo?.data?.dash?.video;
    return !Array.isArray(videoList);
  }

  parseVipMp4() {
    const mp4VideoList = this.playInfo?.data?.durls;
    return this._parseVipMp4VideoListCommon(mp4VideoList);
  }

  parseOrdinaryVideo() {
    const videoList = this.playInfo?.data?.dash?.video;
    return this._parseOrdinaryVideoCommon(videoList);
  }

  parseOrdinaryAudio() {
    const audioList = this.playInfo?.data?.dash?.audio;
    return this._parseOrdinaryAudioCommon(audioList);
  }
}
