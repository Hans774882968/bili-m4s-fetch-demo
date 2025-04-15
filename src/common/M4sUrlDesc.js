export class M4sUrlDesc {
  static VIDEO = Symbol();
  static AUDIO = Symbol();

  constructor(url, quality, type) {
    this.url = url;
    this.quality = quality ? String(quality) : 'unknown';
    this.type = type;
  }

  isVideo() {
    return this.type === M4sUrlDesc.VIDEO;
  }

  isAudio() {
    return this.type === M4sUrlDesc.AUDIO;
  }

  getTypeStr() {
    return this.isVideo() ? '视频' : '音频';
  }
}
