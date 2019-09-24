import React,{Component} from 'react';
import { Tabs,Icon } from 'antd';
import styles from './index.css';
import TimeRange from '../layouts/TimeRange'
import DrawChart from '../component/aim/DrawChart';
import AimTablePage from '../component/aim/AimTablePage';
import Statistical from '../component/aim/StatisticalAnalysis';
import Comparative from '../component/aim/ComparativeAnalysis'
import BowingKinking from './BowingKinking';
import AimFlyBar from './AimFlyBar';
import AimFlyBar_n from './AimFlyBar/aimFlyBar_n';

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
            <TabPane key="2" tab={<span><Icon type="bar-chart" />AIM Chart-commonality Analysis Module</span>}>
              <DrawChart />
            </TabPane>
            <TabPane key="3" tab={<span><Icon type="line-chart" />SPC Statistical Analysis</span>}>
              <Statistical />
            </TabPane>
            <TabPane key="4" tab={<span><Icon type="box-plot" />Measurement Point Comparison</span>}>
              <Comparative />
            </TabPane>
            <TabPane key="5" tab={<span><Icon type="area-chart" />Bowing/Kinking_Module</span>}>
              <BowingKinking />
            </TabPane>
            {/*<TabPane key="6" tab={<span><Icon type="stock" />Color_Flight_Bar_Module</span>}>*/}
            {/*  <AimFlyBar />*/}
            {/*</TabPane>*/}
            <TabPane key="7" tab={<span><Icon type="stock" />Color_Flight_Bar_Module_new</span>}>
              <AimFlyBar_n />
            </TabPane>
          </Tabs>
        </div>

      </div>
    )
  }
}

export default AIM;
