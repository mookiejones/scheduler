import   React, { Component}  from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles"
import * as PropTypes from 'prop-types';
import {
    Save,
    Delete,
    Edit,
    ExpandMore
} from "@material-ui/icons"
import {
    Card,
   CardActions,
   Collapse,
    CardHeader,
    CardContent,
    IconButton,
    Select,
    List,
    Input,
    ListItem,
    FormControl,
    Typography ,
    TextField,
    ListItemText,
    InputLabel,
    Slide,
    Snackbar,
    MenuItem
} from "@material-ui/core"

const items=["id","style_code","pieces","assembly_flow","add_take_off","total_crs","program","mold_skin_style","notes","rework_color_chart","color","blank","total_crs_2","total_pcs","customer","round","crs_real_time","date_created","processed_date","mold_wip_density","round_position","active","scheduled_date","finalized","finalized_date","trial_block","loc","abo_1","abo_2","abo_3","abo_4"        ]
const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    action:{
        marginLeft: 'auto'
    },
    card: {
        maxWidth: 400,
      },
    actions:{
        display:'flex',
        float:"right"
    },
    margin: {
      margin: theme.spacing.unit,
    },
    withoutLabel: {
      marginTop: theme.spacing.unit * 3,
    },
    textField: {
      flexBasis: 200,
    },
  });

   
  const TransitionDown = (props)=>(<Slide {...props} direction="down"/>)
class RuleComponent extends Component {
    constructor(props){
        super(props);


        this.state={
            show:false,
            message:'',
            
            value:{
                title:props.title||"",
                color:props.color||"#000",
                type:props.type||"contains",
                keyName:props.keyName||"program",
                search:props.search||""
            }

        }
        this.handleColorChange=this.handleColorChange.bind(this);
        this.handleTitleChange=this.handleTitleChange.bind(this);
        this.handleRuleChanged=this.handleRuleChanged.bind(this);
        this.handleKeyChange=this.handleKeyChange.bind(this);
        this.handleSearchChange=this.handleSearchChange.bind(this);
        this.saveChanges=this.saveChanges.bind(this);
        this.delete=this.delete.bind(this);
        this.handleValueChange=this.handleValueChange.bind(this);
        this.handleSnackbarClose=this.handleSnackbarClose.bind(this);
    }
    saveChanges(event){
        this.setState({show:true,message:"Saved"});
    }
    delete(event){
        this.setState({show:true,message:"Deleted"});

    }
    handleValueChange(event,key){
        let value=this.state.value;
        value[key]=event.target.value;
        this.setState({value:value})
    }
    handleColorChange(event,color){
this.setState({value:{color:event.target.value}})
    }
    handleTitleChange(event){
        this.setState({value:{title:event.target.value}})
    }
    handleRuleChanged(event,value){
        debugger;
    }
    handleKeyChange(event,value){
        this.setState({"value.keyname":event.target.value})
    }
    handleSearchChange(event){
        this.setState({"value.search":event.target.value})
    }
    handleSnackbarClose(event){
     debugger;
    }
    render(){
        const { classes } = this.props;

        return (
            <Card cardName={classes.card}>
                <CardHeader />
                <CardContent>
              <TextField label="Element" value={this.state.value.keyName} onChange={(e)=>this.handleValueChange(e,"keyName")} select className={classNames(classes.margin,classes.textField)}>              
              {items.map(item=><MenuItem key={item} value={item}>{item}</MenuItem>)}
           
              </TextField>
               
              <TextField label="Rule" value={this.state.value.type} onChange={(e)=>this.handleValueChange(e,"type")}
              className={classNames(classes.margin,classes.textField)}
              select>
              <MenuItem value={"equals"}>Equals</MenuItem>
                        <MenuItem value={"contains"}>Contains</MenuItem>
              </TextField>
                   <TextField label="Equals" onChange={(e)=>this.handleValueChange(e,"search")} value={this.state.value.search} className={classNames(classes.margin,classes.textField)}/>
                        <TextField type="color" label="Color" className={classNames(classes.margin,classes.textField)} onChange={(e)=>this.handleValueChange(e,"color")}/>
               </CardContent>
       <CardActions disableActionSpacing className={classes.actions}>
           <IconButton aria-label="Save" classNames={classes.action} onClick={this.saveChanges}>
               <Save/>
               </IconButton>
               <IconButton aria-label="Delete" classNames={classes.action} onClick={this.delete}>
               <Delete/>
               </IconButton>
    
           </CardActions>
          <Snackbar anchorOrigin={{
              vertical:"bottom",
              horizontal:"center"
          }}
          onClose={()=>this.setState({show:false})}

          TransitionComponent={TransitionDown}
          autoHideDuration={1000}
          open={this.state.show}
          message={this.state.message}
          />
          </Card>
        )
    }
} 

export default withStyles(styles)(RuleComponent)