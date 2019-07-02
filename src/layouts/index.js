import React,{Component} from 'react';
import { Layout} from 'antd';
// import Link from 'umi/link';
import Header from './Header';
import LeftSider from './LeftSider'
import TimeRange from './TimeRange'
import styles from './index.css';

const { Content } = Layout;

const BasicLayout = props => {
  return (
    <div className={styles.normal}>
      <LayoutSider children={props.children} />
      {/*{props.children}*/}
    </div>
  );
};

class LayoutSider extends Component{
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
  render(){
    return(
        <Layout style={{minHeight:'100%'}}>
          <Header />
          <Layout style={{marginTop:'45px'}}>
            <LeftSider />
            <Layout style={{marginLeft:'160px'}}>
              <TimeRange />
              <Content className='mainContent' style={{margin: '0',padding: '0 70px 70px 70px',background: '#fff',minHeight: 280}}>
                {this.props.children}
              </Content>
            </Layout>

          </Layout>

        </Layout>
    )
  }
}


export default BasicLayout;
