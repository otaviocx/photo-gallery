# photo-gallery
Just a simple example of how to use Graphql + ReactJS to build a photo-gallery

## Instalation
This project is divided in two: client and server. First install the server by tiping:
```
cd server
npm install
```
Then, install the client by returning to the root folder and tiping:
```
cd client
npm install
```

## Usage
To run the server in development mode you need to type `npm run watch` on the `server` folder. 

To run the client in development mode you need to type `npm run start` on the `client` folder.

## Testing
This project don't have so much automated tests yet. But, if you want to run the automated tests, the command is `npm test` (into the `server` folder). The server uses Mocha to run the tests and Nyc to check coverage. When the tests execution finishes, it generate a `coverage` folder with the coverage reports.

To manually test the subscriptions behavior, you need to start the server and the client and open the client in two different browsers. Then, login with different users in each browser and start uploading, editing and removing some photos. The expected behavior is that the other browser will automatically update the photo's list.
