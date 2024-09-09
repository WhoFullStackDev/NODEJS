const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require("cookie-parser");
const { cookieExtractor, sanitizeUser } = require("./common");
const path = require("path");
const authRoute = require("./routes/auth");
const { User } = require("./model/User");

const app = express();

// JWT options

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = "Hello";

app.use(cookieParser());
app.use(
  session({
    secret: "Hello",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
app.use(passport.authenticate("session"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", authRoute.router);
app.get("/", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "invalid credentials" }); // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), "Hello");
          done(null, { id: user.id, role: user.role, token }); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

async function main() {
  await mongoose.connect(
    "mongodb+srv://kingsuk055:5KsD61vVvqe4spkJ@cluster0.z1qag.mongodb.net/"
  );
}

main();

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
