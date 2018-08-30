import React from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

export const EDIT_PHOTO = gql`
    mutation editPhoto($id: ID!, $caption: String, $isPrivate: Boolean) {
        editPhoto(id: $id, caption: $caption, isPrivate: $isPrivate) {
            id
        }
    }
`;

const EditPhoto = ({ children, variables, onError, onCompleted }) => (
    <Mutation onCompleted={onCompleted} onError={onError} mutation={EDIT_PHOTO} variables={variables}>
        {children}
    </Mutation>
);

EditPhoto.propTypes = {
    onError: PropTypes.func,
    onCompleted: PropTypes.func,
    children: PropTypes.func.isRequired,
};

export default EditPhoto;