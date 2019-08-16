import React from 'react';
import { Empty } from 'antd';

import styles from './index.less';

const NoData = (props) => {
  const { height = 400 ,description} = props;
  return (
    <div style={{ height }} className={styles.main}>
      <Empty description={description}/>
    </div>
  );
};

export default NoData;
