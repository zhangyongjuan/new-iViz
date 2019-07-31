import React,{Component} from 'react';
import { Tabs,Icon } from 'antd';
import styles from './index.css';
import TimeRange from '../layouts/TimeRange'
import DrawChart from '../component/aim/DrawChart';
import AimTablePage from '../component/aim/AimTablePage'

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
            <TabPane key="1" tab={<span><Icon type="table" />AIM_Dash Board</span>}>
              <AimTablePage />
            </TabPane>
            <TabPane key="2" tab={<span><Icon type="bar-chart" />AIM Chart</span>}>
              <DrawChart />
            </TabPane>
            <TabPane key="3" tab={<span><Icon type="pie-chart" />SPC Statistical Analysis</span>}>
              {/*<DrawChart />*/}
            </TabPane>
            <TabPane key="4" tab={<span><Icon type="box-plot" />SPC Comparative Analysis</span>}>
              {/*<DrawChart />*/}
            </TabPane>
          </Tabs>
        </div>

      </div>
    )
  }
}

export default AIM;
