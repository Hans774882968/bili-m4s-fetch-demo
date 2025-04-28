export const SOURCE_GLOBAL = Symbol('JS global variable');
export const SOURCE_API_PUGV = Symbol('api pugv/player/web/playurl');

export class DashboardData {
  constructor(source, playInfoJson, err) {
    this.source = source;
    this.playInfoJson = playInfoJson;
    this.err = err;
  }

  getSourceText() {
    if (this.source === SOURCE_GLOBAL) {
      return 'JS全局变量';
    }
    if (this.source === SOURCE_API_PUGV) {
      return 'API pugv/player/web/playurl';
    }
    return '未知来源';
  }

  getErrText() {
    return this.err ? String(this.err) : '';
  }
}
