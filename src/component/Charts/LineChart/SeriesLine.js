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
    const options = this.setPieOption(timeList, data);
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
  setPieOption = (timeList, data) => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        console.log(params);
        let content = '';
        _.forEach(params, (k) => {
          if (k.value !== 0 && !k.value) return;
          content = content + `<div><span style="display:inline-block;border-radius:10px;width:10px;height:10px;background-color:${k.color};"></span><span style="margin-left: 5px;display: inline-block">${k.seriesName}：${k.value*100}%</span></div>`;
        });
        return `<div>Flybar：${params && params.length !== 0 ? params[0].axisValue : ''}</div>` + content;
      },
    },
    legend: {
      data: this.getLegend(data),
      type: 'scroll',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeList,
    },
    yAxis: {
      name:'Yield/%',
      type: 'value',
      scale: true,
      axisLabel: {
        formatter: function(v) {
          return `${v * 100}%`;
        },
      },
      max: 1,
    },
// {
//   name: '邮件营销',
//   type: 'line',
//   data: [120, 132, 101, 134, 90, 230, 210],
// },
    // eslint-disable-next-line array-callback-return
    series: this.transSeries(data, timeList),
  });

  transSeries = (data, timeList) => {
    const newSeries = [];
    const itemData = {};
    _.forEach(timeList, (k, i) => {
      _.forEach(data, (h, j) => {
        itemData[h.name] = [];
      });
    });

    _.forEach(timeList, (k, i) => {
      _.forEach(data, (h, j) => {
        if (_.find(h.data, ko => ko.time === k)) {
          const value = (_.find(h.data, (o) => o.time === k)).value;
          if(value!==0){
            itemData[h.name].push(value);
          }
        } else {
          itemData[h.name].push('');
        }
      });
    });

    _.forEach(data, (k) => {
      newSeries.push({
        name: k.name,
        type: 'line',
        data: itemData[k.name],
        connectNulls: true,
      });
    });
    return newSeries;
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
