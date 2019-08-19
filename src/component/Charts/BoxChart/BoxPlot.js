import React from 'react';

// 导入echarts
import echarts from 'echarts/lib/echarts';
import { prepareBoxplotData } from 'echarts/extension/dataTool';
import _ from 'lodash';

require('echarts/lib/chart/boxplot');

import('echarts/lib/component/title');
import('echarts/lib/component/tooltip');
import('echarts/lib/component/legend');

var data = prepareBoxplotData([
  [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
  [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
  [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
  [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
  [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870],
]);

export default class BoxPlot extends React.Component {
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
      axisData: [],
      boxData: [],
      outliers: [],
      up_limit: [],
      low_limit: [],
    };
    if (data && data.length !== 0) {
      data.forEach((k, i) => {
        newData.axisData.push(k.name);
        newData.low_limit = k.low_limit;
        newData.up_limit = k.up_limit;
        newData.boxData.push([k.low, k.q1, k.q2, k.q3, k.upper]);
        if (k.errData && k.errData.length !== 0) {
          _.forEach(k.errData, (value) => {
            newData.outliers.push([i, value]);
          });
        }
      });
      return newData;
    }
    return newData;
  };

  // 一个基本的echarts图表配置函数
  setPieOption = data => ({
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
    },
    xAxis: {
      type: 'category',
      data: data.axisData,
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false,
      },
      axisLabel: {
        formatter: '{value}',
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      // name: 'km/s minus 299,000',
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        name: 'boxplot',
        type: 'boxplot',
        data: data.boxData,
        tooltip: {
          formatter: function(param) {
            return [
              'name：' + param.name,
              'upper: ' + param.data[5],
              'Q3: ' + param.data[4],
              'median: ' + param.data[3],
              'Q1: ' + param.data[2],
              'lower: ' + param.data[1],
            ].join('<br/>');
          },
        },
        markLine: {
          data: [
            {
              name: 'low_limit',
              yAxis: data.low_limit,
            },
            {
              name: 'up_limit',
              yAxis: data.up_limit,
            },
          ],
        },
      },
      {
        name: 'outlier',
        type: 'scatter',
        data: data.outliers,
      },
    ],
  });

  render() {
    return <div ref={this.PieRef} style={{ width: '100%', height: '500px' }}/>;
  }
}
