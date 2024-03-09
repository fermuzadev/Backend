
import dotenv from 'dotenv'

export default {
  port: process.env.PORT || 8080,
  env: process.env.ENV,
  db: {
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/jugueteria-mvc',
  },
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  url: process.env.URL_BASE || 'http://localhost',
  github: {
    clientID: process.env.GHCLIENTID,
    clientSecret: process.env.GHCLIENTSECRET,
    callbackURL: process.env.GHCALLBACK
  },
  google: {
    clientID: process.env.CLIENT_GOOGLE_ID,
    clientSecret: process.env.CLIENT_GOOGLE_SECRET,
    callbackURL: process.env.GOOGLECALLBACK
  }
};
