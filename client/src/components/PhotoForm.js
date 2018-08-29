import React, { Component } from 'react'
import UploadPhoto from '../containers/uploadPhoto'
import './Forms.css'

class PhotoForm extends Component {

    state = {
        caption: '',
        isPrivate: false,
        image: '',
        localError: ''
    }

    render() {
        const { caption, isPrivate, image, localError } = this.state;
        return (
            <UploadPhoto
                onCompleted={() => {
                    this.props.history.push('/');
                    window.location.reload();
                }}
            >
                {(uploadPhotoMutation, { loading, error }) => (
                    <form className="bordered-form" onSubmit={(e) => {
                        e.preventDefault();
                        if (!this.state.caption || !this.state.image) {
                            this.setState({ error: 'The caption and image are required.' });
                            return;
                        }
                        uploadPhotoMutation({variables: {image, caption, isPrivate}})
                    }}>
                    {(localError || error) && (
                        <p className="error-message">{localError || error.message}</p>
                    )}
                        <label htmlFor="caption">Caption: </label>
                        <input 
                            className="text-field" 
                            name="caption" 
                            value={caption} 
                            onChange={e => this.setState({ caption: e.target.value })}
                        />
                        <label htmlFor="image">Image File: </label>
                        <input 
                            className="text-field" 
                            name="image"
                            type="file" 
                            onChange={e => this.setState({ image: e.target.files[0] })}
                        />
                        <label htmlFor="isPrivate">
                            <input 
                                name="isPrivate"
                                type="checkbox" 
                                value={isPrivate} 
                                onChange={e => this.setState({ isPrivate: e.target.checked })}
                            />
                            Is Private
                        </label><br/>
                        <button type="submit" className="button">Save</button>
                    </form>
                )}
            </UploadPhoto>
        )
    }
}

export default PhotoForm;