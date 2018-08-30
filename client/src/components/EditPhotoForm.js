import React, { Component } from 'react'
import EditPhoto from '../containers/editPhoto'
import PhotoData from '../containers/photo'
import PhotoForm from './PhotoForm'
import { getLoggedUser } from '../utils';
import './Forms.css'

class EditPhotoForm extends Component {
    render() {
        return (
            <EditPhoto
                onCompleted={() => {
                    this.props.history.push('/');
                    window.location.reload();
                }}
            >
                {(editPhotoMutation, { loading, error }) => (
                    <PhotoData id={this.props.match.params.id}>
                        {({loading, data}) => {
                            if (loading) {
                                return <div>Loading...</div>;
                            }
                            if(!getLoggedUser() || (getLoggedUser()._id !== parseInt(data.photo.owner.id, 10))) {
                                this.props.history.push('/');
                                window.location.reload();
                            }
                            return (
                                <PhotoForm 
                                    photo={data.photo}
                                    externalError={error} 
                                    loading={loading} 
                                    actionName="Update" 
                                    onSubmit={(formFields) => {
                                        editPhotoMutation({variables: formFields})
                                    }} />
                            )
                        }}
                    </PhotoData>
                )}
            </EditPhoto>
        )
    }
}

export default EditPhotoForm;