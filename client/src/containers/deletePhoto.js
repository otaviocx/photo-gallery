import React from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

export const DELETE_PHOTO = gql`
    mutation deletePhoto($id: ID!) {
        deletePhoto(id: $id)
    }
`;

const DeletePhoto = ({ children, variables, onError, onCompleted }) => (
    <Mutation onCompleted={onCompleted} onError={onError} mutation={DELETE_PHOTO} variables={variables}>
        {children}
    </Mutation>
);

DeletePhoto.propTypes = {
    onError: PropTypes.func,
    onCompleted: PropTypes.func,
    children: PropTypes.func.isRequired,
};

export default DeletePhoto;