import React, {Component} from 'react';
import { Modal, ModalManager, Effect } from 'react-dynamic-modal';
import './WorkoutModal.css';

class WorkoutModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }

  render() {
    const { text, onRequestClose } = this.props;
    return (
      <Modal
        onRequestClose={onRequestClose}
        effect={Effect.Newspaper}>
        <h1>What you input : {text}</h1>
        <button onClick={ModalManager.close}>Close Modal</button>
      </Modal>
    );
  }
};

export default WorkoutModal;