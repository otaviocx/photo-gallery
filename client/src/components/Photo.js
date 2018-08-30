import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PhotoData from '../containers/photo';
import DeletePhoto from '../containers/deletePhoto'
import { getLoggedUser, isLoggedin } from '../utils';
import './Photo.css';


export const PhotoDeleteButton = ({photoId}) => {
    return (
        <DeletePhoto
            onCompleted={() => {
                window.location.reload();
            }}
        >
            {(deletePhotoMutation, { loading, externalError }) => (
                <span>
                    {(externalError) && (
                        <p className="error-message">{externalError.message}</p>
                    )}
                    <button className="small-button" onClick={(e) => {
                        if(window.confirm("Are you sure to delete this photo?")) {
                            deletePhotoMutation({variables: {id: photoId}})
                        }
                    }}>Delete</button>
                </span>
            )}
        </DeletePhoto>
    )
}

export const PhotoActions = ({photo}) => {
    if(isLoggedin() && getLoggedUser()._id === parseInt(photo.owner.id, 10)) {
        return (
            <div>
                <PhotoDeleteButton photoId={photo.id} />
                <Link className="small-button" to={"/edit/"+photo.id}>Edit</Link>
            </div>
        )
    } else {
        return (<div/>)
    }
}

const BASE_WIDTH = 600;

export const PhotoPreview = ({
    width, height, loading, error, data,
}) => {
    if (loading) {
        return (
            <div className="PhotoPreview loading">
                <div className="PhotoPreview-image" style={{ width, height: (height / width) * BASE_WIDTH }}>
                    &nbsp;
                </div>
                <div className="PhotoPreview-metadata">Loading...</div>
            </div>
        );
    }
    if (error) return <div>Error :(</div>;

    const { photo } = data;
    return (
        <div className="PhotoPreview">
            <div
                className="PhotoPreview-image"
                style={{
                    backgroundImage: `url('data:image/jpeg;base64,${photo.image}')`,
                    width: BASE_WIDTH,
                    height: (photo.height / photo.width) * BASE_WIDTH,
                }}
            />
            <div className="PhotoPreview-metadata">
                <div className="PhotoPreview-metadata-owner">
                    Uploaded by <em>{photo.owner.name}</em>
                    {photo.private && <span> (is private)</span>}
                </div>
                {photo.caption && <div className="PhotoPreview-metadata-caption">{photo.caption}</div>}

                <PhotoActions photo={photo} />
            </div>
        </div>
    );
};

PhotoPreview.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error), // eslint-disable-line react/require-default-props
    data: PropTypes.shape({
        photo: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            width: PropTypes.number,
            height: PropTypes.number,
            owner: PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                name: PropTypes.string.isRequired,
            }),
            caption: PropTypes.string,
        }),
    }),
};

PhotoPreview.defaultProps = {
    data: {},
};

export default props => <PhotoData {...props}>{PhotoPreview}</PhotoData>;
