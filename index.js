const express = require('express');
const app = express();
const DB = require('./database.js');

// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

//GetGallery
apiRouter.get('/gallery', async (_req, res) => {
  const gallery = await DB.get_pieces();
  res.send(gallery); 
});

//UploadPiece
apiRouter.post('/newpiece', async (req, res) => {
  DB.add_piece(req.body);
  const gallery = await DB.get_pieces();
  res.send(gallery); 
})

//CreateUser

//GetUser

//Login

//Logout

// Return the application's default page if the path is unknown
app.use((_req, res) => {
   res.sendFile('index.html', { root: 'public' });
});
 
app.listen(port, () => {
   console.log(`Listening on port ${port}`);
});