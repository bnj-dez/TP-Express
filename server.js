import dotenv from "dotenv";
import express from "express";
import session from 'express-session';
import flash from "connect-flash";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from 'mongoose';

import route from "./routes/routes.js";
import isAuthenticated from "./utils/auth.js";
import DashboardController from "./controllers/dashboard.js"

// ==========
// App initialization
// ==========

dotenv.config();
const { APP_HOSTNAME, APP_PORT, NODE_ENV, MONGOOSE_STRING } = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();


await mongoose.connect(MONGOOSE_STRING);

app.set("view engine", "pug");
app.locals.pretty = (NODE_ENV !== 'production'); // Indente correctement le HTML envoyé au client (utile en dev, mais inutile en production)

// ==========
// App middlewares
// ==========


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  name: 'user',
  secret: process.env['SECRET'],
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flash_success = req.flash("success");
  res.locals.flash_errors = req.flash("errors");
  res.locals.register = {
    lastName: req.session.lastName,
    firstName: req.session.firstName,
    email: req.session.email,
  };
  next();
});
// ==========
// App routers
// ==========

app.use("/", route);

app.use(isAuthenticated);

app.get('/dashboard', DashboardController)


// ==========
// App start
// ==========

app.listen(APP_PORT, () => {
  console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`);
});
