const { PubSub, withFilter } = require('graphql-subscriptions');
const { PHOTO_ADDED, PHOTO_DELETED, PHOTO_EDITED } = require('./PhotoService');
const pubsub = new PubSub();

/* eslint-disable no-underscore-dangle */
module.exports = {
    resolver: {
        Photo: { id: ({ _id }) => _id },
        User: {
            photos: (owner, args, { user, db }) =>
                db.photos
                    .cfind({
                        $and: [
                            { ownerId: owner._id },
                            user
                                ? {
                                    $or: {
                                        $and: { private: true, ownerId: user.id },
                                        private: false,
                                    },
                                }
                                : { private: false },
                        ],
                    })
                    .sort({ createdAt: -1 })
                    .exec(),
        },
        Query: {
            photos: (root, args, { photoService }) =>
                photoService.listPhotos(),
            photo: (root, { id }, { photoService }) =>
                photoService.findOnePhoto(id),
        },
        Mutation: {
            uploadPhoto: async (root, {image, caption, isPrivate}, { photoService }) => {
                const photo = await photoService.uploadPhoto(image, caption, isPrivate);
                pubsub.publish(PHOTO_ADDED, {[PHOTO_ADDED]: photo});
                return photo;
            },
            editPhoto: async (root, {id, caption, isPrivate}, { photoService }) => {
                const photo = await photoService.updatePhoto(id, caption, isPrivate);
                pubsub.publish(PHOTO_EDITED, {[PHOTO_EDITED]: photo});
                return photo;

            },
            deletePhoto: async (root, {id}, { photoService }) => {
                const deleted = await photoService.removePhoto(id);
                if(deleted) {
                    pubsub.publish(PHOTO_DELETED, {[PHOTO_DELETED]: id});
                }
                return deleted;
            },
        },
        Subscription: {
            photoAdded: {
                subscribe: withFilter(
                    () => pubsub.asyncIterator(PHOTO_ADDED),  
                    ({ [PHOTO_ADDED]: photo }, args, { user }) => {
                        if (photo.private) {
                            return user && photoAdded.ownerId === user._id;
                        }
                        return true;
                    },
                ), 
            },
            photoEdited: {
                subscribe: () => pubsub.asyncIterator(PHOTO_EDITED), 
            },
            photoDeleted: {
                subscribe: () => pubsub.asyncIterator(PHOTO_DELETED), 
            },
        },
    },
};
