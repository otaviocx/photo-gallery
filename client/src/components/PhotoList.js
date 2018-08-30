import React, { Component } from 'react'
import PropTypes from 'prop-types';
import AllPhotos from '../containers/allPhotos';
import Photo from './Photo';
import {PHOTO_ADDED, PHOTO_DELETED, PHOTO_EDITED} from '../containers/subscriptions';
import { getLoggedUser } from '../utils';

function addPhoto(prev, newPhoto) {
    let newList = {...prev};
    newList.photos = [newPhoto].concat(newList.photos);
    return newList;
}

function deletePhoto(prev, photoId) {
    let newList = {...prev};
    newList.photos = newList.photos.filter((photo) => {
        return photo.id !== photoId
    });
    return newList;
}

function checkUserPermission(user, photo) {
    if(!photo.private) {
        return true;
    }
    if(!user) {
        return false;
    }
    if(user.id === photo.ownerId) {
        return true;
    }
    return false;
}

class PhotoListInner extends Component {

    componentDidMount() {
        this.subscriveToAddedPhotos(this.props.subscribeToMore);
        this.subscriveToDeletedPhotos(this.props.subscribeToMore);
        this.subscriveToEditedPhotos(this.props.subscribeToMore);
    }

    async subscriveToAddedPhotos(subscribeToMore) {
        subscribeToMore({
            document: PHOTO_ADDED,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                return addPhoto(prev, subscriptionData.data.photoAdded);
            }
        })
    }

    async subscriveToDeletedPhotos(subscribeToMore) {
        subscribeToMore({
            document: PHOTO_DELETED,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                return deletePhoto(prev, subscriptionData.data.photoDeleted);
            }
        })
    }

    async subscriveToEditedPhotos(subscribeToMore) {
        subscribeToMore({
            document: PHOTO_EDITED,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const photo = subscriptionData.data.photoEdited;
                var newList = deletePhoto(prev, photo.id);
                if(checkUserPermission(getLoggedUser(), photo)) {
                    newList = addPhoto(newList, photo);
                }
                return newList;
            }
        })
    }

    render () {
        const { loading, error, data } = this.props;

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error :(</div>;

        return (
            <div className="PhotoList">
                {data.photos.map(photo => <Photo key={photo.id} id={photo.id} width={photo.width} height={photo.height} />)}
            </div>
        );
    }
}

PhotoListInner.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error), // eslint-disable-line react/require-default-props
    data: PropTypes.shape({
        photos: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            width: PropTypes.number,
            height: PropTypes.number,
        })),
    }),
};

PhotoListInner.defaultProps = {
    data: {},
};

export default () => <AllPhotos>{(props) => <PhotoListInner {...props} />}</AllPhotos>;
