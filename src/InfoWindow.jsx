import React from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';
import { Button, ButtonToolbar, Glyphicon, Table, Panel, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';


const evtNames = ['click', 'submit'];

import { camelize } from './Map.jsx';

export default class InfoWindow extends React.Component {

  constructor(){
    super()
    this.state={
      status: 0
    }
    this.closeWindow=this.closeWindow.bind(this)
  }

    componentDidMount() {
        this.renderInfoWindow();
      }

    componentDidUpdate(prevProps, prevState) {
        const {google, map} = this.props;
// console.log("In InfoWinfow CDU", prevProps, this.props)
        if (!google || !map) {
          return;
        }
    
        if (map !== prevProps.map) {
          this.renderInfoWindow();
        }
        if (this.props.children !== prevProps.children) {
            this.updateContent();
          }
        if ((this.props.visible !== prevProps.visible) ||
          (this.props.marker !== prevProps.marker)) {
            this.props.visible ?
            this.openWindow() :
            this.closeWindow();
        }
        // if(prevState.text.value !== this.state.text.value){
        //   console.log("UPDATINGGGGGGGGG", prevState.text.value,this.state.text.value);
        //   this.updateContent();
        // }
      }

      updateContent() {
        let content = this.renderChildren();
        // console.log("Update Content", content)

        // content = `<div id="info_content">${content}<button onclick="handleClick()">Save</button></div>`;

        // console.log("After Update New Content", content)

        this.infowindow.setContent(content);
      }

      renderChildren() {
        const {children} = this.props;
        return ReactDOMServer.renderToString(children);
      }

      renderInfoWindow() {
        let {map, google, mapCenter} = this.props;

        if (!google || !google.maps) {
            return;
          }
    
        const iw = this.infowindow = new google.maps.InfoWindow({
          content: 'Hiii'
        });

        // console.log(" iw ", iw)

        // google.maps.event.addListener(iw, 'click', this.handleClick.bind(this))
        google.maps.event.addListener(iw, 'closeclick', this.onClose.bind(this))
        google.maps.event.addListener(iw, 'domready', this.onOpen.bind(this));
      }
      // handleClick(){
      //   console.log("click handled")
      // }
       onOpen() {
         
        // console.log("on open", this.props.children.props.children.props.children.props.text)
        // if (this.props.onOpen) {
        //     this.props.onOpen();
        // }
        const first_text= document.getElementById("text").value
        // console.log("First text", first_text)

        document.getElementById("text").addEventListener('input', function(e){
          document.getElementById('submit').disabled=false;
          // console.log("Changedddddd ", document.getElementById("text").value)
          
        })

        if(document.getElementById("text").disabled === false){ 
        document.getElementById("note").addEventListener('submit', function(e){
          e.preventDefault();
          let _id= document.getElementById("_id").innerHTML
          let text=document.getElementById("text").value
          // console.log(" butttttttttttttttttoon clicked", _id,text,document.getElementById('submit').disabled )
          // let landmark = {
          //  _id : document.getElementById("_id").innerHTML,
          // owner :document.getElementById("owner").innerHTML.replace('@',''),
          // text :document.getElementById("text").value,
          // date :document.getElementById("date").innerHTML.replace('Last updated on : ','') )
          // }
          let landmark_state={
            _id : _id,
            text : text
          }
          if(text !== first_text || document.getElementById('submit').disabled === false){
          fetch(`/api/landmark/${_id}`,{
            method : 'PUT',
            headers : { 'Content-Type' : 'application/json'},
            body: JSON.stringify(landmark_state),
        }).then (response => {
            if(response.ok) {
                response.json().then(updatedLandmark => {
                        updatedLandmark.date = new Date();
                        // console.log("Updated Landmark", updatedLandmark)
                        // alert('Updated issue successfully');
                        // this.props.history.push(`/landmarks`);
                        status='success'
                        console.log("Status",status)
                      });
            } else {
                response.json().then( error => {
                    // alert(`Failed to update issue: ${error.message}`);
                    this.showError(`Failed to update landmark: ${error.message}`);
                });
            }
        }).catch(err => {
            // alert(`Error in sending data to server: ${err.message}`);
            this.showError(`Error in sending data to server: ${err.message}`);
        });
        window.location.reload(false);
      }  
      
      })

      document.getElementById("delete").addEventListener('click', function(e){
        let _id= document.getElementById("_id").innerHTML

            fetch(`/api/landmark/${_id}`, { method : 'delete' }).then(response => {
              if(!response.ok) console.log("Not ok");
              else  window.location.reload(false);
          }).catch(err => {
          })
      })
    }
    }
    
      onClose() {
        // console.log("In onClose", this.props)
        if (this.props.onClose) {
            this.props.onClose();
        }
      }

      openWindow(){
        this.infowindow.open(this.props.map, this.props.marker);
      }
      closeWindow() {
        // console.log("In close Window", this.infowindow)
        this.infowindow.close();
      }
    render() {
      return null;
    }
  }

  InfoWindow.propTypes = {
    children: PropTypes.element.isRequired,
    map: PropTypes.object,
    marker: PropTypes.object,
    visible: PropTypes.bool,
  
    // callbacks
    onClose: PropTypes.func,
    onOpen: PropTypes.func
  }
  
  InfoWindow.defaultProps = {
    visible: false
  }