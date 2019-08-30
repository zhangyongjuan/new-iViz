import React from "react";
import MathJax from '@matejmazur/react-mathjax'

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
    },
  },
  AimDashboard:{
    barChart:{
      yAxisLabel:'Bar chart shows the failure rate of each SPCsorted from high to low'
    },
    table:{
      lsl:'Lower Specification Limit',
      norminal:'',
      usl:'UpperSpecification Limit',
      failureRate:'Failure Rate is the % of parts that failed at the AIM station.\n NG / (OK+ NG).',
      std:'Standard Deviation \n Xi:each test point value'
    }
  },
//  公式展示汇总
  formulaShows:{
    test:{
      one:`Std = sqrt ( 1/(N-1)sum_(i=1)^n(X_i-Mean)^2 )`,  //
      two:` `
    },
  }
}
const ToolTips =(page,title,name)=>{
  const contet = Content[page][title][name];
  const returnContent = (
    page === 'formulaShows' ? (
      <div>
        <MathJax.Context>
          <div>
            <MathJax.Node>{contet}</MathJax.Node>
          </div>
        </MathJax.Context>

        <MathJax.Context input='tex'>
          <div>
            <MathJax.Node>{contet}</MathJax.Node>
          </div>
        </MathJax.Context>
      </div>
    ):(
      <div style={{fontSize:'12px',color:'gray',whiteSpace:'pre'}}>{contet}</div>
    )
  );
  return (
    <div style={{fontSize:'12px',color:'gray',whiteSpace:'pre'}}>{returnContent}</div>
  )
}
export default ToolTips

