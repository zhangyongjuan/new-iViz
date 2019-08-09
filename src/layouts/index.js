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
            {/*<Layout style={{}}>*/}
            {/*  <TimeRange />*/}
              <Content className='mainContent' style={{padding: '0 10px 70px 70px',background: '#fff',overflowY:'scroll',maxHeight: '96vh'}}>
                {this.props.children}
              </Content>
            {/*</Layout>*/}
          </Layout>

        </Layout>
    )
  }
}


export default BasicLayout;
