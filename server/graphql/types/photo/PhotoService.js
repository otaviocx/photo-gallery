const { ForbiddenError } = require('apollo-server');
const sizeOf = require('buffer-image-size');

function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream
        .on('error', reject)
        .on('data', (chunk) => chunks.push(chunk))
        .on('end', () => resolve(Buffer.concat(chunks)));
    });
}
  
function getUserPermittedPhotosQuery(user) {
    return user
      ? { $or: [
            { $and: [
                { private: true },
                { ownerId: parseInt(user._id, 10) },
            ] },
            { private: false },
        ]}
      : { private: false };
}

/**
 * The Photo Service is responsible for quering and persist photos according to the needed permissions.
 */
class PhotoService {
    constructor(photoRepository, loggedUser) {
        this.photoRepository = photoRepository;
        this.loggedUser = loggedUser;
    }

    /**
     * Validates if the logged user is the owner of the given photo.
     * @param {*} photo The photo to check permission
     */
    _validateOwner(photo) {
        if (photo.ownerId !== this.loggedUser._id) {
            throw new ForbiddenError('only the owner can update the photo.');
        }
    }

    /**
     * List all photos that the logged user has permission to see.
     */
    async listPhotos() {
        return await this.photoRepository.list({
            query: getUserPermittedPhotosQuery(this.loggedUser),
            sort: {createdAt: -1}
        });
    }

    /**
     * Find the image and data of a photo by id.
     */
    async findOnePhoto(id) {
        return await this.photoRepository.findOne({ $and: [
            { _id: parseInt(id, 10) }, 
            getUserPermittedPhotosQuery(this.loggedUser)
        ]});
    }

    /**
     * Upload a new photo to the logged user's gallery.
     */
    async uploadPhoto(image, caption = '', isPrivate = false) {
        const imageObj = await image;
        const imageBuffer = await streamToBuffer(imageObj.stream);
        const imageBase64 = imageBuffer.toString('base64');
        const dimensions = sizeOf(imageBuffer);

        return await this.photoRepository.insert({
            caption,
            ownerId: this.loggedUser._id,
            private: isPrivate,
            image: imageBase64,
            width: dimensions.width,
            height: dimensions.height,
            createdAt: new Date(),            
        });
    }

    /**
     * Edit the data and image of an existing photo.
     * Just the owner of the photo can do that.
     */
    async updatePhoto(id, caption = null, isPrivate = null) {
        const photo = await this.photoRepository.findById(parseInt(id));
        this._validateOwner(photo);

        const newPhoto = { 
            ...photo,
            ...caption !== null && {caption},
            ...isPrivate !== null && {private: isPrivate} 
        };

        return await this.photoRepository.update(id, newPhoto);        
    }

    /**
     * Remove a photo by id.
     * Just the owner of the photo can do that.
     */
    async removePhoto(id) {
        const photo = await this.photoRepository.findById(id);
        this._validateOwner(photo);

        return await this.photoRepository.remove(id);
    }
}

const PHOTO_ADDED = 'photoAdded';
const PHOTO_EDITED = 'photoEdited';
const PHOTO_DELETED = 'photoDeleted';

module.exports = { 
    PhotoService,
    PHOTO_ADDED,
    PHOTO_EDITED,
    PHOTO_DELETED, 
}