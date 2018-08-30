import React, { Component } from 'react'
import UploadPhoto from '../containers/uploadPhoto'
import PhotoForm from './PhotoForm'
import './Forms.css'

class NewPhotoForm extends Component {
    render() {
        return (
            <UploadPhoto
                onCompleted={() => {
                    this.props.history.push('/');
                    window.location.reload();
                }}
            >
                {(uploadPhotoMutation, { loading, error }) => (
                    <PhotoForm externalError={error} loading={loading} actionName="Upload" onSubmit={(formFields) => {
                        if (!formFields.caption || !formFields.image) {
                            this.setState({ error: 'The caption and image are required.' });
                            return;
                        }
                        uploadPhotoMutation({variables: formFields})
                    }} />
                )}
            </UploadPhoto>
        )
    }
}

export default NewPhotoForm;