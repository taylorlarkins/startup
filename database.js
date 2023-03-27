const {MongoClient} = require('mongodb');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if(!userName) {
   throw Error('Database not configured. Check environment variables');
}
const url = `mongodb+srv://${userName}:${password}@${hostname}`;
const client = new MongoClient(url);
const gallery_collection = client.db('colorgrid').collection('gallery');

function add_piece(piece) {
   gallery_collection.insertOne(piece);
}

function get_pieces() {
   //TODO: add restriction on how many pieces come back?
   const pieces = gallery_collection.find();
   return pieces.toArray();
}

module.exports = {add_piece, get_pieces}