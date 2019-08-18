import React from 'react';
import { Select } from 'antd';
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
  // loading: loading.effects['BowKing/getChartData'],
}))
class AimFlyBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spc: '',
    };
  }


  componentDidMount() {
    this.getFlyBarChart();
  }

  getFlyBarChart = () => {
    const { dispatch, global } = this.props;
    const { topSelectItem } = global;
    const { startTime, endTime } = global && global.dateTime;
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

  render() {
    const { FlyBar } = this.props;
    const { spc } = this.state;
    const singleBarData = FlyBar && FlyBar.barBlockChart && FlyBar.barBlockChart.series && FlyBar.barBlockChart.series.length !== 0 && FlyBar.barBlockChart.series[0].data || [];
    const seriesLineData = this.transLineData(FlyBar && FlyBar.barLineChart && FlyBar.barLineChart.lines || []);
    const { spcs = [], guaBlockChart = [] } = FlyBar;
    const { series = [] } = guaBlockChart;
    console.log(FlyBar);
    return (
      <div className={styles.main}>
        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Flybar Yield Contrast</p>
          <div className={styles.lineChartGroup}>
            <BasicColumn
              params={{
                data: singleBarData,
                xAxis: 'time',
                yAxis: 'value',
              }}
            />
          </div>
        </div>

        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Flybar Yield Trend Contrast</p>
          <div className={styles.lineChartGroup}>
            <SeriesLine
              params={{
                data: seriesLineData,
                xAxis: 'time',
                yAxis: 'value',
                name: 'name',
              }}
            />
          </div>
        </div>

        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Flybar_Hang Yield Contrast</p>
          <div className={styles.lineChartGroup}>
            <div className={styles.goup}>
              <div>
                <Select placeholder="Please select spcs" style={{ width: 180 }}
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
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Flybar_Hang SPC Contrast</p>
          <div className={styles.lineChartGroup}>
            <BoxPlot
              params={{
                data: linshiData,
              }}
            />
          </div>
        </div>

      </div>
    );
  }
}

export default AimFlyBar;
