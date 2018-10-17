import React from 'react';
import { Form,FormGroup, FormControl, ControlLabel, ButtonToolbar,InputGroup, Button, Col, Row} from 'react-bootstrap';
import  qs from 'query-string';
import { parse } from 'query-string';


export default class LandmarkSearch extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            owner:  '',
            text: ''
        }
        this.onChangeUser=this.onChangeUser.bind(this)
        this.onChangeText=this.onChangeText.bind(this)
        this.onClickText=this.onClickText.bind(this)
        this.onClickUser=this.onClickUser.bind(this)
        this.clearFilter=this.clearFilter.bind(this)
    }

onChangeUser(e){

    this.setState({ owner: e.target.value});

    // console.log("Changed User")
}

onChangeText(e){

    this.setState({ text: e.target.value});

    // console.log("Changed Text")
}

onClickUser(e){
    e.preventDefault();
    // console.log("Submit User", { owner : this.state.owner })
    this.props.setURL( { owner : this.state.owner })
    this.setState({text : ''})
}

onClickText(e){
    e.preventDefault();
    // console.log("submit Text", this.state.text)
    this.props.setURL({ text : this.state.text})
    this.setState({owner : ''})

}

clearFilter(){
    this.props.setURL({})
    this.setState({owner : '', text : ''})
}

render(){
    return(<div>
            <form>
            <Row>
            <Col sm={3} >

                    <FormGroup bsSize="sm">
                        <ControlLabel>Search by name</ControlLabel>
                        <InputGroup bsSize="small">
                            <FormControl 
                                componentClass="select" value={this.state.owner} onChange={this.onChangeUser}
                            >
                                <option value="">(Any)</option>
                                <option value="userA">userA</option>
                                <option value="userB">userB</option>
                                <option value="userC">userC</option>
                            </FormControl>
                            <InputGroup.Button > 
                                <Button onClick={this.onClickUser} >Search</Button>
                            </InputGroup.Button >
                        </InputGroup>
                    </FormGroup> 
                 </Col>

                    <FormGroup bsSize="sm">
                    <Col sm={3}>
                            <ControlLabel>Search by text</ControlLabel>
                            <InputGroup bsSize="small">
                            <FormControl
                                componentClass="input" value={this.state.text} onChange={this.onChangeText}
                            >
                            </FormControl>
                            <InputGroup.Button >
                                <Button onClick={this.onClickText} >Search</Button>
                            </InputGroup.Button>
                        </InputGroup>
                    </Col>
                    </FormGroup>
                    <FormGroup >
                    <Col smOffset={11}>
                    <Button bsStyle="primary" onClick={this.clearFilter}>Reset List</Button>
                    </Col>
                    </FormGroup>
                    </Row>
            </form>
        </div>
    )
}
}