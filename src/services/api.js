import { stringify } from 'qs';
import request from '@/utils/request';

//下面两个是get和post请求方式的案例，不生效
export async function queryFakeList(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

//总结页数据，summary
export async function summaryPage(params) {
  return request('/api/rule/full/getHome', {
    method: 'POST',
    data: params,
  });
}

//aim Statistical Analysis
export async function getStation(params) {
  return request(`${global.constants.ip}/spc/getStations`, {
    method: 'post',
    type: 'json',
    data: params,
  });
}


export async function fetchChartData(params) {
  return request('/api/story/getBowingKinking', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

//get Box data of IM
export async function fetchIMBox(params) {
  return request('/api/story/getBowingSpcBox', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

//get Box data of SB
export async function fetchSBBox(params) {
  return request('/api/story/getKinkingSpcBox', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


export async function fetchFlyBarData(params) {
  return request('/api/story/getFlyBar', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

export async function fetchHangData(params) {
  return request('/api/story/getHangSpcBox', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

//new fight bar page
export async function fetchNewFlyBarData(params) {
  return request('/api/story/getFlyBarOneColor', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
//getOneDayFlyBarData
export async function fetchNewOneDayFlyBarData(params) {
  return request('/api/story/getFlyBarOneDay', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
//fetchNewOverallHeatmapData
export async function fetchNewOverallHeatmapData(params) {
  return request('/api/story/getHeatMap', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
//fetchNewHeatMapByColor
export async function fetchNewHeatMapByColor(params) {
  return request('/api/story/getHeatMapByColor', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
//fetchNewChartBySpc
export async function fetchCharBySpc(params) {
  return request('/api/story/getCharBySpc', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
export async function fetchCharByLocation(params) {
  return request('/api/story/getCharByLocation', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
//fetchCharBySpcAndLocation
export async function fetchCharBySpcAndLocation(params) {
  return request('/api/story/getCharBySpcAndLocation', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
//fetchBoxPlotOneDay
export async function fetchBoxPlotOneDay(params) {
  return request('/api/story/getBoxOneDay', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
