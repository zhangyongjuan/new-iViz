import { fetchFlyBarData, fetchIMBox, fetchSBBox, fetchHangData,fetchNewFlyBarData ,
  fetchNewOneDayFlyBarData,fetchNewOverallHeatmapData,fetchNewHeatMapByColor,
  fetchCharBySpc,fetchCharByLocation,fetchCharBySpcAndLocation,fetchBoxPlotOneDay} from '@/services/api';

export default {
  namespace: 'FlyBar',

  state: {},

  effects: {
    * getChartData({ payload }, { call, put }) {
      const response = yield call(fetchFlyBarData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    * getHangData({ payload }, { call, put }) {
      const response = yield call(fetchHangData, payload);
      yield put({
        type: 'saveHang',
        payload: response,
      });
    },

    * getIMBox({ payload }, { call, put }) {
      const response = yield call(fetchIMBox, payload);
      yield put({
        type: 'saveIMBox',
        payload: response,
      });
    },

    * getSBBox({ payload }, { call, put }) {
      const response = yield call(fetchSBBox, payload);
      yield put({
        type: 'saveSBBox',
        payload: response,
      });
    },

  //  更改后的flyBar
    * getnewFlyBar({ payload }, { call, put }) {
      const response = yield call(fetchNewFlyBarData, payload);
      yield put({
        type: 'saveNewData',
        payload: response,
      });
    },
  //  getOneFlyBarData
    * getOneDayFlyBarData({ payload }, { call, put }) {
      const response = yield call(fetchNewOneDayFlyBarData, payload);
      yield put({
        type: 'saveNewOneDayFlyBarData',
        payload: response,
      });
    },
  //  getOverallHeatmap
    * getOverallHeatmap({ payload }, { call, put }) {
      const response = yield call(fetchNewOverallHeatmapData, payload);
      yield put({
        type: 'saveNewOverallHeatmapData',
        payload: response,
      });
    },
  //  getHeatMapByColor
    * getHeatMapByColor({ payload }, { call, put }) {
      const response = yield call(fetchNewHeatMapByColor, payload);
      yield put({
        type: 'saveHeatMapByColorData',
        payload: response,
      });
    },
  //  getCharBySpc  点击热力图Y轴spc
    * getCharBySpc({ payload }, { call, put }) {
      const response = yield call(fetchCharBySpc, payload);
      yield put({
        type: 'saveChartBySpcData',
        payload: response,
      });
    },
  //  getCharByLocation
    * getCharByLocation({ payload }, { call, put }) {
      const response = yield call(fetchCharByLocation, payload);
      yield put({
        type: 'saveChartByLocationData',
        payload: response,
      });
    },
  //  getCharBySpcAndLocation
    * getCharBySpcAndLocation({ payload }, { call, put }) {
      const response = yield call(fetchCharBySpcAndLocation, payload);
      yield put({
        type: 'saveCharBySpcAndLocationData',
        payload: response,
      });
    },
  //  getBoxOneDay(last boxPlot chart)
    * getBoxOneDay({ payload }, { call, put }) {
      const response = yield call(fetchBoxPlotOneDay, payload);
      yield put({
        type: 'saveBoxPlotOneDayData',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveIMBox(state, { payload }) {
      return {
        ...state,
        IMBox: { ...payload },
      };
    },
    saveSBBox(state, { payload }) {
      return {
        ...state,
        SBBox: { ...payload },
      };
    },
    saveHang(state, { payload }) {
      return {
        ...state,
        Hang: { ...payload },
      };
    },

  //  new fly bar
    saveNewData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveNewOneDayFlyBarData(state, { payload }) {
      return {
        ...state,
        flybarChartByOneDay:{...payload},
      };
    },
  //  saveNewOverallHeatmapData
    saveNewOverallHeatmapData(state, { payload }) {
      return {
        ...state,
        flybarMapByColorAndLocation:{...payload},
      };
    },
  //  saveHeatMapByColorData
    saveHeatMapByColorData(state, { payload }) {
      return {
        ...state,
        FlybarMapBySpcAndLocation:{...payload},
      };
    },
  //  saveChartBySpcData
    saveChartBySpcData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  //saveChartByLocationData
    saveChartByLocationData(state, { payload }) {
      return {
        ...state,
        FlybarChartBySpc:{...payload},
      };
    },
  //  saveCharBySpcAndLocationData
    saveCharBySpcAndLocationData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  //saveBoxPlotOneDayData
    saveBoxPlotOneDayData(state, { payload }) {
      return {
        ...state,
        FlybarLastBox:{...payload},
      };
    },

  },
};
