// ReSharper disable InconsistentNaming
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Fetch, options, URLS } from '../../shared';
import {  Modal, Button,  Form, ControlLabel,FormGroup, HelpBlock, FormControl} from 'react-bootstrap';

const IsNumeric = (value) => value.length === 0 ? true : /[0-9]+/i.test(value);
// ReSharper restore InconsistentNaming

/**
 * @class Login
 */
// ReSharper disable once InconsistentNaming
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.env = props.env;
        this.state = {
            empId: '',
            role:'assist',
            show: true,
            empHelpText:'',
            disabled: false,
            emp: null,
            error: '',
            disableSubmit:true
        };
        this.input = React.createRef();
        this.select = React.createRef();
        this.loginUser = this.loginUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.handleEmployeeIdChange = this.handleEmployeeIdChange.bind(this);
    }

    updateUser(data) {       
        const { setUser } = this.props;
        const { role } = this.state;         
        this.setState({ disabled: true });
        setUser(data.id, data, role);
 
    }
     
    loginUser(e) {
        e.preventDefault();

        const { empId } = this.state;
         
         
        Fetch(URLS.GetEmployee, this.env, options({ EmployeeID: empId }))
            .then(this.updateUser)
            .catch(console.error);
    }
    handleEmployeeIdChange(event) {
        


        
        const value = event.target.value;
        const isNumeric = IsNumeric(value)  ;
       
        const help = isNumeric ? null : 'Value must be numeric';

        this.setState({ empId: value, empHelpText: help,disableSubmit:!isNumeric });
        

        
    }
   
    getIdValidationState() {
       
        const { empId, empHelpText, disableSubmit } = this.state;

        const isNumeric = IsNumeric(empId) ;
        
        if (isNumeric) {
            if(empHelpText&& empHelpText.length>0)
                this.setState({ empHelpText: null,disableSubmit:false });
            return empId.length > 2 ? 'success' : null;
        }

        if(!disableSubmit)
            this.setState({ disableSubmit: true });
        return 'warning';
    }
     
    render() {
        const { show, empId, role, empHelpText, disableSubmit } = this.state;
        return (
            <Modal show={show} onHide={() => this.setState({ show: false })}
                   backdrop="static"
                   keyboard={false}
                   autoFocus={true}
                   enforceFocus={true}

            >
                <Modal.Header>
                    <Modal.Title>Please Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup controlId="inputId" validationState={this.getIdValidationState()}>
                            <ControlLabel>Employee ID</ControlLabel>
                            <FormControl type="text"
                                         value={empId}
                                         onChange={this.handleEmployeeIdChange}
                                         disabled={this.state.disabled}
                                         placeholder="Employee ID" />
                            <FormControl.Feedback />
                            <HelpBlock>{empHelpText}</HelpBlock>
                        </FormGroup>


                        <FormGroup controlId="selectRole">
                            <ControlLabel>Role</ControlLabel>
                            <FormControl componentClass="select" placeholder="Role"
                                         value={role}
                                         onChange={(e)=>this.setState({role:e.target.value})}
                                         disabled={this.state.disabled}
                                         id="selectRole"


                            >
                                <option value="assist">Load Assist</option>
                                <option value="stage">Staging</option>
                                <option value="load">Load</option>
                            </FormControl>
                        </FormGroup>
                  
                  
                   
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" bsStyle="primary" bsSize="large" onClick={this.loginUser} block disabled={disableSubmit}>Sign In</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
 
Login.propTypes = {
    setUser: PropTypes.func.isRequired
};
