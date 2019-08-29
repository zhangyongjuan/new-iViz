import React from "react";
import {dimValueGetter} from "echarts/src/component/marker/markerHelper";

const Content = {
  summaryPage:{
    overView:{
      firstPass:'Cumulative First Pass Yield is the product of the first pass yield at each process.\n Multiplication of First Pass Yield @ each Process',
      finalPass:'Cumulative Final Pass Yield is the product of the Final pass yield at each process.\n Multiplication of Final Pass Yield @ each Process',
    },
    table:{
      th2:'First Pass Yield is the % of parts that passed at the process without being reworked.\n passed / (passed + reworked + failed + scrapped).',
      th3:'Projected Final Pass Yield is the % of parts that passed or were reworked successfully at the process.\n ' +
        '(passed + reworked + failed * Rework Success %) / (passed + reworked + failed + scrapped)\n ' +
        'Rework Success Rate is the % of parts that were reworked successfully at the process in the last 10 days.',
      th4:'#of total parts at the given process, including those being reworked.\n' +
        'passed + reworked + failed + scrapped.',
      th5:'# of parts with a passed event at the given process that were not reworked.',
      // th5:`$$\alpha+\beta=\gamma$$`
    }
  }
}
const ToolTips =(page,title,name)=>{
  const returnContet = Content[page][title][name];
  return (
    <div style={{fontSize:'12px',color:'gray',whiteSpace:'pre'}}>{returnContet}</div>
  )
}
export default ToolTips

