import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, Button } from 'react-bootstrap';


import Map from './Map.jsx';
import Marker from './Marker.jsx';
import InfoWindow from './InfoWindow.jsx';
import GoogleApiComponent from '../node_modules/google-maps-react/dist/GoogleApiComponent'

import { connect } from 'react-redux';
import {loggedIn, invalidCred, loggedOut, validateInput, clearError, clearUsernameError, clearPasswordError} from './action.jsx'
import Content from './Content.jsx';

function Markers(props){
  //console.log("In markers info ", props)
//   function handleClick(){
//     console.log("Submittttttttttttttttttttttted")
//   }
  return <Marker onClick={props.onClick}
                  // name={props.obj.text  +"Date created on:" +props.obj.date}
                  // name={
                  //   <div>
                  //     <h4 style={{color : '#b3e6ff'}}><b>{"@" + props.obj.owner}</b></h4>
                  //     <h3>{props.obj.text}</h3>
                  //     <hr />
                  //     <h5><i>{"Date created on : " + props.obj.date}</i></h5>
                  //   </div>
                  // }
                  name={
                    <Content  _id={props.obj._id} username={props.username} owner={props.obj.owner} text={props.obj.text} date={props.obj.date}></Content>
                  }
                  position={props.obj.location}
                  map ={props.map}
                  google ={props.google}
                  icon={(props.username === props.obj.owner)? './marker4.png' : './marker3.png'}
                  />
}

@connect( store => {
  return {
      isLoggedIn : store.isLoggedIn,
      username : store.username,
      location : store.location,
      landmarks : store.landmarks
  };
})
export class ViewMap extends React.Component{

    constructor() {
          super();
          this.state ={
            landmarks_state : [],
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            username: 'Afif',
            position: {},
            text: null
        }
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClick= this.onMapClick.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this)
        this.onChange=this.onChange.bind(this)
      }

      onChange(event){
        console.log(event.target.value)
        const marker = Object.assign({}, this.state);
        marker[event.target.name] = value;
        this.setState({ marker });
       // console.log("In parent onChange() setting state => ", this.state.issue);
    }

    componentDidMount(){
      this.loadData()
    }

    loadData(){
      fetch(`/api/landmarks`).then(response =>{
          if(response.ok){
              response.json().then(data => {
              console.log("total count of recordsssss :",data._metadata.total_count);
              data.records.forEach( landmark => {
              if (landmark.date)
                  landmark.date=new Date(landmark.date);
              // landmark.location = "lat:" + landmark.location.lat + " long: " + landmark.location.lng
      });
          this.setState({ landmarks_state : data.records});
          });
      } else {
              respons.json().then( err =>{
                  // alert("Failed to fetch issues:" + error.message)
                  this.showError(`Failed to fetch issues ${error.message}`);
              });
          }
      }).catch(err => {
          // alert("Error in fetching data from server:", err);
          this.showError(`Error in fetching data from server: ${err}`);
      });
  }

    
    render() {
      
        const style = {
          width: '100vw',
          height: '100vh'
        }
        const pos = {lat: 19.0760, lng: 72.8777}
        let current_pos=null;
        navigator.geolocation.getCurrentPosition((pos) => {
            current_pos = pos.coords;
        });

      const landmarks = this.state.landmarks_state
      console.log("Landmark state before render in ViewMap ", landmarks)

        return (
          <div style={style}>
            <Map google={this.props.google}
                         onClick={this.onMapClick}>
                {landmarks.map((object, i) => <Markers username= {this.props.username} onClick={this.onMarkerClick} obj={object} key={i} />)}
                {/* <IssueTable issues_prop={this.state.landmarks_state} /> */}
                {/* <Marker  
                    onClick={this.onMarkerClick}
                    icon={'https://www.robotwoods.com/dev/misc/bluecircle.png'}
                    position={this.current_pos}/>
                <Marker
                    onClick={this.onMarkerClick}
                    // name={<input type="text" name="text" onChange={this.onChange}></input>}
                    // name={<h5 style={{color:'blue'}}>Rock gardennnnnnnnnnnnnnnnnnnnnnnnnnnn<br />nnnnnnnnnnnnnnnnnnn</h5>}
                    name = {<div>
                            <Form inline name="saveNote" onSubmit={this.handleSubmit}>
                                <FormControl componentClass="textarea" placeholder="Enter Note..." />
                                {' '}
                                <Button type="submit" bsStyle="primary">Save</Button>
                            </Form>
                            </div>}
                    position={pos} />             */}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onInfoWindowClose}>

                    <div>
                        <h1>{this.state.selectedPlace.name}</h1>
                    </div>
                </InfoWindow>                        
            </Map>
          </div>
        )
      }
      onMapClick() {
        //   console.log("VM - onMapClick", this.state)
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          });
        }
      }
      onMarkerClick(props, marker, e) {
          console.log('in onMarkerClick()', props)
        this.setState({
          selectedPlace: props,
          activeMarker: marker,
          showingInfoWindow: true
        });
      }
      onInfoWindowClose(){
        // console.log("VM - onInfoWindowClose", this.state)
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        })
    }
}

export default GoogleApiComponent({
    apiKey: ("AIzaSyBw5TNxLFpmHSborSyDUEq6BF7aiv4DCNg")
    })(ViewMap)