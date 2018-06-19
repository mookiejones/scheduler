import React, { Component } from 'react';
import * as classnames from 'classnames';

 
export class Description extends Component {
    render(){
      if(this.props.rowData[5] != ""){
        var style = classnames({
          'tap': true,
          'label': true,
          'label-danger': this.props.rowData[5] == "Do Not Ship" ||  this.props.rowData[5] == "Red Hot !!",
          'label-info' : this.props.rowData[5] == "Ship If Good",
          'label-warning': this.props.rowData[5] == "Build"
        });
  
        return (
          <td className='tap'>
            {this.props.children}
            <br/>
            <div className='tap' style={{marginBottom: '10px', marginTop: '10px'}}>
              <span className={style}>{this.props.rowData[5]}</span>
            </div>
          </td>
        )
      }else{
        return (
          <td className='tap'>
            {this.props.children}
          </td>
        )
      }
    }
  }