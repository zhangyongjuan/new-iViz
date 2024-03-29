import React,{ Component } from 'react'
import { Menu, Dropdown, Icon ,Checkbox } from 'antd';
import reqwest from 'reqwest'
import styles from '../index.css';
import '../../global'
import {connect} from "react-redux";
const CheckboxGroup = Checkbox.Group;

@connect(({global}) => ({
  global
}))
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
      plainOptions7:[],
      checkedList7: [],
      visible4: false,
      visible5: false,
      visible6: false,
      visible7: false,
      indeterminate4: false,
      indeterminate5: false,
      indeterminate6: false,
      indeterminate7: false,
      checkAll4: true,
      checkAll5: true,
      checkAll6: true,
      checkAll7: true,
      condition1:{},
      condition2:{},
      condition3:{},
      condition4:{},
      condition5:{},
      condition6:{},
      condition7:{},
      allConditions:{},
      condition4D:[],
      condition5D:[],
      condition6D:[],
      condition7D:[],
      title5:'condition5',
      title6:'',
      title7:'',
      spcId:'',
      title0:'OK/NG',
      title1:'Distribution/Yield',     //后面需求是条件一和二顺序调换，所以title序号反过来
      title2:'Station',
      title3:'SPC',
      title3_4:'Advanced_condition',
      title4:'condition4',
      category:'',

      select0:[],
      select1:[],
      select2:[],
      select3:[],
      select3_4:[],
      select4:[],
      select5:[],
      select6:[],
      select7:[],
      timeRange:{},
      mapping:{
        site: "",
        product: "",
        color: [],      //有全选和单选之分，全选时需要列出全部选择项
        build: "",
        special_build:"",
        wifi: []
      },
    //  condition5,condition6,condition7是否显示
      isHidecondition4:'none',
      isHidecondition5:'none',
      isHidecondition6:'none',
      isHidecondition7:'none',
    };
    return State;
  }
  componentDidMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    // let mapping = ''
    // Object.keys(nextProps.global.topSelectItem).map((v,i)=>{
    //   return mapping += nextProps.global.topSelectItem[v];
    // })
    if(JSON.stringify(nextProps.global.dateTime) !== JSON.stringify(this.state.timeRange) || JSON.stringify(nextProps.global.topSelectItem) !== JSON.stringify(this.state.mapping)){
      this.setState(this.initialState());
      this.setState({timeRange:nextProps.global.dateTime,mapping: nextProps.global.topSelectItem},this.fetch);
    }
  }

  fetch = ()=>{
    const T = Object.assign({},this.props.global.dateTime);
    T.mapping = this.props.global.topSelectItem;
    let timeN = {};
    timeN.data = JSON.stringify(T);
    reqwest({
      url:`${global.constants.ip}/condition/get`,
      method:'get',
      type:'json',
      data:timeN
    })
      .then((data)=>{
        // console.log('初始拿到的所有选择项：',data);
        this.setState({condition1:data.condition1,condition2:data.condition2,condition3:data.condition3,
          condition4:data.condition4,condition5:data.condition5,condition6:data.condition6,condition7:data.condition7,allConditions:data},this.test)
      })
  }
  turnData(alloption){
    this.props.fun(alloption)
  }
  test(){
    let alloption = {};
    alloption.okng = this.state.select0;
    alloption.condition1 = this.state.select1;
    alloption.condition2 = this.state.select2;
    alloption.condition3 = this.state.select3;
    alloption.condition3_4 = this.state.select3_4;
    alloption.condition4 = this.state.select4;
    alloption.condition5 = this.state.select5;
    alloption.condition6 = this.state.select6;
    alloption.condition7 = this.state.select7;
    // console.log('将要传回去画图的值---',alloption);
    this.turnData(alloption)
  }
  handleMenuClick0 = e=>{
    // console.log('条件0被点击项-------',e);
    const d0 = [];
    const key = e.key;
    d0.push(key);
    this.setState({select0:d0,title0:key},this.test)
  }
  handleMenuClick1 = e=>{
    // console.log('条件1被点击项-------',e);
    const d1 = [];
    const key = e.key;
    d1.push(key);
    this.setState({select1:d1,title1:key},this.test)
  }
  handleMenuClick2 = e => {
    // console.log('条件2被点击项-------',e);
    let bigContainer = {};
    bigContainer.data = {};
    let data = {};
    data.aims = [];
    data.aims.push(e.key);
    bigContainer.data = JSON.stringify(data);
    this.setState({select2:data.aims,title2:e.key,title3:'SPC'},this.test)
    reqwest({
      url:`${global.constants.ip}/condition/getCondition3`,
      method:'get',
      type:'json',
      data:bigContainer
    })
      .then((data)=>{
        // console.log('newCondition3========',data);
        this.setState({condition3:data,category:data.process})
      })
  };
  handleMenuClick3 = e=>{
    // console.log('条件3被点击项-------',e);
    let d3 = [];
    const clickId = e.key;
    d3.push(clickId)
    this.setState({select3:d3,spcId:clickId,title3:clickId},this.test)
    // console.log(this.state.select3)
  }
  IsShowCondition =(advanced_condition_key)=>{
    let title4='condition4',title5='condition5',title6='condition6',title7='condition7',isHidecondition4='inline-block',isHidecondition5='',isHidecondition6='',isHidecondition7='';
    switch (advanced_condition_key) {
      case 'CNC':
        title4 = 'CNC#';
        title5 = 'Cell#';
        title6 = 'Machine#';
        isHidecondition5 ='inline-block';
        isHidecondition6 ='inline-block';
        isHidecondition7 ='none';
        break;
      case 'SPM':
        title4 = 'SPM#';
        title5 = 'SPM-line#';
        title6 = 'Machine#';
        title7 = 'Cavity#';
        isHidecondition5 ='inline-block';
        isHidecondition6 ='inline-block';
        isHidecondition7 ='inline-block';
        break;
      case 'Line':
        title4 = 'Line#';
        isHidecondition5 ='none';
        isHidecondition6 ='none';
        isHidecondition7 ='none';
        break;
      case 'AIM':
        title4 = 'AIM#';
        isHidecondition5 ='none';
        isHidecondition6 ='none';
        isHidecondition7 ='none';
        break;
      case 'Shift':
        title4 = 'D/N#';
        isHidecondition5 ='none';
        isHidecondition6 ='none';
        isHidecondition7 ='none';
        break;
      default:
        title4 = 'condition4';
        isHidecondition5 ='none';
        isHidecondition6 ='none';
        isHidecondition7 ='none';
    }
    this.setState({title4:title4,title5:title5,title6:title6,title7:title7,isHidecondition4,isHidecondition5 , isHidecondition6 , isHidecondition7 ,})
  }
  handleMenuClick3_4 = e=>{
    // console.log(e);
    // console.log('select2======',this.state.select2);
    // console.log('select3======',this.state.select3);
    this.IsShowCondition(e.key);

    const d3_4 = {},container = {},s3_4 = [];
    s3_4.push(e.key)
    d3_4.child = e.key;
    d3_4.aims = this.state.select2;
    d3_4.spcs = this.state.select3;
    container.data = JSON.stringify(d3_4);
    this.setState({title3_4:e.key,select3_4:s3_4})
    reqwest({
      url:`${global.constants.ip}/condition/getCondition4`,
      method:'get',
      type:'json',
      data:container
    })
      .then(data=>{
        // console.log('c4-----',data);
        if(data.aimIps.length !== 0){
          this.setState({condition4D:data.aimIps,select4:data.aimIps})   //选择cnc和spm时，条件4为单选
        }else if(data.lines.length !== 0){
          this.setState({condition4D:data.lines,select4:data.lines})
        }else if(data.shifts.length !== 0){
          this.setState({condition4D:data.shifts,select4:data.shifts})
        }
        else{
          this.setState({checkedList4:[],plainOptions4:[]})
        }
        this.setState({condition4:data});
        this.setState({checkedList5:[],checkedList6:[],checkedList7:[],plainOptions5:[],plainOptions6:[],plainOptions7:[],select5:[],select6:[],select7:[]},this.test)
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
    // console.log('被点击项-------',e);
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
      url:`${global.constants.ip}/condition/getCondition5`,
      method:'get',
      type:'json',
      data:container
    })
      .then((data)=>{
        // console.log('newCondition5========',data);
        this.setState({condition5:data})
        data.machines && data.machines.length !== 0 ? this.setState({condition5D:data.machines,plainOptions5:data.machines,checkedList5:data.machines}):
          this.setState({condition5D:data.spms,plainOptions5:data.spms,checkedList5:data.spms})
        // console.log('5D====',this.state.condition5D);
        this.setState({select5:this.state.condition5D});
        d4.con5=data.machines.length !== 0 ? data.machines : data.spms;
        container.data = JSON.stringify(d4);
        this.getcondition6(container);

      })
  };
  handleMenuClick5 = e=>{
    // console.log('条件5点击了-------',e);
    const d5 = {},container = {},machine5 = [];
    d5.child = [];d5.con4 = [];d5.con5 = [];
    d5.child.push(this.state.title3_4);
    d5.aims = this.state.select2;
    d5.spcs = this.state.select3;
    d5.con4 = this.state.select4;
    d5.con5.push(e.key);
    container.data = JSON.stringify(d5)
    machine5.push(e.key)
    this.setState({select5:machine5,title5:e.key});

    reqwest({
      url:`${global.constants.ip}/condition/getCondition6`,
      method:'get',
      type:'json',
      data:container
    })
      .then((data)=>{
        // console.log('newCondition6========',data);
        this.setState({condition6:data});
        this.state.condition6.machines && this.state.condition6.machines.length !== 0 ? this.setState({condition6D:this.state.condition6.machines,plainOptions6:data.machines,checkedList6:data.machines}) :
          this.setState({condition6D:this.state.condition6.spms,plainOptions6:data.spms,checkedList6:data.spms})
        // console.log('6D====',this.state.condition6D);
        this.setState({select6:this.state.condition6D})

        d5.con6=data.spms.length !== 0 ?data.spms : data.machines;
        container.data = JSON.stringify(d5);
        this.getcondition7(container)
      })
  }
  getcondition7(getCondition7){
    reqwest({
      url:`${global.constants.ip}/condition/getCondition7`,
      method:'get',
      type:'json',
      data:getCondition7
    })
      .then(data=>{
        // console.log('条件7--',data);
        this.setState({condition7:data,condition7D:data.spms,plainOptions7:data.spms,checkedList7:data.spms,select7:data.spms},this.test)
      })
  }
  handleVisibleChange4 = flag => {
    this.setState({ visible4: flag });
  };
  handleVisibleChange5 = flag => {
    this.setState({ visible5: flag });
  };
  handleVisibleChange6 = flag => {
    this.setState({ visible6: flag });
  };
  handleVisibleChange7 = flag => {
    this.setState({ visible7: flag });
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
      // console.log('这是改变后的条件5选项',newList)
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
    // console.log('select4======',newList)
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
        url:`${global.constants.ip}/condition/getCondition5`,
        method:'get',
        type:'json',
        data:container
      })
        .then(data=>{
          // console.log('条件4选择line，这是条件5的数据',data)
          this.setState({condition5:data,condition5D:data.spms})
          // console.log('5D====',this.state.condition5D);
          this.setState({plainOptions5:[],checkedList5:[],select5:[],checkAll5:false});
        })
    }
  }
  getcondition6(container){
    reqwest({
      url:`${global.constants.ip}/condition/getCondition6`,
      method:'get',
      type:'json',
      data:container
    })
      .then(data=>{
        // console.log('newCondition6========',data);
        this.setState({condition6:data})
        this.state.condition6.machines && this.state.condition6.machines.length !== 0 ? this.setState({condition6D:this.state.condition6.machines}) :
          this.setState({condition6D:this.state.condition6.spms})
        // console.log('6D====',this.state.condition6D);
        let arr = this.state.condition6D;
        // if(data.title === 'Mc'){
        //   this.setState({title6:data.title});
        // }
        this.setState({plainOptions6:arr,checkedList6:arr,select6:this.state.condition6D},this.test);

        //  如果是spm,则需要请求条件7
        if(this.state.title3_4 === 'SPM'){
          const newContainer = {};
          const oldReq = container.data;
          const reqData = JSON.parse(oldReq);
          reqData.con6=data.spms;
          newContainer.data = JSON.stringify(reqData);
          this.getcondition7(newContainer);
        }

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
    this.state.checkedList6.map((v,j)=>{
      this.state.condition6D.map((val,i)=>{
        if(v === val){
         return newList.push(val)
        }
      })
    })
    // console.log('选择的条件6---',newList)
    this.setState({select6:newList});
    const d6 = {},container = {};
    d6.child = [];d6.con4 = [];d6.con5 = [];d6.con6 = [];
    d6.child.push(this.state.title3_4);
    d6.aims = this.state.select2;
    d6.spcs = this.state.select3;
    d6.con4 = this.state.select4;
    d6.con5 = this.state.select5;
    d6.con6=newList;
    container.data = JSON.stringify(d6);
    this.getcondition7(container)
  }
  onCheckAllChange7 = e => {
    this.setState({
      checkedList7: e.target.checked ? this.state.plainOptions7 : [],
      indeterminate7: false,
      checkAll7: e.target.checked,
    },this.managelist7);
  };
  onChange7 = checkedList7 => {
    this.setState({
      checkedList7,
      indeterminate7: !!checkedList7.length && checkedList7.length < this.state.plainOptions7.length,
      checkAll6: checkedList7.length === this.state.plainOptions7.length,
    },this.managelist7);
  };
  managelist7(){
    const newList = [];
    const container = {};
    container.data = {};
    this.state.checkedList7.map((v,j)=>{
      this.state.condition7D.map((val,i)=>{
        if(v === val){
         return newList.push(val)
        }
      })
    })
    // console.log(newList)
    this.setState({select7:newList},this.test)
  }
  render() {
    const isHidecondition4 = this.state.isHidecondition4;
    const isHidecondition5 = this.state.isHidecondition5;
    const isHidecondition6 = this.state.isHidecondition6;
    const isHidecondition7 = this.state.isHidecondition7;
    const menu0 = (
      <Menu onClick={this.handleMenuClick0} selectable style={{maxHeight:'300px',overflowY:'scroll'}}>
        <Menu.Item key='ALL'>ALL</Menu.Item>
        <Menu.Item key='OK'>OK</Menu.Item>
        <Menu.Item key='NG'>NG</Menu.Item>
      </Menu>
    );
    const menu1 = (
      <Menu onClick={this.handleMenuClick1} selectable style={{maxHeight:'300px',overflowY:'scroll'}}>
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
      <Menu onClick={this.handleMenuClick2} selectable style={{maxHeight:'300px',overflowY:'scroll'}}>
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
      <Menu onClick={this.handleMenuClick3} selectable style={{maxHeight:'300px',overflowY:'scroll'}} >
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
      this.state.condition4.machines && this.state.condition4.machines.length ===0 && this.state.condition4.spms.length ===0 ?(
          <div style={{maxHeight:'300px',overflowY:'scroll'}}>
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
        <Menu onClick={this.handleMenuClick4} selectable style={{maxHeight:'300px',overflowY:'scroll'}}>
          {
            this.state.condition4.machines && this.state.condition4.machines.length !==0 ?(
              this.state.condition4.machines.map((v,i)=>
                <Menu.Item key={v} num={v}>{v}</Menu.Item>
              )
            ):this.state.condition4.spms && this.state.condition4.spms.length !==0 ?(
              this.state.condition4.spms.map((v,i)=>
                <Menu.Item key={v} num={v}>{v}</Menu.Item>
              )
            ):null
          }
        </Menu>
    );
    const menu5 = (
      this.state.title3_4 === 'Line' ?(
          <Menu onClick={this.handleMenuClick5} selectable style={{maxHeight:'300px',overflowY:'scroll'}}>
            {
              this.state.condition5 ?(
                this.state.condition5D.map((v,i)=>
                  <Menu.Item key={v} num={v}>{v}</Menu.Item>
                )
              ):''
            }
          </Menu>
        ) :
      <div style={{maxHeight:'300px',overflowY:'scroll'}}>
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
      <div style={{maxHeight:'300px',overflowY:'scroll'}}>
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
            : null
        }
      </div>
    );
    const menu7 = (
      <div style={{maxHeight:'300px',overflowY:'scroll'}}>
        {
          this.state.condition7D && this.state.condition7D.length !==0 ?
            <div>
              <Checkbox
                indeterminate={this.state.indeterminate7}
                onChange={this.onCheckAllChange7}
                checked={this.state.checkAll7}
                style={{display:'block'}}
              >Check all</Checkbox>
              <CheckboxGroup className={styles.selectbox}
                             options={this.state.plainOptions7}
                             value={this.state.checkedList7}
                             onChange={this.onChange7}
              />
            </div>
            : ''
        }
      </div>
    );
    const menu3_4 = (
      <Menu onClick={this.handleMenuClick3_4} selectable  className={styles.menu3_4}>
        {
          this.state.category === 'cnc' ? <Menu.Item key='CNC'>CNC</Menu.Item> : <Menu.Item key='SPM'>SPM</Menu.Item>
        }
        <Menu.Item key='Line'>Line</Menu.Item>
        <Menu.Item key='AIM'>AIM</Menu.Item>
        <Menu.Item key='Shift'>Shift</Menu.Item>
      </Menu>
    );
    return (
      <ul id='headerItems'>
        <Dropdown
          overlay={menu0}
        >
          <li className="ant-dropdown-link">
            {this.state.title0} <Icon type="down" />
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
          overlay={menu1}
        >
          <li className="ant-dropdown-link">
            {this.state.title1} <Icon type="down" />
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
          <li className="ant-dropdown-link" >
            {this.state.title3_4} <Icon type="down" />
          </li>
        </Dropdown>
        <Dropdown
          overlay={menu4}
          onVisibleChange={this.handleVisibleChange4}
          visible={this.state.visible4}
        >
          <li className="ant-dropdown-link" style={{display:`${isHidecondition4}`}}>
            {this.state.title4} <Icon type="down" />
          </li>
        </Dropdown>
        <Dropdown
          overlay={menu5}
          onVisibleChange={this.handleVisibleChange5}
          visible={this.state.visible5}
        >
          <li className="ant-dropdown-link"  href="#" style={{display:`${isHidecondition5}`}}>
            {this.state.title5} <Icon type="down" />
          </li>
        </Dropdown>
        <Dropdown
          overlay={menu6}
          onVisibleChange={this.handleVisibleChange6}
          visible={this.state.visible6}
        >
          <li className="ant-dropdown-link"  href="#" style={{display:`${isHidecondition6}`}}>
            {this.state.title6} <Icon type="down" />
          </li>
        </Dropdown>
        <Dropdown
          overlay={menu7}
          onVisibleChange={this.handleVisibleChange7}
          visible={this.state.visible7}
        >
          <li className="ant-dropdown-link"  href="#" style={{display:`${isHidecondition7}`}}>
            {this.state.title7} <Icon type="down" />
          </li>
        </Dropdown>
      </ul>
    );
  }
}
export default NewHeader;
