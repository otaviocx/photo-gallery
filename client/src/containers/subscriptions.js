import gql from 'graphql-tag';

export const PHOTO_ADDED = gql`
  subscription onPhotoAdded {
    photoAdded {
      id
      width
      height
    }
  }
`;

export const PHOTO_EDITED = gql`
  subscription onPhotoAdded {
    photoEdited {
      id
      width
      height
      private
      ownerId
    }
  }
`;

export const PHOTO_DELETED = gql`
  subscription onPhotoEdited {
    photoDeleted
  }
`;