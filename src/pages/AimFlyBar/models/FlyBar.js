import { fetchFlyBarData, fetchIMBox, fetchSBBox, fetchHangData } from '@/services/api';

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
  },
};
