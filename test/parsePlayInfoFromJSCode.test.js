import { expect, describe, it } from 'vitest';
import { parsePlayInfoFromJSCode } from '../src/common/parsePlayInfoFromJSCode';

describe('parsePlayInfoFromJSCode', () => {
  describe('Direct object assignment', () => {
    it('case1', () => {
      const code = `
if (true) {
  window.__playinfo__ = {
    raw: {
      result: {
        video_info: 'mock'
      }
    }
  }
}
    `;
      const playInfo = parsePlayInfoFromJSCode(code);
      expect(playInfo).toStrictEqual({
        raw: {
          result: {
            video_info: 'mock'
          }
        }
      });
    });
  });

  describe('Variable assignment (identifier)', () => {
    it('case1', () => {
      const code = `
const tmpVar = {
  raw: {
    result: {
      video_info: 'mock1'
    }
  }
}
if (true) {
  window.__playinfo__ = tmpVar
}
    `;
      const playInfo = parsePlayInfoFromJSCode(code);
      expect(playInfo).toStrictEqual({
        raw: {
          result: {
            video_info: 'mock1'
          }
        }
      });
    });
  });

  describe('resolveMemberExpressionRight', () => {
    it('member expression right', () => {
      const code = `
const playurlSSRData = {
  raw: {
    result: {
      video_info: 'mock'
    }
  }
}
if (true) {
  window.__playinfo__ = playurlSSRData.raw
}
    `;
      const playInfo = parsePlayInfoFromJSCode(code);
      expect(playInfo).toStrictEqual({
        result: {
          video_info: 'mock'
        }
      });
    });

    it('member expression right nested', () => {
      const code = `
const playurlSSRData = {
  raw: {
    foo: {
      result: {
        video_info: 'mock2'
      }
    }
  }
}
if (true) {
  window.__playinfo__ = playurlSSRData.raw.foo
}
    `;
      const playInfo = parsePlayInfoFromJSCode(code);
      expect(playInfo).toStrictEqual({
        result: {
          video_info: 'mock2'
        }
      });
    });

    it('member expression right nested, computed true', () => {
      const code = `
const playurlSSRData = {
  raw: {
    foo2: {
      bar: {
        bar2: {
          result: {
            video_info: 'mock3'
          }
        }
      }
    }
  }
}
if (true) {
  window.__playinfo__ = playurlSSRData.raw['foo2'].bar['bar2']
}
    `;
      const playInfo = parsePlayInfoFromJSCode(code);
      expect(playInfo).toStrictEqual({
        result: {
          video_info: 'mock3'
        }
      });
    });

    it('member expression right nested + objectExpression', () => {
      const code = `
if (true) {
  window.__playinfo__ = ({
    raw: {
      foo: {
        result: {
          video_info: 'mock4'
        }
      }
    }
  }).raw.foo
}
    `;
      const playInfo = parsePlayInfoFromJSCode(code);
      expect(playInfo).toStrictEqual({
        result: {
          video_info: 'mock4'
        }
      });
    });

    it('member expression right, value is undefined', () => {
      // 实际值是 undefined 但我们返回 null
      const code = `
const playurlSSRData = {
  raw: {
    foo: {
      result: {
        video_info: 'mock5'
      }
    }
  }
}
if (true) {
  window.__playinfo__ = playurlSSRData.raw.foo5
}
    `;
      const playInfo = parsePlayInfoFromJSCode(code);
      expect(playInfo).toBeNull();
    });
  });
});
