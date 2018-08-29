import React from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

export const LOGOUT = gql`
    mutation logout {
        logout
    }
`;

const Logout = ({ children, onError, onCompleted }) => (
    <Mutation onCompleted={onCompleted} onError={onError} mutation={LOGOUT}>
        {children}
    </Mutation>
);

Logout.propTypes = {
    onError: PropTypes.func,
    onCompleted: PropTypes.func,
    children: PropTypes.func.isRequired,
};

export default Logout;