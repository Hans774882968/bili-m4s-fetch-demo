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
    const res = mp4VideoList.reduce((res, cur) => {
      const { quality } = cur;
      const durlItem = cur.durl[0];
      const mp4Url = durlItem.url || '';
      if (mp4Url) {
        const m4sUrlDesc = new M4sUrlDesc(mp4Url, quality, M4sUrlDesc.VIDEO, false);
        res.push(m4sUrlDesc);
      }
      const backupUrlList = durlItem.backup_url || durlItem.backupUrl;
      if (Array.isArray(backupUrlList)) {
        backupUrlList.forEach((backupUrl) => {
          const m4sUrlDesc = new M4sUrlDesc(backupUrl, quality, M4sUrlDesc.VIDEO, true);
          res.push(m4sUrlDesc);
        });
      } else if (typeof backupUrlList === 'string' && backupUrlList) {
        const m4sUrlDesc = new M4sUrlDesc(backupUrlList, quality, M4sUrlDesc.VIDEO, true);
        res.push(m4sUrlDesc);
      }
      return res;
    }, []);
    return res;
  }

  _parseOrdinaryVideoCommon(videoList) {
    if (!Array.isArray(videoList)) return [];
    const qualitySet = new Set();
    const res = videoList.reduce((res, cur) => {
      const { id: quality } = cur;
      if (quality && qualitySet.has(quality)) return res;
      const baseUrl = cur.baseUrl || cur.base_url;
      if (baseUrl) {
        const m4sUrlDesc = new M4sUrlDesc(baseUrl, quality, M4sUrlDesc.VIDEO, false);
        res.push(m4sUrlDesc);
      }
      const backupUrlList = cur.backupUrl || cur.backup_url;
      if (Array.isArray(backupUrlList)) {
        backupUrlList.forEach((backupUrl) => {
          const m4sUrlDesc = new M4sUrlDesc(backupUrl, quality, M4sUrlDesc.VIDEO, true);
          res.push(m4sUrlDesc);
        });
      } else if (typeof backupUrlList === 'string' && backupUrlList) {
        const m4sUrlDesc = new M4sUrlDesc(backupUrlList, quality, M4sUrlDesc.VIDEO, true);
        res.push(m4sUrlDesc);
      }
      if (quality) qualitySet.add(quality);
      return res;
    }, []);
    return res;
  }

  _parseOrdinaryAudioCommon(audioList) {
    if (!Array.isArray(audioList)) return [];
    const res = audioList.reduce((res, cur) => {
      const { id: quality } = cur;
      const baseUrl = cur.baseUrl || cur.base_url;
      if (baseUrl) {
        const m4sUrlDesc = new M4sUrlDesc(baseUrl, quality, M4sUrlDesc.AUDIO, false);
        res.push(m4sUrlDesc);
      }
      const backupUrlList = cur.backupUrl || cur.backup_url;
      if (Array.isArray(backupUrlList)) {
        backupUrlList.forEach((backupUrl) => {
          const m4sUrlDesc = new M4sUrlDesc(backupUrl, quality, M4sUrlDesc.AUDIO, true);
          res.push(m4sUrlDesc);
        });
      } else if (typeof backupUrlList === 'string' && backupUrlList) {
        const m4sUrlDesc = new M4sUrlDesc(backupUrlList, quality, M4sUrlDesc.AUDIO, true);
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

// 250508 B站更新了，新版本取 data ，旧版本取 result.video_info.dash.video
export class BangumiPlayInfoParser extends PlayInfoParser {
  isVipPlayInfo() {
    const videoList = this.playInfo?.data?.video_info?.dash?.video
      || this.playInfo?.result?.video_info?.dash?.video;
    return !Array.isArray(videoList);
  }

  parseVipMp4() {
    const mp4VideoList = this.playInfo?.data?.video_info?.durls
      || this.playInfo?.result?.video_info?.durls;
    return this._parseVipMp4VideoListCommon(mp4VideoList);
  }

  parseOrdinaryVideo() {
    const videoList = this.playInfo?.data?.video_info?.dash?.video
      || this.playInfo?.result?.video_info?.dash?.video;
    return this._parseOrdinaryVideoCommon(videoList);
  }

  parseOrdinaryAudio() {
    const audioList = this.playInfo?.data?.video_info?.dash?.audio
      || this.playInfo?.result?.video_info?.dash?.audio;
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
