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
    const options = this.setPieOption(this.transFormData(data));
    // 设置options
    myChart.setOption(options);

    window.addEventListener('resize', () => {
      myChart.resize();
    });

  };

  transFormData = (data) => {
    // var dummy = [
    //   ['2015冬', '1月', Math.random() * 10],
    //   ['2015冬', '2月', Math.random() * 20],
    // ];
    const dummy = [];
    if (data && data.length === 0) return;

    _.forEach(data, (k, i) => {
      _.forEach(k.data, (h, j) => {
        dummy.push([k.name, h.time, h.value]);
      });
    });
    const metadata = {
      flag: true,
      quarter: [],
      month: [],
      data1: [],
      data2: [],
      data3: [],
      x_major_offset: dummy[0][1].length,
      init: function() {
        // 首次初始化
        if (metadata.flag) {
          // 数据遍历
          for (var i = 0; i < dummy.length; i++) {
            //debugger;
            if (i === 0) {
              metadata.quarter.push(dummy[i][0]);
            } else {
              // 与子分类列匹配
              metadata.quarter.push(dummy[i - 1][0] === dummy[i][0] ? '' : dummy[i][0]);
            }
            metadata.month.push(dummy[i][1]);
            metadata.data1.push(dummy[i][2]);
            // metadata.data2.push(dummy[i][3]);
            metadata.data3.push('');
            // 计算子分类字符长度（按汉字计算，*12号字体）
            metadata.x_major_offset = 1;
          }
          metadata.flag = false;
        }
        return metadata;
      },
    };
    return metadata;

  };

  // 一个基本的echarts图表配置函数
  setPieOption = metadata => ({
    tooltip: {
      axisPointer: {
        type: 'shadow',
      },
      trigger: 'axis',
    },
    grid: {
      bottom: metadata && metadata.init().x_major_offset * 12 + 30,
    },
    dataZoom: {
      type: 'slider',
      show: true,
      // start: 1,
      // end: 35,
    },
    xAxis: [
      {
        type: 'category',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          rotate: 90,
          show: true,
        },
        splitArea: { show: false },
        data: metadata && metadata.init().month,
      },
      {
        type: 'category',
        position: 'bottom',
        offset:1,
        axisLine: { show: false },
        axisTick: {
          length: metadata && metadata.init().x_major_offset * 12 + 20,
          lineStyle: { color: '#CCC' },
          interval: function(index, value) {
            return value !== '';
          },
        },
        splitArea: {
          show: true,
          interval: function(index, value) {
            return value !== '';
          },
        },
        data: metadata && metadata.init().quarter,
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Yield/%',
        // interval: 50,
        axisLabel: {
          formatter: function(v) {
            return `${v*100}%`
          }
        },
        max:1,
        scale: true,
      },
    ],
    series: [
      {
        name: 'Yield',
        type: 'bar',
        z: 1,
        data: metadata && metadata.init().data1,
        itemStyle: {
          normal: {
            color: function() {
              let color = '';
              let r = Math.floor(Math.random() * 256);
              let g = Math.floor(Math.random() * 256);
              let b = Math.floor(Math.random() * 256);
              color = `rgb(${r},${g},${b})`;
              return color;//所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
            },
          },
        },
      },
    ],
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
