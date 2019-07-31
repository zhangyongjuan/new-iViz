import React,{Component} from 'react';
import { Layout, Icon ,Badge} from 'antd';
import styles from './index.css'
import Link from "umi/link";
import {connect} from "react-redux";

const { Header } = Layout;

@connect(({global}) => ({
  global
}))

class HeaderView extends Component{
  state={}
  backHome = ()=>{
    localStorage.setItem('current','0');
    this.props.dispatch({
      type:'global/saveCurrentPageKey',
      payload:{
        currentPage:'0'
      }
    })
  }
  render(){
    return(
        <Header className={styles.header}>
          <div className={styles.title} onClick={this.backHome}>
            <Link to='/'>
              Welcome to iViz system!
            </Link>
          </div>
          <div className={styles.setting} >
            <ul className={styles.settingItem} >
              <li>
                <Badge dot>
                <Icon type="bell" theme="filled"/>
                </Badge>
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
