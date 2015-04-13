import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import routes from './routes/coreroutes';

const server = express(),
    PORT = 9000;

server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: true
}));

server.use( express.static( path.join(__dirname, 'public') ) );
server.set( 'views', path.join( __dirname, 'views') );
server.set('view engine', 'ejs');

routes(server);

server.get('*', (req, res) => {
  res.json({
    "route": "Sorry this page does not exist!"
  });
});

server.listen(PORT, () => {
  console.log('Server started, listening on port:', PORT);
});

export default server;