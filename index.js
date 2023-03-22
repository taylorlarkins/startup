const express = require('express');
const app = express();

// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// IMPLEMENT ENDPOINTS _-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

// Endpoints to implement:
// -getArtwork
// -uploadArtwork
// -createUser
// -getUser
// -login
// -logout

// _-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

// Return the application's default page if the path is unknown
app.use((_req, res) => {
   res.sendFile('index.html', { root: 'public' });
 });
 
 app.listen(port, () => {
   console.log(`Listening on port ${port}`);
 });
