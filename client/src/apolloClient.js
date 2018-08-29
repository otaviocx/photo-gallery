import React from 'react';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { getToken } from './utils';

const HOST = "localhost:3001"

const httpLink = createUploadLink({ uri: "http://"+HOST+"/graphql" });

const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
        headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const wsLink = new WebSocketLink({
    uri: 'ws://'+HOST+'/subscriptions',
    options: {
        reconnect: true
    },
});
  
const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    authLink.concat(httpLink)
)

const cache = new InMemoryCache();
const apolloClient = new ApolloClient({
    link,
    cache
});
  

export const withApolloClient = App => (
    <ApolloProvider client={apolloClient}>
        <App />
    </ApolloProvider>
);

export default apolloClient;
