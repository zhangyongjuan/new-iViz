import React from 'react';
import { Select } from 'antd';

import styles from './index.less';
import BasicColumn from '../../component/Charts/BarChart/BasicColumn';
import GroupedColumn from '../../component/Charts/BarChart/GroupedColumn';
import SeriesLine from '../../component/Charts/LineChart/SeriesLine';
import BoxPlot from '../../component/Charts/BoxChart/BoxPlot';

const { Option } = Select;

const linshiData = [
  {
    "name": "08-01",
    "upper": 2.3,
    "q3": 1.8,
    "q2": 1.5,
    "q1": 1.4,
    "low": 0.5,
    "low_limit": 1.0,
    "up_limit": 2.0,
    "all": 100,
    "err": 2,
    "errData": [
      0.5,
      2.3
    ]
  },
  {
    "name": "08-02",
    "upper": 2.5,
    "q3": 1.8,
    "q2": 1.5,
    "q1": 1.4,
    "low": 0.6,
    "low_limit": 1.0,
    "up_limit": 2.0,
    "all": 100,
    "err": 3,
    "errData": [
      0.6,
      0.65,
      2.5
    ]
  },
  {
    "name": "08-03",
    "upper": 1.9,
    "q3": 1.8,
    "q2": 1.5,
    "q1": 1.4,
    "low": 0.2,
    "low_limit": 1.0,
    "up_limit": 2.0,
    "all": 100,
    "err": 4,
    "errData": [
      0.2,
      0.8,
      2.2,
      2.3
    ]
  }
];

class AimFlyBar extends React.Component {
  handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Flybar Yield Contrast</p>
          <div className={styles.lineChartGroup}>
            <BasicColumn/>
          </div>
        </div>

        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Flybar Yield Trend Contrast</p>
          <div className={styles.lineChartGroup}>
            <SeriesLine/>
          </div>
        </div>

        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Flybar_Hang Yield Contrast</p>
          <div className={styles.lineChartGroup}>
            <div className={styles.goup}>
              <div>
                <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </div>
             <div className={styles.groupedColumn}>
               <GroupedColumn/>
             </div>
            </div>

          </div>
        </div>

        <div className={styles.firstRow}>
          <p className={styles.headerTitle}>Flybar_Hang  SPC Contrast</p>
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
