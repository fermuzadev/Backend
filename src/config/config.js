
import dotenv from 'dotenv'

let pathEnvFile = null;
if (process.env.ENV === 'production') {
    pathEnvFile = './.env.production'
    console.log(pathEnvFile)
} else {
    pathEnvFile = './.env.development'
}
dotenv.config({ path: pathEnvFile })

export default {
    port: process.env.PORT,
    env: process.env.ENV,
    db: {
        mongodbUri: process.env.MONGODB_URI,
    },
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    url: process.env.URL_BASE,
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
