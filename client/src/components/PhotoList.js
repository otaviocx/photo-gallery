import React from 'react';
import PropTypes from 'prop-types';
import AllPhotos from '../containers/allPhotos';
import Photo from './Photo';
import {PHOTO_ADDED, PHOTO_DELETED} from '../containers/subscriptions';

const subscriveToAddedPhotos = async (subscribeToMore) => {
    subscribeToMore({
        document: PHOTO_ADDED,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newPhoto = subscriptionData.data.photoAdded;
            let newList = {...prev};
            newList.photos = [newPhoto].concat(newList.photos);
            console.log("add");
            console.log(newList);
            return newList;
        }
    })
}

const subscriveToDeletedPhotos = async (subscribeToMore) => {
    subscribeToMore({
        document: PHOTO_DELETED,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const deletedId = subscriptionData.data.photoDeleted;
            let newList = {...prev};
            newList.photos = newList.photos.filter((photo) => {
                return photo.id !== deletedId
            });
            console.log("delete");
            console.log(newList);
            return newList;
        }
    })
}

const PhotoListInner = ({ loading, error, data, subscribeToMore }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error :(</div>;
    if(!PhotoListInner.prototype.subscribed) {
        PhotoListInner.prototype.subscribed = true;
        subscriveToAddedPhotos(subscribeToMore);
        subscriveToDeletedPhotos(subscribeToMore);
    }

    return (
        <div className="PhotoList">
            {data.photos.map(photo => <Photo key={photo.id} id={photo.id} width={photo.width} height={photo.height} />)}
        </div>
    );
};

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

export default () => <AllPhotos>{PhotoListInner}</AllPhotos>;
