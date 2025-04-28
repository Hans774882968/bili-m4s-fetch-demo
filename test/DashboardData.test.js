import { describe, expect, it } from 'vitest';
import { DashboardData, SOURCE_API_PUGV, SOURCE_GLOBAL } from '../src/common/DashboardData';

describe('DashboardData', () => {
  it('测试构造函数', () => {
    const dashboardData = new DashboardData(SOURCE_GLOBAL, { videoId: 114514 }, null);
    expect(dashboardData.source).toBe(SOURCE_GLOBAL);
    expect(dashboardData.playInfoJson.videoId).toBe(114514);
    expect(dashboardData.err).toBe(null);
  });

  it('测试构造函数，source属性为SOURCE_API_PUGV', () => {
    const dashboardData = new DashboardData(SOURCE_API_PUGV, { videoId: 114514 }, null);
    expect(dashboardData.source).toBe(SOURCE_API_PUGV);
  });

  it('测试getSourceText方法', () => {
    const dashboardData = new DashboardData(SOURCE_GLOBAL, { videoId: 114514 }, null);
    expect(dashboardData.getSourceText()).toBe('JS全局变量');
  });

  it('测试getSourceText方法，source属性为SOURCE_API_PUGV', () => {
    const dashboardData = new DashboardData(SOURCE_API_PUGV, { videoId: 114514 }, null);
    expect(dashboardData.getSourceText()).toBe('API pugv/player/web/playurl');
  });

  it('测试getErrText方法', () => {
    const dashboardData = new DashboardData(SOURCE_GLOBAL, { videoId: 114514 }, null);
    expect(dashboardData.getErrText()).toBe('');
  });

  it('测试getErrText方法，err属性为非空', () => {
    const dashboardData = new DashboardData(SOURCE_GLOBAL, { videoId: 114514 }, new Error('Error 1919810'));
    expect(dashboardData.getErrText()).toBe('Error: Error 1919810');
  });
});
