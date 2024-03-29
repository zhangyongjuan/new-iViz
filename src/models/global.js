import {summaryPage,getStation} from '@/services/api';
// import select from "eslint-plugin-jsx-a11y/src/util/implicitRoles/select";

export default {
  namespace: 'global',     //namespace 表示在全局state上的key

  state: {
    list: [],
    currentPage:'',
    dateTime: {
      startTime:1557763200000,
      endTime:1557935999000,
      span:'8'
    },
    topSelectItem:{
      site: "",
      product: "",
      color: [],      //有全选和单选之分，全选时需要列出全部选择项
      build: [],
      special_build:[],
      wifi: []
    },
    mapping:{},
    //  总结页
    summaryPageDate:[],
    //aim Statistical Analysis
    stationInfo:{},
  //  timeRange 优先于每个页面加载标志
    timeRangeComplete:false
  },

  effects: {
    //back home page ,currentpage=0
    * saveCurrentPageKey({payload}, {call, put}) {
      yield put({
        type: 'saveCurrentKey',
        payload: {
          currentPage:payload.currentPage
        }
      });
    },

    //timeRange部分
    * saveTime({payload}, {call, put}) {
      // const response = yield call(queryFakeList, payload);
      yield put({
        type: 'saveDate',
        payload: {
          dateTime:payload.timeR
        }
      });
    },
    //更改timeRange是否加载完成的标志
    * changeTimeRangeStatus({payload}, {call, put}) {
      yield put({
        type: 'changeTimeRangeStatusD',
        payload: {
          timeRangeComplete:payload.status
        }
      });
    },
    * saveSelectCondition({payload},{call,put,select}){
      const oldTopSelectItem = yield select(
        state => state.global.topSelectItem
      )
      const newItem = Object.assign({},oldTopSelectItem ,payload.selectItem);
      yield put({
        type:'saveSelect',
        payload:{
          topSelectItem:  newItem
        }
      })
    },
  //  总结页
    * saveSummaryPageData({payload}, {call, put}) {
      console.log('model获取的条件----',payload);
      const response = yield call(summaryPage, payload);
      //response是请求的结果，在此处可以整合此数据
      yield put({
        type: 'saveSummaryPageDatas',
        payload: response
      });
    },
    //aim Statistical Analysis
    * saveAllStation({payload}, {call, put}) {
      console.log('拿到的条件----',payload);
      const response = yield call(getStation, payload);
      console.log('返回的数据----',response);
      yield put({
        type: 'saveStation',
        payload: response
      });
    }
  },
  reducers: {        //接收action，同步更新state
    //保存当前页的key
    saveCurrentKey(state, action){
      return {
        ...state,
        ...action.payload,
      };
    },
    saveDate(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeTimeRangeStatusD(state, action) {
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
    },
    //  总结页
    saveSummaryPageDatas(state,{payload}){
      return{
        ...state,
        summaryPageDate:payload
      }
    },
    //aim Statistical Analysis
    saveStation(state,{payload}){
      return{
        ...state,
        stationInfo:payload
      }
    },
  },
};
