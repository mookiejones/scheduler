import React, { Component } from 'react';

var styles = ['green', 'yellow', 'orange', 'red', 'purple', 'blue']
 
export  class UndoCell extends Component{
    render(){
      let rowData=this.props.rowData;
      let answer=<td className={'tap rack-group-' + styles[parseInt(rowData[3]) % styles.length]}>{rowData[10]}</td>
      switch (this.props.role) {
        case 'load': 
          if(rowData[rowData.length - 3] != "##AVAILABLE##" && rowData[rowData.length - 2] != "##AVAILABLE##") return <td style={{fontSize: '45px'}} className={'undo ' + 'rack-group-' + styles[parseInt(this.props.rowData[3]) % styles.length]}><i className='fa fa-undo'></i></td>
          return answer;
          break;
        case 'stage':
          if(this.props.rowData[this.props.rowData.length - 2] != "##AVAILABLE##") return <td style={{fontSize: '45px'}} className={'undo ' + 'rack-group-' + styles[parseInt(this.props.rowData[3]) % styles.length]}><i style={{paddingLeft: '5px'}} className='fa fa-undo'></i></td>
          return answer;
          break;
        case 'assist':
          if(this.props.rowData[this.props.rowData.length - 1] == this.props.currentUser.name) return <td style={{fontSize: '45px'}} className={'undo ' + 'rack-group-' + styles[parseInt(this.props.rowData[3]) % styles.length]}><i style={{paddingLeft: '5px'}} className='fa fa-undo'></i></td>
          return answer;
        default:
          return <td></td>
      }
    }
  }