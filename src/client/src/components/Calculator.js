import React, { Component } from 'react';
import * as classnames from 'classnames';
 
export class Calculator extends Component{
    getInitialState(){
      return {
        editing: false
      }
    }
    calcClick(){
      if(this.state.editing){
        var newQty = this.input.value;
  
        if (this.props.rowData[this.props.rowData.length - 1] == this.props.currentUser.name) {
            if (parseInt(newQty) < this.props.rowData[9]) {
                this.props.updatePartialQty(parseInt(newQty), this.props.rowData);
            } else {
                //var el = document.getElementById("alert")
                //$(el).fadeIn(1000);
                //setTimeout(function () {
                //    $(el).fadeOut();
                //}, 8000);
            }
        }
  
        this.input.value = '';
        this.setState({
          editing: !this.state.editing
        });
      }else{
        this.setState({
          editing: !this.state.editing
        });
        this.input.focus();
      }
    }
    render(){
      if(this.props.role == 'load' || this.props.role == 'watch'){
        if(this.props.rowData[this.props.rowData.length - 1] != "##AVAILABLE##"){
          if (this.props.rowData[this.props.rowData.length - 2] != "##AVAILABLE##") {
              return (<td><i style={{fontSize: '50px'}} className='fa fa-check-square-o' aria-hidden='true'></i></td>)
          } else {
              return (<td><i style={{fontSize: '50px'}} className='fa fa-truck animate-flicker' id=''></i></td>)
          }
        }else{
          return <td></td>
        }
        return <td className='tap'><i style={{fontSize: '50px'}} className='fa fa-truck animate-flicker' id=''></i></td>
      }else{
        var inputStyle = classnames({
          'hidden': !this.state.editing
        });
  
        if(this.props.rowData[this.props.rowData.length - 1] == this.props.currentUser.name) {
          return (
            <td className='action'>
              <input type='tel' ref={(i) => this.input = i} className={inputStyle} name='quantity' style={{width:'65px'}} />
              <i style={{fontSize: '50px'}} className='fa fa-calculator' onClick={this.calcClick}></i>
            </td>
          )
        }
        else{
          return <td className='tap'></td>
        }
      }
    }
  }