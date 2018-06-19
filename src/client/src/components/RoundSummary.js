import React  from 'react';
import * as classnames from 'classnames';
 
export class RoundSummary extends React.Component  {
  constructor(props,context){
    super(props,context);
    this.state={
      roundSummary:[],
      round:-1

    };
  }
  render(){
    if(this.props.round > 0){
      return(
        <div className="header-row" style={{width: "100%", height: "50px", backgroundColor: "rgb(249, 249, 249)", marginBottom: "5px !important"}}>
          <div className="col-sm-3"><div><b>Round:</b></div><span>{this.props.roundSummary[this.props.round]['round']}</span></div>
          <div className="col-sm-3"><div><b>Build Count:</b></div><span>{this.props.roundSummary[this.props.round]['build_count']}</span></div>
          <div className="col-sm-3"><div><b>Carrier Removal:</b></div><span>{this.props.roundSummary[this.props.round]['carrier_removal']}</span></div>
          <div className="col-sm-3"><div><b>Tray Counter:</b></div><span>{this.props.roundSummary[this.props.round]['tray_counter']}</span></div>
        </div>
      );
    }else{
      return(
        <div style={{width: "100%", height: "50px", backgroundColor: "rgb(249, 249, 249)", margin: "auto"}}>
        </div>
      );
    }

  }
}