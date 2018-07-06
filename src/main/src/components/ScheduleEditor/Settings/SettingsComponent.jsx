import   React, { Component}  from "react";
import  PropTypes from 'prop-types';
import {
    Tab,
    Tabs
} from "@material-ui/core"
import RuleSettings from "./RulesSettings";


const tabNames=[
    "Colors",
    "Small Parts"
]
export default class SettingsComponent extends Component{
    constructor(props){
        super(props);
        this.state={value:0}
        this.handleChange=this.handleChange.bind(this);
    }
    handleChange(event,value){
       
        this.setState({value:value});
    }
    render(){
        const {value}= this.state;
        return (
        <div>
        <Tabs value={value} onChange={this.handleChange}>
            {tabNames.map((name,idx)=><Tab key={idx} label={name}/>)}
            </Tabs>
            
            {value===0 && <RuleSettings/>}
            {value===1 && <h1>Hi</h1>}
            </div>
        )        


    }

}