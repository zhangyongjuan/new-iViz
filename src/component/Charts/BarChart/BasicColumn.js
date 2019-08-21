// import React from 'react';
// import { Spin } from 'antd';
// import {
//   G2,
//   Chart,
//   Geom,
//   Axis,
//   Tooltip,
//   Coord,
//   Label,
//   Legend,
//   View,
//   Guide,
//   Shape,
//   Facet,
//   Util,
// } from 'bizcharts';
// import NoData from '../../NoData';
//
// class BasicColumn extends React.Component {
//   render() {
//     const { data = [], xAxis = '', yAxis = '', loading } = this.props.params;
//     return (
//       <div style={{ width: '100%' }}>
//         <Spin spinning={loading}>
//           {
//             data && data.length !== 0 || loading ? (
//               <Chart height={400} data={data} forceFit>
//                 <Axis name={xAxis}/>
//                 <Axis name={yAxis} label={{
//                   formatter:(text, item, index)=> {
//                     return `${Number(text)*100}%`
//                   }
//                 }}/>
//                 <Tooltip
//                   crosshairs={{
//                     type: 'y',
//                   }}
//                   // itemTpl= '<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{name}: {Number(value)*100}%</li>'
//                 />
//                 <Geom  tooltip={[`${xAxis}*${yAxis}`, (month, tem) => {
//                   console.log(month.tem)
//                   return  {
//                     [month]: tem*100 + "%" , // 在这里格式化。
//                   }
//                 }]} type="interval" position={`${xAxis}*${yAxis}`}/>
//               </Chart>
//             ) : <NoData height={400}/>
//           }
//         </Spin>
//       </div>
//     );
//   }
// }
//
// export default BasicColumn;

import React from 'react';
import { Spin } from 'antd';

// 导入echarts
import echarts from 'echarts/lib/echarts';
import _ from 'lodash';
import NoData from '../../NoData';

require('echarts/lib/chart/bar');
import('echarts/lib/component/title');
import('echarts/lib/component/tooltip');
import('echarts/lib/component/legend');

export class BasicColumn extends React.Component {
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
    const options = this.setPieOption(this.transSeries(data));
    // 设置options
    myChart.setOption(options);

    window.addEventListener('resize', () => {
      myChart.resize();
    });

  };


  // 一个基本的echarts图表配置函数
  setPieOption = (data) => ({
    color: ['#3398DB'],
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
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 16,
      zoomLock: true,
    }, {
      type: 'slider',
      show: true,
      xAxisIndex: 0,
      start: 0,
      end: 16,
      zoomLock: true,
    }],
    // grid: {
    //   left: '3%',
    //   right: '4%',
    //   bottom: '3%',
    //   containLabel: true,
    // },
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
          color: '#006666',
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
          color: '#FF0033',
        },
      },
    ],
    // series: [
    //   {
    //     type: 'bar',
    //     barWidth: '60%',
    //     data: data.seriesData,
    //     label: {
    //       normal: {
    //         show: true,
    //         position: 'top',
    //         color: '#000',
    //         formatter: (x) => `${(Number(x.value) * 100).toFixed(2)}%`,
    //       },
    //     },
    //   },
    // ],
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
        <div ref={ips => this.PieRef = ips} style={{ width: '100%', height: '500px' }}/>
      </Spin>
    );
  }
}

export default BasicColumn;
