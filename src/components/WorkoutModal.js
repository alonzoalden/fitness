import React, {Component} from 'react';
import { Modal, ModalManager, Effect } from 'react-dynamic-modal';
import { withGoogleMap, GoogleMap, Polyline } from 'react-google-maps';
import BikeMap from './BikeMap.js';
import './WorkoutModal.css';

class WorkoutModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      markers: [{
        position: {
          lat: 25.0112183,
          lng: 121.52067570000001,
        },
        key: `Taiwan`,
        defaultAnimation: 2,
        }],
    }
  }

  componentDidMount() {
    // let decodedPath = google.maps.geometry.encoding.decodePath('asdf');
  }

  render() {
    const { text, onRequestClose } = this.props;
    return (
      <Modal
        onRequestClose={onRequestClose}
        effect={Effect.Fall}>



        <h1>Total kj : {text}</h1>
        <p> work in progress... </p>
        <div style={{height: '200px', width: '200px'}}>
          <BikeMap
            containerElement={
              <div style={{ height: `100%`, width: '100%' }} />
            }
            mapElement={
              <div style={{ height: `100%`, width: '100%' }} />
            }
            markers={this.state.markers}

          />
          </div>




        <button onClick={ModalManager.close}>Close Modal</button>
      </Modal>
    );
  }
};

export default WorkoutModal;