import React from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    align:'center'
  },
  {
    title: 'LSL',
    dataIndex: 'lsl',
    key: 'lsl',
    align:'center'
  },
  {
    title: 'Norminal',
    dataIndex: 'norminal',
    key: 'norminal',
    align:'center'
  },
  {
    title: 'USL',
    dataIndex: 'usl',
    key: 'usl',
    align:'center'
  },
  {
    title: 'Actual Mean',
    dataIndex: 'actualMean',
    key: 'actualMean',
    align:'center'
  },
  {
    title: 'Yield',
    dataIndex: 'yield',
    key: 'yield',
    align:'center'
  },
  {
    title: 'Std',
    dataIndex: 'std',
    key: 'std',
    align:'center'
  },
];

class BasicTable extends React.Component {
  render() {
    const {data,rowKey,loading}=this.props;
    return (
      <div style={{marginTop:30}}>
        <Table
          rowKey={r=>r[rowKey]}
          bordered
          scroll={{ x: 900,y: 400 }}
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default BasicTable;
