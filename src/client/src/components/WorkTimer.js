// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';



export default class WorkTimer extends React.Component {

        isTimerDisplayed: boolean;    
        startTime: null;
        timerInterval: number;    
        leadIds: number[];
        

    getInitialState() {
        return { elasped: 0 };
    }

    componentWillMount() {
        //toDo:  Implement web service call in beginning of main app to get lead data.
        this.leadIds = [252, 2182, 2644, 2151, 1972, 1597, 2166, 166, 22];
        this.configureTimer(this.props.currentUser, this.props.processStep, this.props.rackOwner, this.props.rowData);         
    }

    
    componentWillReceiveProps(nextProps: any) {
        if (nextProps.processStep !== this.props.processStep && nextProps.rackOwner !== this.props.rackOwner) {
            this.configureTimer(nextProps.currentUser, nextProps.processStep, nextProps.rackOwner, nextProps.rowData);
        };
    }

    componentWillUnmount() {
        this.setTimerOff();
    }

    configureTimer(currentUser: string, processStep: string, rackOwner: string, rowData: any) {
        var supervisorFound = this.leadIds.find((x) => x == currentUser.id);
        var isSupervisor = (supervisorFound !== undefined);
        var hasCurrentUserSelectedItem = (processStep == "ASSIST-IN_PROCESS" && rackOwner == currentUser.name);
        var timerStartTime = this.getTimerStartTime(processStep, rowData);

        if (timerStartTime != null && (isSupervisor || hasCurrentUserSelectedItem)) {
            this.startTime = timerStartTime;
            this.isTimerDisplayed = true;
            this.setTimerOn();
        }
        else {
            this.isTimerDisplayed = false;
            this.setTimerOff();
        };
    }

    getTimerStartTime(processStep: any, rowData: any) {
        var startDate;
        switch (processStep) {
            // case 'ASSIST-NOT_STARTED':
            //   //n/a
            //   startDate = null;
            //   break;
            case 'ASSIST-IN_PROCESS':
                //dateGrabbed
                startDate = rowData[16];
                break;
            case 'ASSIST-COMPLETED':
                //date_handled
                startDate = rowData[15];
                break;
            case 'STAGE-COMPLETED':
                //date_staged
                startDate = rowData[14];
                break;
            default:
                //none
                startDate = null;
                break;
        };
        return startDate;
    }

    setTimerOn() {
        this.timerInterval = window.setInterval(this.refreshTimer, 1000);
    }

    setTimerOff() {
        if (this.timerInterval != undefined && this.timerInterval > 0)
            window.clearInterval(this.timerInterval);
    }

    refreshTimer() {
        if (this.startTime != null) {
            this.setState({ elasped: (new Date() - new Date(this.startTime)) });
        }
    }

    render() {
        if (this.isTimerDisplayed) {
            var momentDuration = moment.duration(this.state.elasped);
            var timerString = momentDuration.hours() + ":"
                + (momentDuration.minutes() < 10 ? "0" : "") + momentDuration.minutes() + ":"
                + (momentDuration.seconds() < 10 ? "0" : "") + momentDuration.seconds();
            var cssClass = (momentDuration.hours() > 0 || momentDuration.minutes() >= 4) ? "text-danger bg-danger" : "";

            return (<div className={cssClass} style={{ textAlign: 'center' }} >{timerString}</div>);
        }
        else {
            return (<div ></div>);
        }
    }

  

   
}


