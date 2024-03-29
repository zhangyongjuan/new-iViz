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
    this.handleClick();
  }
  handleClick = () => {
    const { clickBar } = this.props.params;
    const myChart = echarts.init(this.PieRef);
    if(clickBar){
      myChart.on('click', function(param) {
        clickBar(param);
      });
    }
  };

  componentDidUpdate() {
    this.initPie();
  }
  shouldComponentUpdate(nextProps) {
    if(JSON.stringify(nextProps) == JSON.stringify(this.props)) {
      return false
    }else {
      return true
    }
  }

  initPie = () => {
    // 外部传入的data数据
    const { data ,dataZoomX, dataZoomY} = this.props.params;
    // 初始化echarts
    const myChart = echarts.init(this.PieRef);

    // 我们要定义一个setPieOption函数将data传入option里面
    const options = this.setPieOption(this.transformData(data,dataZoomX, dataZoomY));
    // 设置options
    myChart.setOption(options);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  transformData = (data,dataZoomX, dataZoomY) => {
    const newData = {
      dataZoomX: dataZoomX,
      dataZoomY:dataZoomY,
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
      bottom: '5%',
      containLabel: true,
    },
    legend: {
      data: ['Pass', 'Fail', 'Failure Rate'],
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
