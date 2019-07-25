import React,{Component} from 'react';
import { Tabs,Icon } from 'antd';
import styles from './index.css';
import TimeRange from '../layouts/TimeRange'
import DrawChart from '../component/DrawChart';
import AimTablePage from '../component/AimTablePage'

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
          </Tabs>
        </div>

      </div>
    )
  }
}

export default AIM;
