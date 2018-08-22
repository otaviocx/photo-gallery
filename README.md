# Mudano Engineering Assessment

## Photo Sharing System

### Context

People at Mudano often do interesting things in their spare time or when they go on holiday. When they return they like to share photos of their adventures. We would like you to develop a basic single page application to allow sharing photos, along with a basic caption, that anyone in the company can use to view and add photos.

### Functional Requirements

 - The user must be able to upload an image along with a brief caption for that image.
 - Images must either be public or private.
 - The user must be able to view all existing images along with their caption. Only public images or private images the user added must be displayed.
 - The user must be able to delete their existing images. The user must not be able to delete images they did not add.
 - Different users should be able to login to the application.
 - All data added must be persistent, such that the server and browser can be restarted without any loss of data.
 - The images displayed could update in real-time as new images are added.

### Boilerplate

To cut down the time taken to set this project up, we have provided you with a boilerplate for both the client and server. You may use either `npm` or `yarn` to install dependencies.

#### Server

 - We have provided a sample [apollo-server][apollo-server] backend, with most of the GraphQL resolvers stubbed out. We've provided a couple of examples to get you started.
 - While we tend to use relational databases at Mudano, the backend for this assignment uses [nedb-promise][nedb-promise], in order to make the application portable and simpler to get started with.
 - We have provided a simple seeder for this database; simply run `yarn db seed test` (or `npm run db seed test`) from the server directory to get started.

#### Client

 - We have also provided a sample frontend which implements the ability to view a list of all photos.
 - This boilerplate is based around [create-react-app][cra] and [apollo-boost][apollo-boost].

### Technology Requirements

 - You may use any libraries you wish within your solution, but beware that using *too* many 3rd-party libraries may prevent you from showing off your skills!
 - You are welcome to replace any of the boilerplate if you prefer; the technology choices are not prescriptive, and are merely intended to give you a headstart on your solution.

### Submission

 - Submit your code in any format you wish. Your source code must be provided.
 - Your solution should be a functioning MVP.
 - You do not need to host your code or application anywhere. All that is required is that we can install and run it locally.
 - Please provide proof, along with a brief explanation, of how you tested the application while you were developing.

[cra]: https://github.com/facebook/create-react-app
[apollo-boost]: https://github.com/apollographql/apollo-client/tree/master/packages/apollo-boost
[apollo-server]: https://github.com/apollographql/apollo-server
[nedb-promise]: https://github.com/jrop/nedb-promise
