import React from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

export const REGISTER = gql`
    mutation register($username: String!, $password: String!) {
        register(username: $username, password: $password)
    }
`;

const Register = ({ children, variables, onError, onCompleted }) => (
    <Mutation onCompleted={onCompleted} onError={onError} mutation={REGISTER} variables={variables}>
        {children}
    </Mutation>
);

Register.propTypes = {
    onError: PropTypes.func,
    onCompleted: PropTypes.func,
    children: PropTypes.func.isRequired,
};

export default Register;