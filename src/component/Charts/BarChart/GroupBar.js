import React from 'react';

// 导入echarts
import echarts from 'echarts/lib/echarts';
import { prepareBoxplotData } from 'echarts/extension/dataTool';
import _ from 'lodash';

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
  }

  componentDidUpdate() {
    this.initPie();
  }

  initPie = () => {
    // 外部传入的data数据
    const { data } = this.props.params;
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
          barWidth: h.value === 0 ? 0 : 10,
          barCategoryGap: 0,
          z: 1,
          data: n,
          connectNulls: true,
        });
      });
    });
    console.log(newData);
    return newData;
  };

  // 一个基本的echarts图表配置函数
  setPieOption = data => ({
    tooltip: {
      axisPointer: {
        type: 'shadow',
      },
      trigger: 'axis',
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
    const { data } = this.props.params;
    console.log(this.transformData(data));
    return <div ref={this.PieRef} style={{ width: '100%', height: '500px' }}/>;
  }
}
