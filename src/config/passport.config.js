import passport from "passport";
import {Strategy as JWTStrategy, ExtractJwt} from "passport-jwt";
import dotenv from 'dotenv';

dotenv.config();

function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.access_token;
    }
    return token;
}
export const init = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    }, (payload, done) => {
        return done(null, payload)
    }))
}