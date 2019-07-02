import React,{Component} from 'react';
import { Tabs,Icon } from 'antd';
import styles from './index.css';
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
        <Tabs onChange={this.callback} type="card">
          <TabPane key="1" tab={<span><Icon type="apple" />Reactive Table</span>}>
            <AimTablePage />
          </TabPane>
          <TabPane key="2" tab={<span><Icon type="apple" />Demo</span>}>
            <DrawChart />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default AIM;
