import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './Forms.css'

class PhotoForm extends Component {
    state = {
        id: 0,
        caption: '',
        isPrivate: false,
        image: '',
        error: ''
    }

    componentDidMount() {
        if(this.props.photo) {
            const photo = this.props.photo;
            this.setState({id: photo.id, caption: photo.caption, isPrivate: photo.private })
        }
    }

    render() {
        const { id, caption, isPrivate, image, error } = this.state;
        const { externalError, onSubmit, actionName } = this.props;
        return (
            <form className="bordered-form" onSubmit={(e) => {
                e.preventDefault();
                onSubmit({id, image, caption, isPrivate});
            }}>
            {(externalError || error) && (
                <p className="error-message">{error || externalError.message}</p>
            )}
                <input 
                    name="id"
                    type="hidden"
                    value={id} 
                    onChange={e => this.setState({ id: e.target.value })}
                />
                <label htmlFor="caption">Caption: </label>
                <input 
                    className="text-field" 
                    name="caption" 
                    value={caption} 
                    onChange={e => this.setState({ caption: e.target.value })}
                />
            {actionName === "Upload" && (
                <div>
                    <label htmlFor="image">Image File: </label>
                    <input 
                        className="text-field" 
                        name="image"
                        type="file" 
                        onChange={e => this.setState({ image: e.target.files[0] })}
                    />
                </div>
            )}
                <label htmlFor="isPrivate">
                    <input 
                        name="isPrivate"
                        type="checkbox" 
                        checked={isPrivate} 
                        onChange={e => this.setState({ isPrivate: e.target.checked })}
                    />
                    Is Private
                </label><br/>
                <button type="submit" className="button">{actionName}</button>
            </form>
        )
    }
}

PhotoForm.propTypes = {
    onSubmit: PropTypes.func,
    externalError: PropTypes.object,
    photo: PropTypes.object,
    actionName: PropTypes.string,
    loading: PropTypes.bool,
};

export default PhotoForm;