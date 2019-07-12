import React,{Component} from 'react';
import { Layout, Icon } from 'antd';
import styles from './index.css'

const { Header } = Layout;

class HeaderView extends Component{
  state={
}
  render(){
    return(
        <Header className={styles.header}>
          <div className={styles.title} >Welcome to iViz system!</div>
          <div className={styles.setting} >
            <ul className={styles.settingItem} >
              <li>
                <Icon type="bell" theme="filled"/>
              </li>
              <li>
                <Icon type="setting" theme="filled" />
              </li>
              <li>
                <Icon type="poweroff" />
              </li>
              <li style={{color:'#ff6d02'}}>
                user1
              </li>
            </ul>
          </div>
        </Header>
    )
  }
}
export default HeaderView;
