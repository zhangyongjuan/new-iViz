import React,{Component} from 'react';
import { Tabs,Icon } from 'antd';
import styles from './index.css';
import TimeRange from '../layouts/TimeRange'
import DrawChart from '../component/aim/DrawChart';
import AimTablePage from '../component/aim/AimTablePage';
import Statistical from '../component/aim/StatisticalAnalysis';
import Comparative from '../component/aim/ComparativeAnalysis'

const { TabPane } = Tabs;

class AIM extends Component{
  callback = (e)=>{
    // console.log(e)
  }
  render(){
    return(
      <div className={styles.normal}>
        <TimeRange />
        <div>
          <Tabs onChange={this.callback} type="card">
            <TabPane key="1" tab={<span><Icon type="table" />AIM Dashboard</span>}>
              <AimTablePage />
            </TabPane>
            <TabPane key="2" tab={<span><Icon type="bar-chart" />AIM Chart-commonality analysis module</span>}>
              <DrawChart />
            </TabPane>
            <TabPane key="3" tab={<span><Icon type="line-chart" />SPC Statistical Analysis</span>}>
              <Statistical />
            </TabPane>
            <TabPane key="4" tab={<span><Icon type="box-plot" />Measurement point comparison</span>}>
              <Comparative />
            </TabPane>
          </Tabs>
        </div>

      </div>
    )
  }
}

export default AIM;
