import { Chart, Tooltip, Axis, Interval, Brush, Slider, Plugin } from 'viser-react';
import * as React from 'react';
import _ from 'lodash';

const DataSet = require('@antv/data-set');
// const data = [{
//   company: 'Apple',
//   type: '整体',
//   value: 30,
// }, {
//   company: 'Facebook',
//   type: '整体',
//   value: 35,
// }, {
//   company: 'Google',
//   type: '整体',
//   value: 28,
// }, {
//   company: 'Apple',
//   type: '非技术岗',
//   value: 40,
// }, {
//   company: 'Facebook',
//   type: '非技术岗',
//   value: 65,
// }, {
//   company: 'Google',
//   type: '非技术岗',
//   value: 47,
// }, {
//   company: 'Apple',
//   type: '技术岗',
//   value: 23,
// }, {
//   company: 'Facebook',
//   type: '技术岗',
//   value: 18,
// }, {
//   company: 'Google',
//   type: '技术岗',
//   value: 20,
// }, {
//   company: 'Apple',
//   type: '技术岗',
//   value: 35,
// }, {
//   company: 'Facebook',
//   type: '技术岗',
//   value: 30,
// }, {
//   company: 'Google',
//   type: '技术岗',
//   value: 25,
// }, {
//   company: 'Goe',
//   type: '技术岗',
//   value: 25,
// }, {
//   company: 'Goog',
//   type: '技术岗',
//   value: 25,
// }];

const scale = [{
  dataKey: 'value',
  // alias: '占比（%）',
  // max: 75,
  min: 0,
  tickCount: 4,
}];

const label = {
  textStyle: {
    fill: '#aaaaaa',
  },
};

const title = {
  offset: 50,
};

const tickLine = {
  alignWithLabel: false,
  length: 0,
};

const adjust = [{
  type: 'dodge',
  marginRatio: 1 / 32,
}];

class GroupedColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      ticks: [],
      colors: [],
      scale: [],
      start: '',
      end: '',
      dataNews: [],
      trans: {
        xAxis: [],
        newData: [],
      },
    };

  }

  componentDidMount() {
    const d = this.transData(this.props.params.data);
    this.setState({
      datas: this.props.params.data,
      scale:[
        {
          dataKey: 'type',
          type: 'cat',
          tickCount: 4,
          nice: false,
        },
        {
          dataKey: 'value',
          min: 0,
          formatter: val => {
            val = (val * 100).toFixed(2) + '%';
            return val;
          },
        },
      ],
    }, () => {
      this.setState({
        trans: d,
        start: d.xAxis[0],
        end: d.xAxis.length > 0 && d.xAxis.length < 3 ? d.xAxis[1] : d.xAxis[3],
      });
    });
  }

  onChange = _ref => {
    const startValue = _ref.startValue,
      endValue = _ref.endValue;
    return this.setState({
      start: startValue,
      end: endValue,
    });
  };

  getData = () => {
    const { start, end, trans } = this.state;
    // const { data } = this.props.params;
    // const das = this.transData(data);
    const datas = trans.newData;
    const { xAxis } = trans;
    const ds = new DataSet({
      state: {
        start: start,
        end: end,
      },
    });
    const dv = ds.createView().source(datas);
    dv.transform({
      type: 'filter',
      callback: function callback(obj) {
        var time = _.indexOf(xAxis, obj.type); // !注意：时间格式，建议转换为时间戳进行比较
        return time >= _.indexOf(xAxis, ds.state.start) && time <= _.indexOf(xAxis, ds.state.end);
      },
    });
    return dv;
  };

  transData = (data) => {
    const obj = { newData: [], xAxis: [] };
    // const newData = [];
    _.forEach(data, (k, i) => {
      obj.xAxis.push(k.name);
      _.forEach(k.data, (h, j) => {
        obj.newData.push({
          type: k.name,
          company: h.time,
          value: h.defect,
        });
      });
    });
    // return _.slice(newData,0,5);
    return obj;
  };

  handleClick = (data, s) => {
    console.log(data);
  };

  render() {
    const { trans } = this.state;
    const { data, clickBar } = this.props.params;
    const datas = trans.newData;
    const datasS = this.getData(data);
    const { ticks, colors, scale, start, end } = this.state;
    return (
      <div>
        <div id="mountNode">
          <Chart forceFit height={400} data={datasS} padding='auto' animate={false} scale={scale} onPlotClick={(e) => clickBar(e)}>
            <Tooltip
              containerTpl={`
              <div class="g2-tooltip">
                <p class="g2-tooltip-title"></p>
                <table class="g2-tooltip-list"></table>
              </div>
            `}
              itemTpl={`
              <tr class="g2-tooltip-list-item">
                <td>{name} ：</td>
                <td>{value}</td>
              </tr>
            `}
            />
            <Axis dataKey="type" label={label} tickLine={tickLine}/>
            <Axis dataKey="value"  label={label} title={title}/>
            <Interval position="type*value" opacity={1} adjust={adjust} color='company' />
            {/*<Brush canvas={null} type="x"/>*/}
          </Chart>
        </div>
        <div id="slider">
          {datas.length !== 0 && (
            <Plugin>
              <Slider
                container='viser-slider-1'
                width="auto"
                height={26}
                start={start} // 和状态量对应
                end={end}
                xAxis="type"
                yAxis="value"
                scales={{
                  time: {
                    type: 'cat',
                    tickCount: 10,
                  },
                }}
                data={datas}
                backgroundChart={{ type: 'line' }}
                onChange={this.onChange}
              />
            </Plugin>
          )}
        </div>


      </div>
    );
  }
}


export default GroupedColumn;
