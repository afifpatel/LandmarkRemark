import React from 'react';
import { withRouter } from 'react-router-dom';
import { Nav, NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, 
        ControlLabel, Button, ButtonToolbar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import  qs from 'query-string';
import { connect } from 'react-redux';


@connect( store => {
    return {
        isLoggedIn : store.isLoggedIn,
        username : store.username,
        location : store.location,
        landmarks : store.landmarks
    };
  })

class LandmarkAddNavItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation : {
                lat : null,
                lng: null
            },
        showing: false,
        toastVisible: false, toastMessage: '', toastType: 'success',
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.submit = this.submit.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
    }
    
    componentDidMount() {
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = pos.coords;
                this.setState({
                    currentLocation: {
                        lat: coords.latitude,
                        lng: coords.longitude
                    }
                })
            },
            (error) => console.log(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 2000, maximumAge: 2000 }
)
        }
  }


    showModal() {
        // console.log("show")
        this.setState({ showing: true });
    }
    hideModal() {
        // console.log("Hideeeeeeeeeeeeeeee")
        this.setState({ showing: false });
    }
    
    showError(message) {
        this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
    }
    dismissToast() {
        this.setState({ toastVisible: false });
    }

    submit(e) {
        e.preventDefault();
        this.hideModal();
        const form = document.forms.landmarkAdd;
        const newLandmark = {
            owner: this.props.username, 
            location: {
                lat : this.state.currentLocation.lat,
                lng : this.state.currentLocation.lng
            },
            text: form.text.value,
            date: new Date(),
        };

        fetch('/api/landmark', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLandmark),
        }).then(response => {
            if (response.ok) {
                response.json().then(updatedIssue => {
                this.props.history.push(`/landmark/${updatedIssue.new_landmark._id}`);
            });
            } else {
                response.json().then(error => {
                this.showError(`Failed to add issue: ${error.message}`);
            });
    }
    }).catch(err => {
            this.showError(`Error in sending data to server: ${err.message}`);
    });
    }
    render() {
        // console.log("showing------> ",this.state.showing)
        // let current_pos=null;
        
        // console.log("showing------> ",this.current_pos)


        return (
            <div onKeyDown={e => e.stopPropagation()} >
                {/* <Button onClick={this.showModal}><Glyphicon glyph="plus" /> Create Issue</Button> */}
                <span onClick={this.showModal}><Glyphicon glyph="plus" /> Create Landmark</span>
                <Modal show={this.state.showing} onHide={this.hideModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Landmark</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form name="landmarkAdd">
                                <FormGroup>
                                    <ControlLabel>Owner</ControlLabel>
                                    <FormControl.Static style={{color : '#4da6ff'}}>{this.props.username}</FormControl.Static>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Latitude</ControlLabel>
                                    <FormControl.Static style={{color : '#4da6ff'}}>{this.state.currentLocation.lat}</FormControl.Static>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Longitude</ControlLabel>
                                    <FormControl.Static style={{color : '#4da6ff'}}>{this.state.currentLocation.lng}</FormControl.Static>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Note</ControlLabel>
                                    <FormControl name="text" componentClass="textarea" placeholder="Enter Note..." />
                                </FormGroup>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <ButtonToolbar>
                                <Button type="button" bsStyle="primary"  onClick={this.submit}>Submit</Button>
                                <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
                            </ButtonToolbar>
                        </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

LandmarkAddNavItem.propTypes = {
    router: PropTypes.object,
};

export default withRouter(LandmarkAddNavItem);