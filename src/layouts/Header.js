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
                <Icon type="setting" />
              </li>
              <li>
                <Icon type="setting" />
              </li>
              <li>
                <Icon type="setting" />
              </li>
              <li>
                <Icon type="setting" />
              </li>
            </ul>
          </div>
        </Header>
    )
  }
}
export default HeaderView;
