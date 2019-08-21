import React from 'react';
import { Spin } from 'antd';

// 导入echarts
import echarts from 'echarts/lib/echarts';
import _ from 'lodash';
import NoData from '../../NoData';

require('echarts/lib/chart/line');
import('echarts/lib/component/title');
import('echarts/lib/component/tooltip');
import('echarts/lib/component/legend');

export class SeriesLine extends React.Component {
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
    const { data, timeList = [] } = this.props.params;
    // 初始化echarts
    const myChart = echarts.init(this.PieRef.current);

    // 我们要定义一个setPieOption函数将data传入option里面
    const options = this.setPieOption(this.transSeries(data));
    // 设置options
    myChart.setOption(options);

    window.addEventListener('resize', () => {
      myChart.resize();
    });

  };
  getLegend = (data) => {
    const newData = [];
    _.forEach(data, (k) => {
      newData.push(k.name);
    });
    return newData;
  };


  // 一个基本的echarts图表配置函数
  setPieOption = (data) => ({
    tooltip: {
      trigger: 'axis',
      formatter: function(param, index) {
        return [
          param[0].axisValue,
          'Pass: ' + param[0].value,
          'Fail: ' + param[1].value,
          param[2].value === 0 ? `Failure Rate：0` : `Failure Rate：${(Number(param[2].value) * 100).toFixed(2)}%`,
        ].join('<br/>');
      },
    },
    legend: {
      data: ['Pass', 'Fail', 'Failure Rate'],
    },
    // grid: {
    //   left: '3%',
    //   right: '4%',
    //   bottom: '3%',
    //   containLabel: true,
    // },
    toolbox: {},
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100,
      // zoomLock: true,
    }, {
      type: 'slider',
      show: true,
      xAxisIndex: 0,
      start: 0,
      end: 16,
      // zoomLock: true,
    }],
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
        // boundaryGap: [0.2, 0.2],
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
    // eslint-disable-next-line array-callback-return
    series: [
      {
        name: 'Pass',
        type: 'bar',
        stack: 'defect',
        data: data.good,
        itemStyle: {
          color: '#009966',
        },
      },
      {
        name: 'Fail',
        type: 'bar',
        stack: 'defect',
        data: data.bad,
        itemStyle: {
          color: '#C23531',
        },
      },
      {
        name: 'Failure Rate',
        type: 'line',
        yAxisIndex: 1,
        data: data.defect,
        itemStyle: {
          color: '#C23531',
        },
      },
    ],
  });

  transSeries = (data) => {
    const newData = {
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
    _.forEach(data, (k) => {
      newData.xAxis.push(k.time);
      newData.defect.push(k.defect);
      newData.good.push(k.ok);
      newData.bad.push(k.ng);
      newData.all.push(k.all);
    });
    newData.yInput.min = _.min([_.min(newData.good), _.min(newData.defect)]);
    newData.yInput.max = _.max(newData.all);
    newData.yRate.min = _.min(newData.defect);
    newData.yRate.max = _.max(newData.defect);
    return newData;
  };

  render() {
    const { loading } = this.props.params;
    return (
      <Spin spinning={loading}>
        <div ref={this.PieRef} style={{ width: '100%', height: '500px' }}/>
      </Spin>
    );
  }
}

export default SeriesLine;
