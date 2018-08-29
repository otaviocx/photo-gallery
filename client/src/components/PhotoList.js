import React, { Component } from 'react'
import PropTypes from 'prop-types';
import AllPhotos from '../containers/allPhotos';
import Photo from './Photo';
import {PHOTO_ADDED, PHOTO_DELETED} from '../containers/subscriptions';

class PhotoListInner extends Component {

    componentDidMount() {
        this.subscriveToAddedPhotos(this.props.subscribeToMore);
        this.subscriveToDeletedPhotos(this.props.subscribeToMore);
    }

    async subscriveToAddedPhotos(subscribeToMore) {
        subscribeToMore({
            document: PHOTO_ADDED,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newPhoto = subscriptionData.data.photoAdded;
                let newList = {...prev};
                newList.photos = [newPhoto].concat(newList.photos);
                return newList;
            }
        })
    }

    async subscriveToDeletedPhotos(subscribeToMore) {
        subscribeToMore({
            document: PHOTO_DELETED,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const deletedId = subscriptionData.data.photoDeleted;
                let newList = {...prev};
                newList.photos = newList.photos.filter((photo) => {
                    return photo.id !== deletedId
                });
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
