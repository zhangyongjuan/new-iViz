import React from 'react';
import { Select, message } from 'antd';
import _ from 'lodash';

import styles from './index.less';
import BasicColumn from '../../component/Charts/BarChart/BasicColumn';
import GroupedColumn from '../../component/Charts/BarChart/GroupedColumn';
import GroupBar from '../../component/Charts/BarChart/GroupBar';
import SeriesLine from '../../component/Charts/LineChart/SeriesLine';
import BoxPlot from '../../component/Charts/BoxChart/BoxPlot';
import { connect } from 'dva';

const { Option } = Select;

const linshiData = [
  {
    'name': '08-01',
    'upper': 2.3,
    'q3': 1.8,
    'q2': 1.5,
    'q1': 1.4,
    'low': 0.5,
    'low_limit': 1.0,
    'up_limit': 2.0,
    'all': 100,
    'err': 2,
    'errData': [
      0.5,
      2.3,
    ],
  },
  {
    'name': '08-02',
    'upper': 2.5,
    'q3': 1.8,
    'q2': 1.5,
    'q1': 1.4,
    'low': 0.6,
    'low_limit': 1.0,
    'up_limit': 2.0,
    'all': 100,
    'err': 3,
    'errData': [
      0.6,
      0.65,
      2.5,
    ],
  },
  {
    'name': '08-03',
    'upper': 1.9,
    'q3': 1.8,
    'q2': 1.5,
    'q1': 1.4,
    'low': 0.2,
    'low_limit': 1.0,
    'up_limit': 2.0,
    'all': 100,
    'err': 4,
    'errData': [
      0.2,
      0.8,
      2.2,
      2.3,
    ],
  },
];

@connect(({ global, FlyBar, loading }) => ({
  global,
  FlyBar,
  loading: loading.effects['FlyBar/getChartData'],
}))
class AimFlyBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spc: '',
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { dateTime, topSelectItem } = this.props.global;
    if (!(_.isEqual(dateTime, nextProps.global.dateTime) && _.isEqual(topSelectItem, nextProps.global.topSelectItem))) {
      this.getFlyBarChart(nextProps.global.dateTime, nextProps.global.topSelectItem);
    }
  }


  componentDidMount() {
    const { global } = this.props;
    const { topSelectItem, dateTime } = global;
    this.getFlyBarChart(dateTime, topSelectItem);
  }

  getFlyBarChart = (dateTime, topSelectItem) => {
    const { dispatch } = this.props;
    const { startTime, endTime } = dateTime;
    dispatch({
      type: 'FlyBar/getChartData',
      payload: {
        data: JSON.stringify({
          startTime,
          endTime,
          mapping: { ...topSelectItem },
        }),
      },
    });
  };

  handleChangeSpc = (value) => {
    this.setState({
      spc: value,
    });
  };

  transLineData = (data) => {
    const newData = [];
    const a = [1, 2, 4];
    _.forEach(data, (k) => {
      _.forEach(k.data, (h) => {
        newData.push({ name: k.name, ...h });
      });
    });
    return newData;
  };

  handleClickBar = (param) => {
    console.log(param);
    const { dispatch, global } = this.props;
    const { topSelectItem } = global;
    const { startTime, endTime } = global && global.dateTime;
    const { spc } = this.state;
    // seriesName
    // name
    if (param.componentType === 'series' && param.componentSubType === 'bar') {
      if (spc) {
        dispatch({
          type: 'FlyBar/getHangData',
          payload: {
            data: JSON.stringify({
              startTime,
              endTime,
              mapping: { ...topSelectItem },
              flyBar: param.name,
              hang: param.seriesName,
              spc,
            }),
          },
        });
      }
    } else {
      message.warning('Please select Spc');
    }
  };

  render() {
    const { FlyBar, loading } = this.props;
    const { spc } = this.state;
    const singleBarData = FlyBar && FlyBar.barBlockChart && FlyBar.barBlockChart.series && FlyBar.barBlockChart.series.length !== 0 && FlyBar.barBlockChart.series[0].data || [];
    const seriesLineData = (FlyBar && FlyBar.barLineChart && FlyBar.barLineChart.lines || []);
    const { spcs = [], guaBlockChart = [], Hang = [], barLineChart = [] } = FlyBar;
    const { boxList = '' } = Hang;
    const { timeList = [] } = barLineChart;
    const { series = [] } = guaBlockChart;
    console.log(FlyBar);
    return (
      <div className={styles.main}>
        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Yield Comparison By Flight Bar</p>
          <div className={styles.lineChartGroup}>
            <BasicColumn
              params={{
                data: singleBarData,
                loading,
              }}
            />
          </div>
        </div>

        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Flight Bar Yield Trend Comparison</p>
          <div className={styles.lineChartGroup}>
            <SeriesLine
              params={{
                timeList,
                loading,
                data: seriesLineData,
              }}

            />
          </div>
        </div>

        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Yield Comparision By Rack</p>
          <div className={styles.lineChartGroup}>
            <div className={styles.goup}>
              <div>
                <Select placeholder="Please select spcs" value={spc} style={{ width: 180 }}
                        onChange={this.handleChangeSpc}>
                  {
                    spcs.map((k, i) => <Option key={`swdsf${i.toLocaleString()}`} value={k}>{k}</Option>)
                  }
                </Select>
              </div>
              <div className={styles.groupedColumn}>
                {/*<GroupedColumn/>*/}
                <GroupBar
                  params={{
                    data: series,
                    clickBar: this.handleClickBar,
                    loading,
                  }}

                />
              </div>
            </div>

          </div>
        </div>

        <div className={styles.firstRow}>
          <p className={styles.headerTitle}> SPC Distribution Comparision By Rack</p>
          <div className={styles.lineChartGroup}>
            {
              spc && boxList ? (
                <BoxPlot
                  params={{
                    data: boxList || [],
                  }}
                />
              ) : null
            }
          </div>
        </div>

      </div>
    );
  }
}

export default AimFlyBar;
