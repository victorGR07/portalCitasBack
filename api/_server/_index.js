import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import express from 'express';
import timeout from 'connect-timeout';
import routes from '../assets/routes/_index';
import {ContextMiddleware} from '../assets/middlewares/context.middleware'
import {ErrorMiddleware} from '../assets/middlewares/error.middleware'


process.on('unhandledRejection', error => {
  console.error('--> unhandledRejection::', error);
});

process.on('uncaughtException', error => {
  console.error('--> uncaughtException::', error);
});


const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV == 'DEV') {
    }
    return callback(null, true);
  },
  credentials: true
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(process.cwd(), '/views'));
app.use('/public', express.static(path.join(process.cwd(), '/public')));

app.use(timeout(300000));

app.use('/', routes);

import resolvers from '../resolvers/_index';
import typeDefs from '../types/_index';
import { INFO } from '../assets/configs/info';

const GQL_SERVER = new ApolloServer({
  typeDefs,
  resolvers,
  playground: process.env.NODE_ENV === 'DEV',
  context: ContextMiddleware.centralize,

 formatError: ErrorMiddleware.getInstance('gql')
});

GQL_SERVER.applyMiddleware({
  app,
  path: '/api',
  cors: corsOptions
});

app.use((request, response, next) => {
  response.status(301).redirect('/');
});

app.listen(process.env.PORT, () => {
  console.log(
    `ws.citas.proveedor is starting now in http://localhost:${process.env.PORT}/api
    version: ${INFO.version}`
  );
});
