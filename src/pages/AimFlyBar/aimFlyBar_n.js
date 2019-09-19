import React from 'react';
import {Select, message, Col, Row} from 'antd';
import _ from 'lodash';

import styles from './index.less';
import BasicColumn from '../../component/Charts/BarChart/BasicColumn';
import GroupedColumn from '../../component/Charts/BarChart/GroupedColumn';
import SeriesLine from '../../component/Charts/LineChart/SeriesLine';
import BoxPlot from '../../component/Charts/BoxChart/BoxPlot';
import StackBarLineChart from '../../component/Charts/BarChart/StackBarLineChart';
import HeatMapChart from '../../component/Charts/HeatMapChart'
import { connect } from 'dva';
import BasicLineChart from "../../component/Charts/LineChart";

const { Option } = Select;

const linshiData = [
  {
    'name': '08-01',
    'upper': 2.3,
    'q3': 1.8,
    'q2': 1.5,
    'q1': 1.4,
    'low': 0.5,
    'low_limit': 1.0,
    'up_limit': 2.0,
    'all': 100,
    'err': 2,
    'errData': [
      0.5,
      2.3,
    ],
  },
  {
    'name': '08-02',
    'upper': 2.5,
    'q3': 1.8,
    'q2': 1.5,
    'q1': 1.4,
    'low': 0.6,
    'low_limit': 1.0,
    'up_limit': 2.0,
    'all': 100,
    'err': 3,
    'errData': [
      0.6,
      0.65,
      2.5,
    ],
  },
  {
    'name': '08-03',
    'upper': 1.9,
    'q3': 1.8,
    'q2': 1.5,
    'q1': 1.4,
    'low': 0.2,
    'low_limit': 1.0,
    'up_limit': 2.0,
    'all': 100,
    'err': 4,
    'errData': [
      0.2,
      0.8,
      2.2,
      2.3,
    ],
  },
];

//基于天数的不同颜色的良率对比-data
const FlybarMapByColorAndLocation={
  "title":'Overall Heatmap',
  "rowList": [
    {
      "columns": [
        {
          "all": 1803,//总数
          "defect": 0,
          "yield": 0.1,//良率
          "ng": 0,
          "time": "4",//列名
          "ok": 1803//好的
        },
        {
          "all": 62,
          "defect": 0,
          "yield": 0.3,
          "ng": 0,
          "time": "5",
          "ok": 62
        }
      ],
      "rowName": "NDA",
      "sumValue": 4
    },
    {
      "columns": [
        {
          "all": 129,
          "defect": 0,
          "yield": 0.4,
          "ng": 0,
          "time": "4",
          "ok": 129
        },
        {
          "all": 111,
          "defect": 0,
          "yield": 0.4,
          "ng": 0,
          "time": "5",
          "ok": 111
        }
      ],
      "rowName": "Sparrow",
      "sumValue": 5
    }
  ],
  "columnsName": [
    "4",
    "5"
  ]
}


@connect(({ global, FlyBar, loading }) => ({
  global,
  FlyBar,
  loading: loading.effects['FlyBar/getnewFlyBar'],
}))
class AimFlyBar_n extends React.Component {
  state={
    show2:false
  }
  constructor(props) {
    super(props);
    this.state = {
      spc: '',
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { dateTime, topSelectItem } = this.props.global;
    if (!(_.isEqual(dateTime, nextProps.global.dateTime) && _.isEqual(topSelectItem, nextProps.global.topSelectItem))) {
      this.getFlyBarChart(nextProps.global.dateTime, nextProps.global.topSelectItem);
    }
  }


  componentDidMount() {
    const { global } = this.props;
    const { topSelectItem, dateTime } = global;
    this.getFlyBarChart(dateTime, topSelectItem);
  }

  getFlyBarChart = (dateTime, topSelectItem) => {
    const { dispatch } = this.props;
    const { startTime, endTime } = dateTime;
    dispatch({
      type: 'FlyBar/getnewFlyBar',
      payload: {
        data: JSON.stringify({
          startTime,
          endTime,
          mapping: { ...topSelectItem },
        }),
      },
    });
  };

  handleChangeSpc = (value) => {
    this.setState({
      spc: value,
    });
  };

  transLineData = (data) => {
    const newData = [];
    const a = [1, 2, 4];
    _.forEach(data, (k) => {
      _.forEach(k.data, (h) => {
        newData.push({ name: k.name, ...h });
      });
    });
    return newData;
  };

  handleClickBar = (param) => {
    console.log(param);
    const { dispatch, global } = this.props;
    const { topSelectItem } = global;
    const { startTime, endTime } = global && global.dateTime;
    const { spc } = this.state;
    const { data } = param;
    const { _origin = '' } = data || [];
    // seriesName
    // name
    if (spc) {
      if (param.shape.name === 'interval'&&_origin) {
        dispatch({
          type: 'FlyBar/getHangData',
          payload: {
            data: JSON.stringify({
              startTime,
              endTime,
              mapping: { ...topSelectItem },
              flyBar: _origin.type,
              hang: _origin.company,
              spc,
            }),
          },
        });
      }
    } else {
      message.warning('Please select Spc');
    }
  };
  //良率对比分析图被点击了
  clickOneDay=(param)=>{
    console.log('柱子被点击了---',param);
    //当前所选时间，当前时间08:00计算
    const currentTime = new Date(param.name).getTime() + 8*60*60*1000;
    const { dispatch, global } = this.props;
    const { topSelectItem } = global;
    const { startTime, endTime } = global && global.dateTime;
    dispatch({
      type: 'FlyBar/getOneDayFlyBarData',
      payload: {
        data: JSON.stringify({
          startTime,
          endTime,
          mapping: { ...topSelectItem },
          flyBarDay: currentTime,
        }),
      },
    });
  }
  //点击heatmap
  clickHeatMap = (param)=>{
    console.log('热力图被点击了---',param)
  }
  render() {
    const { FlyBar, loading } = this.props;
    const { spc } = this.state;
    const singleBarData = FlyBar && FlyBar.barBlockChart && FlyBar.barBlockChart.series && FlyBar.barBlockChart.series.length !== 0 && FlyBar.barBlockChart.series[0].data || [];
    const seriesLineData = (FlyBar && FlyBar.barLineChart && FlyBar.barLineChart.lines || []);
    const { spcs = [], guaBlockChart = [], Hang = [], barLineChart = [] } = FlyBar;
    const { boxList = '' } = Hang;
    const { timeList = [] } = barLineChart;
    const { series = [] } = guaBlockChart;
    console.log(FlyBar);

    //new data
    const flybarChartByDay = FlyBar && FlyBar.flybarChartByDay  || [];
    const FlybarChartByColor = FlyBar && FlyBar.flybarChartByColor  || [];
    const flybarChartByLocation = FlyBar && FlyBar.flybarChartByLocation  || [];
    const flybarChartByOneDay = FlyBar && FlyBar.flybarChartByOneDay  || [];
    return (
      <div className={styles.main}>

        {/* ok or ng */}
        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Failure Rate Trend</p>
          <Row gutter={48} type="flex">
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <BasicLineChart
                params={{
                  data: flybarChartByDay.lines || [],
                  dataZoomX:false,         //只有值为布尔值 true时才会显示
                  dataZoomY:false,
                  xAxis: 'time',
                  yAxis: 'value',
                  loading,
                  title:flybarChartByDay.title,
                  clickBar:this.clickOneDay
                }}
              />
            </Col>
          </Row>
          {
            flybarChartByOneDay.length !==0 ? (
              <div className={styles.firstRow}>
                <p className={styles.headerTitle}>Failure Rate Comparison By Flight Bar</p>
                <Row gutter={48} type="flex">
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <BasicLineChart
                      params={{
                        data: flybarChartByOneDay.lines,
                        dataZoomX:false,         //只有值为布尔值 true时才会显示
                        dataZoomY:false,
                        xAxis: 'time',
                        yAxis: 'value',
                        loading,
                        title:flybarChartByOneDay.title,
                      }}
                    />
                  </Col>
                </Row>
              </div>
            ) : null
          }

        </div>

        {/* Color & Location */}
        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Color & Location</p>
          <Row gutter={48} type="flex">
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <StackBarLineChart
                params={{
                  data: FlybarChartByColor.lines || {},
                  dataZoomX:false,         //只有值为布尔值 true时才会显示
                  dataZoomY:false,
                  xAxis: 'time',
                  yAxis: 'value',
                  loading,
                  info:FlybarChartByColor || [],
                }}
              />
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <StackBarLineChart
                params={{
                  data: flybarChartByLocation.lines || {},
                  dataZoomX:false,         //只有值为布尔值 true时才会显示
                  dataZoomY:false,
                  xAxis: 'time',
                  yAxis: 'value',
                  loading,
                  info:flybarChartByLocation || [],
                }}
              />
            </Col>
          </Row>
        </div>

        {/* heatmap */}
        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Heatmap</p>
          <Row gutter={48} type="flex">
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <HeatMapChart
                params={{
                  data: FlybarMapByColorAndLocation || {},
                  triggerEventX:true,
                  triggerEventY:true,
                  loading,
                  title:FlybarMapByColorAndLocation.title,
                  clickHeatMap:this.clickHeatMap
                }}
              />
            </Col>
            {/*<Col xl={12} lg={12} md={12} sm={12} xs={12}>*/}
            {/*  <StackBarLineChart*/}
            {/*    params={{*/}
            {/*      data: flybarChartByLocation.lines || {},*/}
            {/*      dataZoomX:false,         //只有值为布尔值 true时才会显示*/}
            {/*      dataZoomY:false,*/}
            {/*      xAxis: 'time',*/}
            {/*      yAxis: 'value',*/}
            {/*      loading,*/}
            {/*      info:flybarChartByLocation || [],*/}
            {/*    }}*/}
            {/*  />*/}
            {/*</Col>*/}
          </Row>
        </div>

        {/*<div className={styles.firstRow}>*/}
        {/*  <p className={styles.headerTitle}> SPC Distribution Comparision By Rack</p>*/}
        {/*  <div className={styles.lineChartGroup}>*/}
        {/*    {*/}
        {/*      spc && boxList ? (*/}
        {/*        <BoxPlot*/}
        {/*          params={{*/}
        {/*            data: boxList || [],*/}
        {/*          }}*/}
        {/*        />*/}
        {/*      ) : null*/}
        {/*    }*/}
        {/*  </div>*/}
        {/*</div>*/}

      </div>
    );
  }
}

export default AimFlyBar_n;
