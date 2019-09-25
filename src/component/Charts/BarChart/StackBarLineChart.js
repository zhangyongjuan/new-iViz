import React from 'react';
import { Spin } from 'antd';
// 导入echarts
import echarts from 'echarts/lib/echarts';
// import { prepareBoxplotData } from 'echarts/extension/dataTool';
import _ from 'lodash';
import styles from './index.less';

require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');

import('echarts/lib/component/title');
import('echarts/lib/component/tooltip');
import('echarts/lib/component/legend');

export default class StackBarLineChart extends React.Component {
  constructor(props) {
    super(props);
    // this.PieRef = React.createRef();
  }

  componentDidMount() {
    this.initPie();
    this.handleClick();
  }
  handleClick = () => {
    const { clickStackBar } = this.props.params;
    const myChart = echarts.init(this.PieRef);
    if(clickStackBar){
      myChart.on('click', function(param) {
        clickStackBar(param);
      });
    }
  };
  componentDidUpdate() {
    this.initPie();
  }
  shouldComponentUpdate(nextProps) {
    if(JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return false
    }else {
      return true
    }
  }

  initPie = () => {
    // 外部传入的data数据
    const { data ,dataZoomX, dataZoomY,info} = this.props.params;
    // 初始化echarts
    const myChart = echarts.init(this.PieRef);

    // 我们要定义一个setPieOption函数将data传入option里面
    const options = this.setPieOption(this.transformData(data,dataZoomX, dataZoomY,info));
    // 设置options
    myChart.setOption(options);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  transformData = (data,dataZoomX, dataZoomY,params) => {
    const newData = {
      dataZoomX: dataZoomX,
      dataZoomY:dataZoomY,
      legend:[],
      barData:[],
      lineData:[],
      series:[],
      xAxis: [],
      defect: [],
      good: [],
      bad: [],
      all: [],
      yInput: {
        min: 0,
        max: 1,
      },
      yRate: {
        min: 0,
        max: 1,
      },
    };

    //  2.整理柱状图和线图的数据
    _.forEach(data,(dataset,index)=>{
      //  1.获取legend名称
      newData.legend.push(index);
      newData.legend.push(`${index}_line`);
      const barSeries={
        name:'',
        type:'bar',
        stack:'account',
        yAxisIndex:0,
        data:[],
      };
      const lineSeries={
        name:'',
        type:'line',
        yAxisIndex:1,
        data:[],
      };
      barSeries.name=index;
      lineSeries.name=`${index}_line`;
      _.forEach(dataset,(d)=>{
        barSeries.data.push(d.all);
        lineSeries.data.push(d.yield);

      })
      newData.series.push(barSeries);
      newData.series.push(lineSeries);
    })
  //求左Y轴和右Y轴最大值最小值
    if(!!params){
      newData.yInput.min =0;
      newData.yInput.max = params.maxY;
      newData.yRate.min = 0;
      newData.yRate.max = params.maxYield;
    //  x轴字段
      newData.xAxis = params.timeList
    }
    // console.log('stackedbarlinecahrt newData》》》',newData)
    return newData;
  };

  // 一个基本的echarts图表配置函数
  setPieOption = data => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function(param, index) {
        // console.log(param);
        let str = `<div>${param[0].axisValue}</div>` ;
        _.forEach(param,data=>{
          let value = '';
          value = (data.seriesType === 'line' ? (!!data.value ? (data.value *100).toFixed(2) +'%' :'-') : data.value);
          str += `<div><span style="background:${data.color};width:10px;height:10px;display: inline-block;border-radius: 5px" ></span>
              <span>${data.seriesName}: ${ value }</span></div>`
        })
        return str;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    legend: {
      data: data.legend,
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        zoomLock: false,
        disabled:!data.dataZoomX,
      }, {
        type: 'slider',
        showDataShadow: false,
        show: data.dataZoomX !== true ?  false : data.dataZoomX,
        xAxisIndex: 0,
        start: 0,
        end: 100,
        zoomLock: true,
        bottom:0,
        height:20,
        handleSize:20,
        handleStyle:{
          color:'gray'
        }
      },
      {
        show: data.dataZoomY !== true ?  false : data.dataZoomY,
        type: 'slider',
        realtime: true,
        left: '1%',
        start: 0,
        end: 100,
        // bottom:40,
        yAxisIndex:[0],
        showDataShadow: false,
        width:20,
        handleSize:20,
        handleStyle:{
          color:'gray'
        }
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: data.xAxis,
      },
    ],
    yAxis: [
      {
        name: 'Input',
        type: 'value',
        // scale: true,
        min: data.yInput.min,
        max: data.yInput.max,
        interval: (data.yInput.max - data.yInput.min) / 6,
        splitNumber: 6,
        axisLabel: {
          formatter(spl) {
            return spl.toFixed(0);
          },
        },
      },
      {
        type: 'value',
        scale: true,
        name: 'Failure Rate/%',
        boundaryGap: [0.2, 0.2],
        min: data.yRate.min,
        max: data.yRate.max,
        interval: (data.yRate.max - data.yRate.min) / 6,
        splitNumber: 6,
        axisLabel: {
          formatter(value, index) {
            return value === 0 ? 0 : `${(Number(value) * 100).toFixed(1)}%`;
          },
        },
      },
    ],
    // series: [
    //   {
    //     name: 'Pass',
    //     type: 'bar',
    //     stack: 'defect',
    //     data: data.good,
    //     itemStyle: {
    //       color: '#009966',
    //     },
    //   },
    //   {
    //     name: 'Fail',
    //     type: 'bar',
    //     stack: 'defect',
    //     data: data.bad,
    //     itemStyle: {
    //       color: '#C23531',
    //     },
    //   },
    //   {
    //     name: 'Failure Rate',
    //     type: 'line',
    //     yAxisIndex: 1,
    //     data: data.defect,
    //     itemStyle: {
    //       color: '#C23531',
    //     },
    //   },
    // ],
    series:data.series
  });

  render() {
    const { loading, info } = this.props.params;
    return (
      <Spin spinning={loading}>
        <div className={styles.main}>
          <div className={styles.chartTitle}>{info.title || ''}</div>
          <div ref={(input) => {
            this.PieRef = input;
          }} style={{ width: '100%', height: '500px' }}/>
        </div>

      </Spin>
    );
  }
}
