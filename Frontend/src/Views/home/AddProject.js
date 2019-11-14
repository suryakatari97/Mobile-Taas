import React, { Component, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class AddProject extends Component {
     
    render(){
        if(!this.props.modal){
            return null
        }
    const closeBtn = <button className="close" onClick={() => this.props.toggle()}>&times;</button>;

    return (
        <div>
            <Modal isOpen={this.props.modal} toggle={() => this.props.toggle()} className='modal-popup' scrollable>
                <ModalHeader toggle={() => this.props.toggle()} close={closeBtn}>Add New Project Here</ModalHeader>
                <ModalBody className="modal-body">
                    <form>
                        <div className="form-group">
                            <h4 className="font-weight-bold">PROJECT TITLE: </h4><br/>
                            <input onChange = {this.props.handleTitleChange} name = 'projectTitle' className = 'form-control' type = 'text' required></input><br/><br/>
                        </div>
                        <div className="form-group">
                            <h4 className="font-weight-bold" >PROJECT DESCRIPTION: </h4><br/>
                            <textarea onChange = {this.props.handleDescChange} name = 'projectDesc' className="form-control" id="exampleFormControlTextarea1"  rows="5" required></textarea>
                        </div>
                        <div className="form-group">
                            <h4 className="font-weight-bold" >PROJECT URL: </h4><br/>
                            <input onChange = {this.props.handleURLChange} name = 'projectTitle' className = 'form-control' type = 'text' required></input><br/><br/>
                        </div>
                        <button type ='submit' onClick = {() => this.props.AddNewProject()} className = 'btn btn-primary'>Submit</button>
                    </form>
                </ModalBody>
                <ModalFooter>

                    <Button color="secondary" onClick={() => this.props.toggle()}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
}

export default AddProject;