import React from 'react';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = createUploadLink({ uri: 'http://localhost:3001/graphql' });

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const cache = new InMemoryCache();
const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache
});
  

export const withApolloClient = App => (
    <ApolloProvider client={apolloClient}>
        <App />
    </ApolloProvider>
);

export default apolloClient;
