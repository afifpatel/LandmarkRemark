import React from 'react';
import { Button, ButtonToolbar, Glyphicon, Table, Panel, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import { spread } from 'babel-plugin-transform-object-rest-spread';

export default class Content extends React.Component{

    constructor(props){
        super(props);
        this.state={
            landmark :{
            _id: this.props._id,
            owner : this.props.owner,
            text : this.props.text,
            date : this.props.date
        },
        username : this.props.username
    }
        this.onChange=this.onChange.bind(this)
        // this.onSubmit=this.onSubmit.bind(this)
}
onChange(event){
    // console.log(event.target.value)
    const content = Object.assign({}, this.state.landmark);
   
    content[event.target.name] = value;
    this.setState({ landmark : content });
}
// onClick(e){
//     e.preventDefault();
//     this.props.handleClick;
// }

// onSubmit(e){
//     e.preventDefault();
//     console.log("Submitted")
// }
    render(){
        const { username, landmark} = this.state;
        // console.log("In Content ", username, landmark)
        return(
            <form id="note" onSubmit={this.onSubmit}>
                <h5 id="_id" style={{display : 'none'}}>{landmark._id}</h5>
                <h5 id="owner" style={{color : '#b3e6ff'}}>{"@" + landmark.owner}</h5>
                {username === landmark.owner ?
                <FormControl id="text" name="text" componentClass="textarea" value={landmark.text} onChange={this.onChange} />
                :
                <FormControl id="text" name="text" componentClass="textarea" value={landmark.text} onChange={this.onChange} disabled={true} />
                }
                <h6 id="date" style={{fontStyle : 'italic'}}>{"Last updated on : " + landmark.date}</h6>
                {username === landmark.owner ?
                    <ButtonToolbar>
                    <Button id="submit" bsStyle="primary" bsSize="xsmall" type="submit" disabled={true}>
                    Save
                    </Button>
                    <Button id="delete" bsStyle="danger" bsSize="xsmall" >
                    Delete
                    </Button>
                    </ButtonToolbar> : '' }
            </form>
            
        )
    }
}