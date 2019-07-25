import React from 'react';
import styles from './index.css';
import Commetic from '../component/fullInspection/Cosmetic';
import TimeRange from '../layouts/TimeRange';
import {Icon, Tabs} from "antd";

const { TabPane } = Tabs;

export default function() {
  return (
    <div className={styles.normal}>
      <div>
        <TimeRange />
      </div>
      <div>
        <p className={styles.tableName} >Defect Analysis</p>
        <Tabs type="card">
          <TabPane key="1" tab={<span><Icon type="table" />Cosmetic</span>}>
            <Commetic />
          </TabPane>
          <TabPane key="2" tab={<span><Icon type="bar-chart" />Dimensional</span>}>
            <Commetic />
          </TabPane>
        </Tabs>
      </div>

    </div>
  );
}
