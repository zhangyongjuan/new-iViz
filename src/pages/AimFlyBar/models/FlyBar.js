import { fetchFlyBarData,fetchIMBox,fetchSBBox } from '@/services/api';

export default {
  namespace: 'FlyBar',

  state: {

  },

  effects: {
    *getChartData({payload}, { call, put }) {
      const response = yield call(fetchFlyBarData,payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *getIMBox({payload}, { call, put }) {
      const response = yield call(fetchIMBox,payload);
      yield put({
        type: 'saveIMBox',
        payload: response,
      });
    },

    *getSBBox({payload}, { call, put }) {
      const response = yield call(fetchSBBox,payload);
      yield put({
        type: 'saveSBBox',
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
        IMBox:{...payload},
      };
    },
    saveSBBox(state, { payload }) {
      return {
        ...state,
        SBBox:{...payload},
      };
    },
  },
};
