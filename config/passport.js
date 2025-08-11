const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      id: profile.id,
      firstName: profile.name.givenName || '',
      lastName: profile.name.familyName || '',
      email: profile.emails && profile.emails[0]?.value,
      photo: profile.photos && profile.photos[0]?.value
    };
    return done(null, user);
  }
));

module.exports = passport;
