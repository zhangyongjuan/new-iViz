import React,{ Component } from 'react'
import { Menu, Dropdown, Icon ,Checkbox } from 'antd/lib/index';
import reqwest from 'reqwest'
import styles from './index.css';
import '../global'
const CheckboxGroup = Checkbox.Group;


class NewHeader extends Component {
  state = this.initialState();
  initialState(){
    let State = {
      plainOptions4:[],
      checkedList4: [],
      plainOptions5:[],
      checkedList5: [],
      plainOptions6:[],
      checkedList6: [],
      visible4: false,
      visible5: false,
      visible6: false,
      indeterminate4: false,
      indeterminate5: false,
      indeterminate6: false,
      checkAll4: true,
      checkAll5: true,
      checkAll6: true,
      condition1:{},
      condition2:{},
      condition3:{},
      condition4:{},
      condition5:{},
      condition6:{},
      allConditions:{},
      condition4D:[],
      condition5D:[],
      condition6D:[],
      title5:'',
      title6:'',
      spcId:'',
      title1:'condition1',
      title2:'condition2',
      title3:'condition3',
      title3_4:'condition3_4',
      title4:'condition4',
      category:'',

      select1:[],
      select2:[],
      select3:[],
      select3_4:[],
      select4:[],
      select5:[],
      select6:[],
      timeRange:{}
    };
    return State
  }
  componentDidMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(nextProps.time) !== JSON.stringify(this.state.timeRange)){
      this.setState(this.initialState());
      this.setState({timeRange:nextProps.time},this.fetch);
    }
  }
  fetch = ()=>{

    // console.log('initialState===',this.state)

    let timeRange = {};
    if(JSON.stringify(this.state.timeRange) === '{}'){
      timeRange.startTime=new Date('2019-5-14 00:00:00').getTime();       //默认时间是当前时间前6小时
      timeRange.endTime=new Date('2019-5-15 23:59:59').getTime();
    }else{
      timeRange = this.state.timeRange;
    }
    let timeN = {};
    timeN.data = JSON.stringify(timeRange)
    reqwest({
      url:`http://${global.constants.ip}:${global.constants.port}/condition/get`,
      method:'get',
      type:'json',
      data:timeN
    })
      .then((data)=>{
        console.log('初始拿到的所有选择项：',data);
        this.setState({condition1:data.condition1,condition2:data.condition2,condition3:data.condition3,
          condition4:data.condition4,condition5:data.condition5,condition6:data.condition6,allConditions:data},this.test)
      })
  }
  turnData(alloption){
    this.props.fun(alloption)
  }
  test(){
    let alloption = {};
    alloption.condition1 = this.state.select1;
    alloption.condition2 = this.state.select2;
    alloption.condition3 = this.state.select3;
    alloption.condition3_4 = this.state.select3_4;
    alloption.condition4 = this.state.select4;
    alloption.condition5 = this.state.select5;
    alloption.condition6 = this.state.select6;
    console.log('将要传回去画图的值---',alloption);
    this.turnData(alloption)
  }
  handleMenuClick1 = e=>{
    console.log('条件1被点击项-------',e);
    const d1 = [];
    const key = e.key;
    d1.push(key);
    this.setState({select1:d1,title1:key},this.test)
  }
  handleMenuClick2 = e => {
    console.log('条件2被点击项-------',e);
    let bigContainer = {};
    bigContainer.data = {};
    let data = {};
    data.aims = [];
    data.aims.push(e.key);
    bigContainer.data = JSON.stringify(data);
    this.setState({select2:data.aims,title2:e.key,title3:'condition3'},this.test)
    reqwest({
      url:`http://${global.constants.ip}:${global.constants.port}/condition/getCondition3`,
      method:'get',
      type:'json',
      data:bigContainer
    })
      .then((data)=>{
        console.log('newCondition3========',data);
        this.setState({condition3:data,category:data.process})
      })
  };
  handleMenuClick3 = e=>{
    console.log('条件3被点击项-------',e);
    let d3 = [];
    const clickId = e.key;
    d3.push(clickId)
    this.setState({select3:d3,spcId:clickId,title3:clickId},this.test)
    console.log(this.state.select3)
  }
  handleMenuClick3_4 = e=>{
    console.log(e);
    console.log('select2======',this.state.select2);
    console.log('select3======',this.state.select3);
    const d3_4 = {},container = {},s3_4 = [];
    s3_4.push(e.key)
    d3_4.child = e.key;
    d3_4.aims = this.state.select2;
    d3_4.spcs = this.state.select3;
    container.data = JSON.stringify(d3_4)
    this.setState({title3_4:e.key,select3_4:s3_4,title4:'condition4',})
    reqwest({
      url:`http://${global.constants.ip}:${global.constants.port}/condition/getCondition4`,
      method:'get',
      type:'json',
      data:container
    })
      .then(data=>{
        console.log('c4-----',data)
        if(data.mcIps.length !== 0){
          this.setState({condition4D:data.mcIps,select4:data.mcIps,title5:''})
        }else if(data.lines.length !== 0){
          this.setState({condition4D:data.lines,select4:data.lines,title5:''})
        }else{
          this.setState({checkedList4:[],plainOptions4:[]})
        }
        this.setState({condition4:data});
        this.setState({checkedList5:[],checkedList6:[],plainOptions5:[],plainOptions6:[],select5:[],select6:[]},this.test)
        if(this.state.condition4D.length !==0){
          let arr = [];
          arr = this.state.condition4D;
          this.setState({checkedList4:arr,plainOptions4:arr})
          if(this.state.title3_4 === 'Line'){
            this.managelist4();
          }
        }
      })
  }
  handleMenuClick4 = e => {
    console.log('被点击项-------',e);
    const d4 = {},container = {},machine4 = [];
    d4.child = [];d4.con4 = [];d4.con5 = [];
    d4.child.push(this.state.title3_4);
    d4.aims = this.state.select2;
    d4.spcs = this.state.select3;
    d4.con4.push(e.key);
    container.data = JSON.stringify(d4)
    machine4.push(e.key)
    this.setState({select4:machine4,title4:e.key})

    reqwest({
      url:`http://${global.constants.ip}:${global.constants.port}/condition/getCondition5`,
      method:'get',
      type:'json',
      data:container
    })
      .then((data)=>{
        console.log('newCondition5========',data);
        this.setState({condition5:data})
        data.machines && data.machines.length !== 0 ? this.setState({condition5D:data.machines}):
          this.setState({condition5D:data.spms})
        console.log('5D====',this.state.condition5D);
        let arr = data.machines;
        this.setState({plainOptions5:arr,checkedList5:arr,select5:this.state.condition5D});
        d4.con5=this.state.condition5.machines;
        console.log(d4)
        container.data = JSON.stringify(d4);
        this.getcondition6(container)
      })
  };
  handleVisibleChange4 = flag => {
    this.setState({ visible4: flag });
  };
  handleVisibleChange5 = flag => {
    this.setState({ visible5: flag });
  };
  handleVisibleChange6 = flag => {
    this.setState({ visible6: flag });
  };
  onCheckAllChange5 = e => {
    this.setState({
      checkedList5: e.target.checked ? this.state.plainOptions5 : [],
      checkedList6: e.target.checked ? this.state.checkedList6 : [],
      plainOptions6: e.target.checked ? this.state.plainOptions6 : [],
      condition6D:e.target.checked ? this.state.condition6D : [],
      indeterminate5: false,
      checkAll5: e.target.checked,
    },this.managelist5);
  };
  onChange = checkedList5 => {
    this.setState({
      checkedList5,
      indeterminate5: !!checkedList5.length && checkedList5.length < this.state.plainOptions5.length,
      checkAll5: checkedList5.length === this.state.plainOptions5.length,
    },this.managelist5);
  };
  managelist5(){
    const newList = [];
    const container = {};
    container.data = {};
    this.state.checkedList5.map((v,j)=>{
      this.state.condition5D.map((val,i)=>{
        if(v === val){
          return newList.push(val)
        }
      })
    })
    if(newList.length !==0){
      let d5 = {};
      d5.child = [];d5.con4 = [];d5.con5 = [];
      d5.child.push(this.state.title3_4);
      d5.aims = this.state.select2;
      d5.spcs = this.state.select3;
      d5.con4=this.state.select4;
      d5.con5 = newList;
      container.data = JSON.stringify(d5)
      console.log('这是改变后的条件5选项',newList)
      this.setState({select5:newList},this.test)
      this.getcondition6(container)
    }else{
      this.setState({select5:[],select6:[]},this.test)
    }
  }
  onChange4 = checkedList4 => {
    this.setState({
      checkedList4,
      indeterminate4: !!checkedList4.length && checkedList4.length < this.state.plainOptions4.length,
      checkAll4: checkedList4.length === this.state.plainOptions4.length,
    },this.managelist4);
  };
  onCheckAllChange4 = e => {
    this.setState({
      checkedList4: e.target.checked ? this.state.plainOptions4 : [],
      checkedList5: e.target.checked ? this.state.plainOptions5 : [],
      checkedList6: e.target.checked ? this.state.checkedList6 : [],
      plainOptions6: e.target.checked ? this.state.plainOptions6 : [],
      condition5D:e.target.checked ? this.state.condition5D : [],
      condition6D:e.target.checked ? this.state.condition6D : [],
      indeterminate4: false,
      checkAll4: e.target.checked,
    },this.managelist4);
  };
  managelist4(){
    const newList = [];
    const container = {};
    container.data = {};
    this.state.checkedList4.map((v,j)=>{
      this.state.condition4D.map((val,i)=>{
        if(v === val){
          return newList.push(val)
        }
      })
    })
    console.log('select4======',newList)
    this.setState({select4:newList,select5:[],select6:[]},this.test);
    if(newList.length !== 0 && this.state.title3_4 === "Line"){
      const d3_4 = {};
      d3_4.child = []
      d3_4.child.push(this.state.title3_4);
      d3_4.aims = this.state.select2;
      d3_4.spcs = this.state.select3;
      d3_4.con4 = newList;
      container.data = JSON.stringify(d3_4);

      reqwest({
        url:`http://${global.constants.ip}:${global.constants.port}/condition/getCondition5`,
        method:'get',
        type:'json',
        data:container
      })
        .then(data=>{
          console.log('条件4选择line，这是条件5的数据',data)
          this.setState({condition5:data,condition5D:data.spms})
          console.log('5D====',this.state.condition5D);
          let arr = [];
          if(data.spms.length !== 0){
            this.state.condition5D.map((v,i)=>{
              return arr.push(v);
            })
          }
          this.setState({plainOptions5:arr,checkedList5:[],select5:[],checkAll5:false});
        })
    }
  }
  getcondition6(container){
    reqwest({
      url:`http://${global.constants.ip}:${global.constants.port}/condition/getCondition6`,
      method:'get',
      type:'json',
      data:container
    })
      .then(data=>{
        console.log('newCondition6========',data);
        this.setState({condition6:data})
        this.state.condition6.machines && this.state.condition6.machines.length !== 0 ? this.setState({condition6D:this.state.condition6.machines}) :
          this.setState({condition6D:this.state.condition6.spms})
        console.log('6D====',this.state.condition6D);
        let arr = this.state.condition6D;
        if(data.title === 'Mc'){
          this.setState({title6:data.title});
        }
        this.setState({plainOptions6:arr,checkedList6:arr,select6:this.state.condition6D},this.test)
      })
  }
  onCheckAllChange6 = e => {
    this.setState({
      checkedList6: e.target.checked ? this.state.plainOptions6 : [],
      indeterminate6: false,
      checkAll6: e.target.checked,
    },this.managelist6);
  };
  onChange6 = checkedList6 => {
    this.setState({
      checkedList6,
      indeterminate6: !!checkedList6.length && checkedList6.length < this.state.plainOptions6.length,
      checkAll6: checkedList6.length === this.state.plainOptions6.length,
    },this.managelist6);
  };
  managelist6(){
    const newList = [];
    const container = {};
    container.data = {};
    this.state.checkedList6.map((v,j)=>{
      this.state.condition6D.map((val,i)=>{
        if(v === val){
          newList.push(val)
        }
      })
    })
    console.log(newList)
    this.setState({select6:newList},this.test)
  }
  render() {
    const menu1 = (
      <Menu onClick={this.handleMenuClick1} selectable >
        {
          this.state.condition1.modes ?(
            this.state.condition1.modes.map((v,i)=>
              <Menu.Item key={v.name} num={v.name}>{v.name}</Menu.Item>
            )
          ):''
        }
      </Menu>
    );
    const menu2 = (
      <Menu onClick={this.handleMenuClick2} selectable >
        {
          this.state.condition2.aims ?(
            this.state.condition2.aims.map((v,i)=>
              <Menu.Item key={v} num={v}>{v}</Menu.Item>
            )
          ):''
        }
      </Menu>
    );
    const menu3 = (
      <Menu onClick={this.handleMenuClick3} selectable >
        {
          this.state.condition3.spcs && this.state.condition3.spcs.length!==0 ?(
            this.state.condition3.spcs.map((v,i)=>
              <Menu.Item key={v} num={v} >{v}</Menu.Item>
            )
          ):''
        }
      </Menu>
    );
    const menu4 = (
      this.state.condition4.machines && this.state.condition4.machines.length ===0 ?(
          <div>
            <Checkbox
              indeterminate={this.state.indeterminate4}
              onChange={this.onCheckAllChange4}
              checked={this.state.checkAll4}
              style={{display:'block'}}
            >Check all</Checkbox>
            <CheckboxGroup className={styles.selectbox}
                           options={this.state.plainOptions4}
                           value={this.state.checkedList4}
                           onChange={this.onChange4}
            />
          </div>
        ):
        <Menu onClick={this.handleMenuClick4} selectable >
          {
            this.state.condition4.machines ?(
              this.state.condition4.machines.map((v,i)=>
                <Menu.Item key={v} num={v}>{v}</Menu.Item>
              )
            ):''
          }
        </Menu>
    );
    const menu5 = (
      <div>
        {
          this.state.condition5D && this.state.condition5D.length !==0 ?
            <div>
              <Checkbox
                indeterminate={this.state.indeterminate5}
                onChange={this.onCheckAllChange5}
                checked={this.state.checkAll5}
                style={{display:'block'}}
              >Check all</Checkbox>
              <CheckboxGroup className={styles.selectbox}
                             options={this.state.plainOptions5}
                             value={this.state.checkedList5}
                             onChange={this.onChange}
              />
            </div>
            : ''
        }
      </div>
    );
    const menu6 = (
      <div>
        {
          this.state.condition6D && this.state.condition6D.length !==0 ?
            <div>
              <Checkbox
                indeterminate={this.state.indeterminate6}
                onChange={this.onCheckAllChange6}
                checked={this.state.checkAll6}
                style={{display:'block'}}
              >Check all</Checkbox>
              <CheckboxGroup className={styles.selectbox}
                             options={this.state.plainOptions6}
                             value={this.state.checkedList6}
                             onChange={this.onChange6}
              />
            </div>
            : ''
        }
      </div>
    );
    const menu3_4 = (
      <Menu onClick={this.handleMenuClick3_4} selectable  className={styles.menu3_4}>
        {
          this.state.category === 'fqc' ? <Menu.Item key='Line'>Line</Menu.Item> : <Menu.Item key='Machine'>Machine</Menu.Item>
        }
        <Menu.Item key='AIM Ip'>AIM Ip</Menu.Item>
      </Menu>
    );
    return (
      <ul id='headerItems'>
        <Dropdown
          overlay={menu1}
        >
          <li className="ant-dropdown-link">
            {this.state.title1} <Icon type="down" />
          </li>
        </Dropdown>
        <Dropdown
          overlay={menu2}
        >
          <li className="ant-dropdown-link">
            {this.state.title2} <Icon type="down" />
          </li>
        </Dropdown>
        <Dropdown
          overlay={menu3}
        >
          <li className="ant-dropdown-link">
            {this.state.title3} <Icon type="down" />
          </li>
        </Dropdown>
        <Dropdown className={styles.item3_4}
          overlay={menu3_4}
        >
          <li className="ant-dropdown-link">
            {this.state.title3_4} <Icon type="down" />
          </li>
        </Dropdown>
        <Dropdown
          overlay={menu4}
          onVisibleChange={this.handleVisibleChange4}
          visible={this.state.visible4}
        >
          <li className="ant-dropdown-link">
            {this.state.title4} <Icon type="down" />
          </li>
        </Dropdown>
        <Dropdown
          overlay={menu5}
          onVisibleChange={this.handleVisibleChange5}
          visible={this.state.visible5}
        >
          <li className="ant-dropdown-link"  href="#">
            condition5 <Icon type="down" />
          </li>
        </Dropdown>
        <Dropdown
          overlay={menu6}
          onVisibleChange={this.handleVisibleChange6}
          visible={this.state.visible6}
        >
          <li className="ant-dropdown-link"  href="#">
            condition6 <Icon type="down" />
          </li>
        </Dropdown>
      </ul>
    );
  }
}
export default NewHeader;
