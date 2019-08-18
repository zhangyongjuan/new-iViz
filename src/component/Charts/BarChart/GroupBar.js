import React from 'react';
import { Spin } from 'antd';

// 导入echarts
import echarts from 'echarts/lib/echarts';
import { prepareBoxplotData } from 'echarts/extension/dataTool';
import _ from 'lodash';
import NoData from '../../NoData';

require('echarts/lib/chart/boxplot');

import('echarts/lib/component/title');
import('echarts/lib/component/tooltip');
import('echarts/lib/component/legend');

export default class GroupBar extends React.Component {
  constructor(props) {
    super(props);
    this.PieRef = React.createRef();
  }

  componentDidMount() {
    this.initPie();
    this.handleClick();
  }

  componentDidUpdate() {
    this.initPie();
  }

  handleClick = () => {
    const { data, clickBar } = this.props.params;
    const myChart = echarts.init(this.PieRef.current);
    myChart.on('click', function(param) {
      clickBar(param);
    });
  };

  initPie = () => {
    // 外部传入的data数据
    const { data, clickBar } = this.props.params;
    // 初始化echarts
    const myChart = echarts.init(this.PieRef.current);

    // 我们要定义一个setPieOption函数将data传入option里面
    const options = this.setPieOption(this.transformData(data));
    // 设置options
    myChart.setOption(options);

    window.addEventListener('resize', () => {
      myChart.resize();
    });

  };

  transformData = (data) => {
    const newData = {
      xAxis: [],
      series: [],
    };
    _.forEach(data, (k, i) => {
      newData.xAxis.push(k.name);
      _.forEach(k.data, (h, j) => {
        const n = [].fill.call(new Array(data.length), null);
        n[i] = h.value;
        newData.series.push({
          name: h.time,
          type: 'bar',
          barGap: 0,
          // barWidth: 10,
          z: 1,
          data: n,
          connectNulls: true,
        });
      });
    });
    console.log(newData);
    return newData;
  };

  // transData = (data) => {
  //   const newData = {
  //     xAxis: [],
  //     series: [],
  //   };
  //
  //   _.forEach(data, (k, i) => {
  //
  //     _.forEach(k.data, (h, j) => {
  //       newData.xAxis.push(h.time);
  //       newData.series.push(h.value);
  //
  //     });
  //   });
  //   return newData
  // };
  //
  // setPieOption = (data)=>({
  //   tooltip:{
  //     axisPointer: {
  //       type: 'shadow'
  //     },
  //     trigger: 'axis'
  //   },
  //   xAxis: {
  //     type: 'category',
  //     data: data.xAxis,
  //     axisTick: {
  //       lineStyle: {color: '#CCC'},
  //       interval: function (index, value) {
  //         return value!=='';
  //       },
  //
  //     },
  //   },
  //     dataZoom: {
  //       type: 'slider',
  //       show: true,
  //       // start: 1,
  //       // end: 35,
  //     },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   series: [{
  //     data: data.series,
  //     type: 'bar',
  //   }]
  // })
  // 一个基本的echarts图表配置函数
  setPieOption = data => ({
    tooltip: {
      axisPointer: {
        type: 'shadow',
      },
      trigger: 'axis',
      tooltip: {
        formatter: function(param) {
          console.log(param);
          return [
            // 'name：' + param.name,
            // 'upper: ' + param.data[5],
            // 'Q3: ' + param.data[4],
            // 'median: ' + param.data[3],
            // 'Q1: ' + param.data[2],
            // 'lower: ' + param.data[1],
          ].join('<br/>');
        },
      },
    },
    // grid: {
    //   bottom: metadata.init().x_major_offset * 12 + 30,
    // },
    dataZoom: {
      type: 'slider',
      show: true,
      start: 1,
      end: 35,
    },
    xAxis: [
      {
        type: 'category',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          rotate: 90,
        },
        splitArea: { show: false },
        data: data.xAxis,
      },

    ],
    yAxis: [
      {
        type: 'value',
        name: '水量',
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: data.series,
  });

  render() {
    const { data = [], loading } = this.props.params;
    // console.log(this.transformData(data));
    // console.log(this.transData(data));
    return (
      <Spin spinning={loading}>
        <div ref={this.PieRef} style={{ width: '100%', height: '500px' }}/>
      </Spin>
    );
  }
}