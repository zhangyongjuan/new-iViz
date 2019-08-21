// import React from 'react';
// import { Spin } from 'antd';
// import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
// import styles from './index.less';
// import NoData from '../../NoData';
//
// class BasicLineChart extends React.Component {
//   render() {
//     const { params } = this.props;
//     const { data, xAxis, yAxis, loading, title } = params;
//     const cols = {
//       [yAxis]: {
//         // min: 0,
//         formatter: val => {
//           val = val * 100 + "%";
//           return val;
//         }
//       },
//       [xAxis]: {
//         range: [0, 1],
//       },
//     };
//     return (
//       <Spin spinning={loading}>
//         {
//           data && data.length !== 0 || loading ? (
//             <div className={styles.main}>
//               <div className={styles.chartTitle}>{title || ''}</div>
//               <Chart height={400} data={data || []} scale={cols} forceFit>
//                 <Axis name={xAxis}/>
//                 <Axis name={yAxis} />
//                 <Tooltip
//                   crosshairs={{
//                     type: 'y',
//                   }}
//                 />
//                 <Geom type="line" position={`${xAxis}*${yAxis}`} size={2}/>
//                 <Geom
//                   type="point"
//                   position={`${xAxis}*${yAxis}`}
//                   size={4}
//                   shape={'circle'}
//                   style={{
//                     stroke: '#fff',
//                     lineWidth: 1,
//                   }}
//
//                 />
//               </Chart>
//             </div>
//           ) : <NoData height={400}/>
//         }
//       </Spin>
//     );
//   }
// }
//
// export default BasicLineChart;

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

export default class BasicLineChart extends React.Component {
  constructor(props) {
    super(props);
    // this.PieRef = React.createRef();
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
    const myChart = echarts.init(this.PieRef);

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
      defect: [],
      good: [],
      bad: [],
      all: [],
    };
    _.forEach(data, (k) => {
      newData.xAxis.push(k.time);
      newData.defect.push(k.defect);
      newData.good.push(k.ok);
      newData.bad.push(k.ng);
      newData.all.push(k.all);
    });
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
        return [
          param[0].axisValue,
          'Pass: ' + param[0].value,
          'Fail: ' + param[1].value,
          param[2].value === 0 ? `Failure Rate：0` : `Failure Rate：${(Number(param[2].value) * 100).toFixed(2)}%`,
        ].join('<br/>');
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    legend: {
      data: ['Pass', 'Fail', 'Failure Rate'],
    },
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
        min: _.min([_.min(data.good),_.min(data.defect)]),
        max: _.max(data.all),
        interval: (_.max(data.all) - _.min([_.min(data.good),_.min(data.defect)])) / 6,
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
        min: _.min(data.defect),
        max: _.max(data.defect),
        interval: (_.max(data.defect) - _.min(data.defect)) / 6,
        splitNumber: 6,
        axisLabel: {
          formatter(value, index) {
            return value === 0 ? 0 : `${(Number(value) * 100).toFixed(1)}%`;
          },
        },
      },
    ],
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

  render() {
    const { loading, title } = this.props.params;
    return (
      <Spin spinning={loading}>
        <div className={styles.main}>
          <div className={styles.chartTitle}>{title || ''}</div>
          <div ref={(input) => {
            this.PieRef = input;
          }} style={{ width: '100%', height: '500px' }}/>
        </div>

      </Spin>
    );
  }
}
