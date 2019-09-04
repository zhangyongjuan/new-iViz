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
    dashboard:{
      Line:'The line of equipment.',
      Process:'The process of equipment.',
      Input:'# of total parts at the given AIM station.',
      OK:'# of parts with a passed event at the given AIM station.',
      NG:'# of parts with a faild event at the given AIM station.',
      'Failure Rate':'Failure Rate is the % of parts that failed at the AIM station.',
    },
    barChart:{
      yAxisLabel:'Bar chart shows the failure rate of each SPCsorted from high to low'
    },
    table:{
      lsl:'Lower Specification Limit',
      norminal:'',
      usl:'Upper Specification Limit',
      failureRate:'Failure Rate is the % of parts that failed at the AIM station.\n NG / (OK+ NG).',
      // std:'Standard Deviation \n Xi:each test point value'
    }
  },
  //统计分析
  spcStatisticalAnalysis:{
    Capability:{
      sampleNum:'Number of observations.',
      mean:'Average value at all Test Point.',
      target:'',
      // lsl:'Lower Specification Limit.',
      // usl:'Upper Specification Limit.',
      'exp<lsl':'A value giving the expected fraction, based on a normal approximation, of the observations less than LSL.',
      'exp>usl':'A value giving the expected fraction, based on a normal approximation, of the observations greater than USL.',
      'obs<lsl':'A value giving the fraction of observations less than LSL .',
      'obs>usl':'A value giving the fraction of observations greater than USL.'
    },
    IChart:{
      lcl:'Lower Control Limit',
      ucl:'Upper Control Limit',
      numberBeyondLimits:'Number of observations less than LCL and greater than UCL.'
    }
  },
//  对比分析
  comparisonAnalysis:{
    table:{
      min:'Minimum in all observations.',
      max:'Maximum in all observations.',
      mean:'Average value at all observations.',
      median:'The value separating the higher half from the lower half of a data sample.',
    }
  },
//  公式展示汇总
  formulaShows:{
    showInfo:{
      std:`Standard \quad  Deviation : Std = sqrt ( 1/(N-1)sum_(i=1)^n(X_i-Mean)^2 )`,
      cp:`Cp = (USL-LSL)/(6 ast Std)`,
      cpl:`CPL = (Mean-LSL)/(3 ast Std)`,
      cpu:`CPU = (USL-Mean)/(3 ast Std)`,
      cpk:`Cpk = min{CPL,CPU}`,
      cpm:`Cp m = (USL-LSL)/(6sqrt (Std^2 + (Mean -Targ et)^2))`,
      ppm:`pp m = [P(X<LSL)+P(X>USL)]ast10^6`
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

