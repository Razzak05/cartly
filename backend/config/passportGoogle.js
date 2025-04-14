import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID, // In your .env file
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // In your .env file
        callbackURL: process.env.GOOGLE_CALLBACK_URL, // e.g., http://localhost:5000/api/users/auth/google/callback
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let user = await User.findOne({ email });

          if (user) {
            // If user exists and googleId is not set, update it
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // If user does not exist, create a new user
          user = new User({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            // Note: no password is set for Google users
          });
          await user.save();
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};

export default configurePassport;
