import React,{Component} from 'react';
import {Layout, Icon, Menu} from 'antd';
import Link from "umi/link";
import styles from './LeftSider.less'
const { Sider } = Layout;
const { SubMenu } = Menu;

class LeftSider extends Component{
  state = {
    collapsed: false,
    current:'4',
  };
  componentDidMount() {
    if(localStorage.getItem('current')){
      const current = localStorage.getItem('current')
      this.setState({current:current})
    }
  }
  handleClick=(e)=>{
    this.setState({current:e.key});
    localStorage.setItem('current',e.key);
    // e.domEvent.currentTarget.style.background='yellow'
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  render(){
    return(
      <Sider className={styles.leftSlider}  trigger={null} collapsible collapsed={this.state.collapsed}>
        <Icon
          className="trigger"
          type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
          style={{color:'white',fontSize:'16px',position:'relative',margin:'20px'}}
        />
        <Menu  theme="dark" mode="inline" onClick={this.handleClick} selectedKeys={[this.state.current]} defaultSelectedKeys={['4']}>
          <Menu.Item key="1">
            <Icon type="line-chart" />
            <span><Link to='/test'>Full Inspection</Link></span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="sliders" />
            <span><Link to='/'>IPQC</Link></span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="cluster" />
            <span><Link to='/'>ORT</Link></span>
          </Menu.Item>
          <Menu.Item key="4" >
            <Icon type="bar-chart" />
            <span><Link to='/'>AIM</Link></span>
          </Menu.Item>
          {/*<SubMenu*/}
          {/*  key="sub4"*/}
          {/*  title={*/}
          {/*    <span>*/}
          {/*    <Icon type="setting" />*/}
          {/*    <span>AIM</span>*/}
          {/*  </span>*/}
          {/*  }*/}
          {/*>*/}
          {/*  <Menu.Item key="9">*/}
          {/*    <Icon type="bar-chart" />*/}
          {/*    <span><Link to='/'>AIM</Link></span>*/}
          {/*  </Menu.Item>*/}
          {/*  <Menu.Item key="10">*/}
          {/*    <Icon type="bar-chart" />*/}
          {/*    <span><Link to='/'>AIM</Link></span>*/}
          {/*  </Menu.Item>*/}
          {/*</SubMenu>*/}
        </Menu>
      </Sider>
    )
  }
}
export default LeftSider;
