import React from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

export const UPLOAD_PHOTO = gql`
    mutation uploadPhoto($image: Upload!, $caption: String, $isPrivate: Boolean) {
        uploadPhoto(image: $image, caption: $caption, isPrivate: $isPrivate) {
            id
        }
    }
`;

const UploadPhoto = ({ children, variables, onError, onCompleted }) => (
    <Mutation onCompleted={onCompleted} onError={onError} mutation={UPLOAD_PHOTO} variables={variables}>
        {children}
    </Mutation>
);

UploadPhoto.propTypes = {
    onError: PropTypes.func,
    onCompleted: PropTypes.func,
    children: PropTypes.func.isRequired,
};

export default UploadPhoto;