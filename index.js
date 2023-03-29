const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const DB = require('./database.js');
const express = require('express');

const app = express();

const authCookieName = 'token';

// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

//CreateUser
apiRouter.post('/auth/create', async (req, res) => {
  if(await DB.get_user(req.body.username)) {
    res.status(409).send({msg: 'Existing user!'});
  } else {
    const user = await DB.create_user(req.body.username, req.body.password);
    setAuthCookie(res, user.token);
    res.send({id: user._id});
  }
})

//Login
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.get_user(req.body.username);
  if(user) {
    if(await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({id: user._id});
      return;
    }
  } 
  res.status(401).send({msg: 'Unauthorized'});
})

//Logout
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
})

//GetUserInfo
apiRouter.get('/user/:username', async (req, res) => {
  const user = await DB.get_user(req.params.username);
  if(user) {
    const token = req?.cookies.token;
    res.send({username: user.username, authenticated: token === user.token});
    return;
  }
  res.status(404).send({msg: 'Unknown'});
})

//SECURE ENDPOINTS -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const user = await DB.get_user_by_token(req.cookies[authCookieName]);
  if(user) {
    next();
  } else {
    res.status(401).send({msg: 'Unauthorized'})
  }
})

//GetGallery
secureApiRouter.get('/gallery', async (_req, res) => {
  const gallery = await DB.get_pieces();
  res.send(gallery); 
});

//UploadPiece
secureApiRouter.post('/newpiece', async (req, res) => {
  await DB.add_piece(req.body);
  const gallery = await DB.get_pieces();
  res.send(gallery); 
})

//END SECURE ENDPOINTS -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

// Return the application's default page if the path is unknown
app.use((_req, res) => {
   res.sendFile('index.html', { root: 'public' });
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}
 
app.listen(port, () => {
   console.log(`Listening on port ${port}`);
});