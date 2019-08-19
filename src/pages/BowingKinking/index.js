import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';

import styles from './index.less';
import BasicLineChart from '../../component/Charts/LineChart';
import BasicBarChart from '../../component/Charts/BarChart';
// import BasicBox from '../../component/Charts/BoxChart';
import BoxPlot from '../../component/Charts/BoxChart/BoxPlot';
import BasicTable from '../../component/Table';

@connect(({ global, BowKing,loading }) => ({
  global,
  BowKing,
  loading:loading.effects['BowKing/getChartData']
}))
class BowingKinking extends React.Component {

  componentWillReceiveProps(nextProps, nextContext) {
    const { dateTime, topSelectItem } = this.props.global;
    if (!(_.isEqual(dateTime, nextProps.global.dateTime) && _.isEqual(topSelectItem, nextProps.global.topSelectItem))) {
      this.getChartData(nextProps.global.dateTime, nextProps.global.topSelectItem);
    }
  }

  componentDidMount() {
    const { global } = this.props;
    const { topSelectItem, dateTime } = global;
    this.getChartData(dateTime,topSelectItem);
  }

  getChartData = (dateTime,topSelectItem) => {
    const { dispatch } = this.props;
    const { startTime, endTime } = dateTime;
    dispatch({
      type: 'BowKing/getChartData',
      payload: {
        data: JSON.stringify({
          startTime,
          endTime,
          mapping: { ...topSelectItem },
        }),
      },
    });
  };

  getIMBoxData = ({ data }) => {
    console.log(data);
    const { dispatch, global } = this.props;
    const { topSelectItem } = global;
    const { startTime, endTime } = global && global.dateTime;
    const { _origin = '' } = data || [];
    if (_origin) {
      dispatch({
        type: 'BowKing/getIMBox',
        payload: {
          data: JSON.stringify({
            startTime,
            endTime,
            mapping: { ...topSelectItem },
            spc: _origin.spc,
          }),
        },
      });
    }
  };

  getSBBoxData = ({ data }) => {
    const { dispatch, global } = this.props;
    const { topSelectItem } = global;
    const { startTime, endTime } = global && global.dateTime;
    const { _origin = '' } = data || [];
    if (_origin) {
      dispatch({
        type: 'BowKing/getSBBox',
        payload: {
          data: JSON.stringify({
            startTime,
            endTime,
            mapping: { ...topSelectItem },
            spc: _origin.spc,
          }),
        },
      });
    }
  };

  render() {
    const { BowKing, global,loading } = this.props;
    const lines = BowKing && BowKing.bowing && BowKing.bowing.lineChart && BowKing.bowing.lineChart.lines && BowKing.bowing.lineChart.lines.length !== 0 && BowKing.bowing.lineChart.lines[0].data || null;
    const linesSB = BowKing && BowKing.kinking && BowKing.kinking.lineChart && BowKing.kinking.lineChart.lines && BowKing.kinking.lineChart.lines.length !== 0 && BowKing.kinking.lineChart.lines[0].data || null;
    const { spcValues = [], spcYields = [] } = BowKing && BowKing.bowing || [];
    const { spcValues: spcValuesSB = [], spcYields: spcYieldsSB = [] } = BowKing && BowKing.kinking || [];
    const { IMBox = '', SBBox = '' } = BowKing;

    console.log('***********');
    console.log(global);
    console.log('***********');
    return (
      <div className={styles.main}>
        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Yield Trend</p>
          <div className={styles.lineChartGroup}>
            <Row gutter={48} type="flex">
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <BasicLineChart
                  params={{
                    data: lines || [],
                    xAxis: 'time',
                    yAxis: 'value',
                    loading,
                    title:'yield trend break down by IM date code'
                  }}
                />
                <BasicBarChart
                  params={{
                    data: spcValues || [],
                    xAxis: 'spc',
                    yAxis: 'yield',
                    clickBar: this.getIMBoxData,
                    loading
                  }}
                />

                <BasicTable
                  data={spcYields}
                  rowKey='name'
                  loading={loading}
                />
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <BasicLineChart
                  params={{
                    data: linesSB || [],
                    xAxis: 'time',
                    yAxis: 'value',
                    loading,
                    title:'yield trend break down by Sandblasting date code'
                  }}
                />

                <BasicBarChart
                  params={{
                    data: spcValuesSB || [],
                    xAxis: 'spc',
                    yAxis: 'yield',
                    clickBar: this.getSBBoxData,
                    loading
                  }}
                />

                <BasicTable
                  data={spcYieldsSB}
                  rowKey='name'
                  loading={loading}
                />

              </Col>
            </Row>
          </div>
        </div>
        <div className={styles.boxChart}>
          <p className={styles.headerTitle}>Test Point Analysis</p>
          <Row gutter={48} type="flex">
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              {
                IMBox ? (
                  <BoxPlot
                    params={{
                      data: IMBox.boxList || [],
                    }}
                  />
                ) : null
              }
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              {
                SBBox?(
                  <BoxPlot
                    params={{
                      data: SBBox.boxList || [],
                    }}
                  />
                ):null
              }
              {/*{*/}
              {/*  SBBox ? (*/}
              {/*    <BasicBox*/}
              {/*      params={{*/}
              {/*        data: SBBox.boxList || [],*/}
              {/*        high: 'upper',*/}
              {/*        low: 'low',*/}
              {/*        q1: 'q1',*/}
              {/*        median: 'q2',*/}
              {/*        q3: 'q3',*/}
              {/*        x: 'name',*/}
              {/*        outliers: 'errData',*/}
              {/*      }}*/}
              {/*    />*/}
              {/*  ) : null*/}
              {/*}*/}
            </Col>
          </Row>

        </div>
      </div>
    );
  }
}

export default BowingKinking;
