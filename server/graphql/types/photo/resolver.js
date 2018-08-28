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
                photoService.uploadPhoto(image, caption, isPrivate);
            },
            editPhoto: async (root, {id, caption, isPrivate}, { photoService }) => {
                photoService.updatePhoto(id, caption, isPrivate);
            },
            deletePhoto: async (root, {id}, { photoService }) => {
                photoService.removePhoto(id);
            },
        },
        Subscription: {
            photoAdded: async (root, args, ctx) => {
                // TODO: handle photoAdded Subscription
            },
            photoEdited: async (root, args, ctx) => {
                // TODO: handle photoEdited Subscription
            },
            photoDeleted: async (root, args, ctx) => {
                // TODO: handle photoDeleted Subscription
            },
        },
    },
};
