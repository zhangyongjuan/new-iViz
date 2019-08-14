import React from 'react';
import { Row, Col } from 'antd';

import styles from './index.less';
import BasicLineChart from '../../component/Charts/LineChart';
import BasicBarChart from '../../component/Charts/BarChart';
import BasicBox from '../../component/Charts/BoxChart';
import BasicTable from '../../component/Table';

class BowingKinking extends React.Component {
  render() {
    return (
      <div className={styles.main}>
        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Yield Trend</p>
          <div className={styles.lineChartGroup}>
            <Row gutter={48} type="flex">
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <BasicLineChart/>
                <BasicBarChart />
                <BasicTable />
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <BasicLineChart/>
                <BasicBarChart />
                <BasicTable />
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles.boxChart}>
          <p className={styles.headerTitle}>Test Point Analysis</p>
          <Row gutter={48} type="flex">
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <BasicBox />
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <BasicBox />
            </Col>
          </Row>

        </div>
      </div>
    );
  }
}

export default BowingKinking;
