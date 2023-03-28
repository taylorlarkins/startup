const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if(!userName) {
   throw Error('Database not configured. Check environment variables');
}
const url = `mongodb+srv://${userName}:${password}@${hostname}`;
const client = new MongoClient(url);
const gallery_collection = client.db('colorgrid').collection('gallery');
const user_collection = client.db('colorgrid').collection('users');

function get_user(username) {
   return user_collection.findOne({username: username});
}

function get_user_by_token(token) {
   return user_collection.findOne({token: token});
}

async function create_user(username, pass) {
   const pass_hash = await bcrypt.hash(pass, 10);
   const user = {
      username: username,
      password: pass_hash,
      token: uuid.v4()
   }
   await user_collection.insertOne(user);
   return user;
}

function add_piece(piece) {
   gallery_collection.insertOne(piece);
}

function get_pieces() {
   //TODO: add restriction on how many pieces come back?
   const pieces = gallery_collection.find();
   return pieces.toArray();
}

module.exports = {add_piece, get_pieces, create_user, get_user, get_user_by_token};