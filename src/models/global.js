import {queryFakeList} from '@/services/api';
// import select from "eslint-plugin-jsx-a11y/src/util/implicitRoles/select";

export default {
  namespace: 'global',     //namespace 表示在全局state上的key

  state: {
    list: [],
    dateTime: {
      startTime:1557763200000,
      endTime:1557935999000,
      span:'8'
    },
    topSelectItem:{
      vendor:'',
      productCode:'',
      color:'',
      build:'',
      speacilBuild:'',
      wifiOr4g:'',
    }
  },

  effects: {
    * saveTime({payload}, {call, put}) {
      // const response = yield call(queryFakeList, payload);
      yield put({
        type: 'saveDate',
        payload: {
          dateTime:payload.timeR
        }
      });
    },
    *saveSelectCondition({payload},{call,put,select}){
      const oldTopSelectItem = yield select(
        state => state.global.topSelectItem
      )
      yield put({
        type:'saveSelect',
        payload:{
          topSelectItem:  Object.assign({},oldTopSelectItem ,payload.item)
        }
      })

    },
  },

  reducers: {        //接收action，同步更新state
    saveDate(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveSelect(state,action){
      return{
        ...state,
        ...action.payload
      }
    }
  },
};
