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

@connect(({ global, FlyBar, loading }) => ({
  global,
  FlyBar,
  loading: loading.effects['FlyBar/getnewFlyBar'],
}))
class AimFlyBar_n extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ChartByOneDay:'',
      spc: '',
      location:'',
      clickStackBarByColorTime:-1,
      clickHeatMapByColor:'',
      clickBoxPlotOneDay:''
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { dateTime, topSelectItem } = this.props.global;
    if (!(_.isEqual(dateTime, nextProps.global.dateTime) && _.isEqual(topSelectItem, nextProps.global.topSelectItem))) {
      this.getFlyBarChart(nextProps.global.dateTime, nextProps.global.topSelectItem);
      this.setState({ChartByOneDay:'',spc:'',location:'',clickStackBarByColorTime:-1,clickHeatMapByColor:'',clickBoxPlotOneDay:''})
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

  //良率对比分析图被点击了
  clickOneDay=(param)=>{
    // console.log('柱子被点击了---',param);
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
    this.setState({ChartByOneDay:param.name})
  }
  //点击color的stackbarlineChart
  clickStackBarLineChart = (param)=>{
    // console.log('堆积柱状折线图被点击了---',param);
    //当前所选时间，当前时间08:00计算
    const currentTime = new Date(param.name).getTime() + 8*60*60*1000;
    const { dispatch, global } = this.props;
    const { topSelectItem } = global;
    const { startTime, endTime } = global && global.dateTime;
    dispatch({
      type: 'FlyBar/getOverallHeatmap',
      payload: {
        data: JSON.stringify({
          startTime,
          endTime,
          mapping: { ...topSelectItem },
          flyBarDay: currentTime,
        }),
      },
    });
    //当图3堆积柱子被点击时，图6的热力图不展示
    this.setState({clickStackBarByColorTime:currentTime,clickHeatMapByColor:'',spc:'',location:'',clickBoxPlotOneDay:''});
  }
  //点击图5 heatmapY轴颜色字段名称
  clickHeatMapByColor = (param)=>{
    // console.log('图5热力图Color被点击了---',param);
    const currentTime = this.state.clickStackBarByColorTime;
    const { dispatch, global } = this.props;
    const { topSelectItem } = global;
    const { startTime, endTime } = global && global.dateTime;
    dispatch({
      type: 'FlyBar/getHeatMapByColor',
      payload: {
        data: JSON.stringify({
          startTime,
          endTime,
          mapping: { ...topSelectItem },
          flyBarDay: currentTime,
          color:param.value
        }),
      },
    });
    this.setState({clickHeatMapByColor:param.value,spc:'',location:'',clickBoxPlotOneDay:''});
  }
  //点击图6 heatMap部分
  clickHeatMapBySpcAndLocation =(param)=>{
    // console.log('图6热力图被点击了--',param);
  //  1、判断点击的x，y或者series部分
    let typeStr = {},requestUrl = '';
    let nowSpc='',nowLocation='';
    const clickType = param.componentType;
    if(clickType === 'yAxis'){
      requestUrl = 'FlyBar/getCharBySpc';
      typeStr.spc = param.value;
      typeStr.color = this.state.clickHeatMapByColor;
      nowSpc = param.value;
    }else if(clickType === 'xAxis'){
      requestUrl = 'FlyBar/getCharByLocation';
      typeStr.location = param.value;
      typeStr.color = this.state.clickHeatMapByColor;
      nowLocation = param.value;
    }else{     //点击value值
      requestUrl = 'FlyBar/getCharBySpcAndLocation';
      typeStr.location = param.name;
      typeStr.spc = param.data.yAxisName;
      typeStr.color = this.state.clickHeatMapByColor;
      nowSpc = param.data.yAxisName;
      nowLocation = param.name;
    }
  //  2、取值
    const currentTime = this.state.clickStackBarByColorTime;
    const { dispatch, global } = this.props;
    const { topSelectItem } = global;
    const { startTime, endTime } = global && global.dateTime;
    dispatch({
      type: requestUrl,
      payload: {
        data: JSON.stringify(Object.assign({},
          {
          startTime,
          endTime,
          mapping: { ...topSelectItem },
          flyBarDay: currentTime,
        },typeStr)),
      },
    });
    this.setState({spc:nowSpc,location:nowLocation,clickBoxPlotOneDay:''});
  }
  //点击图8盒须图
  clickBoxPlot = (param)=>{
    if(this.state.location !== '')
      return;
    console.log('何须图被点击了》》》》',param);
    //如果点击的图三某一天的柱子的话，图8的盒须图会受影响（只有一天的数据），所以此处的flyBarDay只认为是图8被点击的时间
    const currentTime = new Date(param.name).getTime()+8*60*60*1000;
    const color = this.state.clickHeatMapByColor;
    const spc = this.state.spc;
    const { dispatch, global } = this.props;
    const { topSelectItem } = global;
    const { startTime, endTime } = global && global.dateTime;
    dispatch({
      type: 'FlyBar/getBoxOneDay',
      payload: {
        data: JSON.stringify({
          startTime,
          endTime,
          mapping: {...topSelectItem},
          flyBarDay: currentTime,
          color:color,
          spc:spc
        }),
      },
    });
    this.setState({clickBoxPlotOneDay:param.name})
  }
  render() {
    const { FlyBar, loading } = this.props;
    console.log(FlyBar);

    //new data
    const flybarChartByDay = FlyBar && FlyBar.flybarChartByDay  || [];
    const FlybarChartByColor = FlyBar && FlyBar.flybarChartByColor  || [];
    const flybarChartByLocation = FlyBar && FlyBar.flybarChartByLocation  || [];
    const flybarChartByOneDay = FlyBar && FlyBar.flybarChartByOneDay  || [];
    const flybarMapByColorAndLocation = FlyBar && FlyBar.flybarMapByColorAndLocation || [];
    const FlybarMapBySpcAndLocation = FlyBar && FlyBar.FlybarMapBySpcAndLocation || [];
    const FlybarChartBySpc = FlyBar && FlyBar.FlybarChartBySpc || [];
    const FlybarBoxBySpc = FlyBar && FlyBar.FlybarBoxBySpc || [];
    const FlybarLastBox = FlyBar && FlyBar.FlybarLastBox || [];
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
                  title:'',
                  clickBar:this.clickOneDay
                }}
              />
            </Col>
          </Row>
          {
            flybarChartByOneDay.length !==0 && this.state.ChartByOneDay !== ''? (
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
                        title:'',
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
                  clickStackBar:this.clickStackBarLineChart
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
                  data: flybarMapByColorAndLocation || {},
                  triggerEventX:false,            //设置x，y，value是否可点击
                  triggerEventY:true,
                  triggerEventSeries:false,
                  loading,
                  title:flybarMapByColorAndLocation.title,
                  clickHeatMap:this.clickHeatMapByColor,
                }}
              />
            </Col>
            {
              FlybarMapBySpcAndLocation.length !==0 && this.state.clickHeatMapByColor !=='' ? (
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                  <HeatMapChart
                    params={{
                      data: FlybarMapBySpcAndLocation || {},
                      triggerEventX:true,            //设置x，y，value是否可点击
                      triggerEventY:true,
                      triggerEventSeries:true,
                      loading,
                      title:FlybarMapBySpcAndLocation.title,
                      clickHeatMap:this.clickHeatMapBySpcAndLocation,
                    }}
                  />
                </Col>
              ):null
            }

          </Row>
        </div>

        {/*  spc barChart & boxPlot */}
        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Failure Rate Trend And Distribution Comparison</p>
          <Row gutter={48} type="flex">
            {
              FlybarChartBySpc.length !== 0 && (this.state.spc !=='' || this.state.location !== '')? (
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                  <BasicLineChart
                    params={{
                      data: FlybarChartBySpc.lines || [],
                      dataZoomX:false,         //只有值为布尔值 true时才会显示
                      dataZoomY:false,
                      xAxis: 'time',
                      yAxis: 'value',
                      loading,
                      title:FlybarChartBySpc.title,
                      // clickBar:this.clickOneDay
                    }}
                  />
                </Col>
              ):null
            }
            {
              FlybarBoxBySpc.length !==0 && this.state.spc !=='' ?(
                  <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <BoxPlot
                      params={{
                        data: FlybarBoxBySpc.boxList || [],
                        loading,
                        title:FlybarBoxBySpc.title,
                        clickBoxPlot:this.state.location !== '' ? null : this.clickBoxPlot
                      }}
                    />
                  </Col>
              ):null
            }
          </Row>
          {/* last boxPlot */}
          {
            FlybarLastBox.length !== 0 && this.state.clickBoxPlotOneDay !=='' ? (
              <Row gutter={48} type="flex">
                {
                  FlybarLastBox.length !== 0 ? (
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                      <BoxPlot
                        params={{
                          data: FlybarLastBox.boxList || [],
                          loading,
                          title:FlybarLastBox.title
                        }}
                      />
                    </Col>
                  ):null
                }
              </Row>
            ):null
          }
        </div>
      </div>
    );
  }
}

export default AimFlyBar_n;
