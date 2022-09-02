// ====================================================== //
// ================= Import all packages ================ //
// ====================================================== //
const config = require("./config/config.js");
const vhost = require("vhost");
const connect = require("connect");
const express = require("express");
const helmet = require('helmet');
const minifyHTML = require("express-minify-html");
const serveStatic = require("serve-static");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// ====================================================== //
// ===== Create express app and connect middleware ====== //
// =======================================================//
const app = express();
const con = connect();

// ====================================================== //
// =================== Express configs ================== //
// ====================================================== //
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('', `domain=${config.domain.domain}`));
app.use(compression());
app.set("view engine", "ejs");
app.use(
    minifyHTML({
        override: true,
        exception_url: false,
        htmlMinifier: {
            removeComments: false, // Dont remove the comments from our EJS pages
            collapseWhitespace: true, // Removes all spaces
            collapseBooleanAttributes: true, // Reduces true & false statements
            removeAttributeQuotes: false, // Remove attribute quotes
            removeEmptyAttributes: true, // Remove empty attributes
            minifyJS: true, // Reduce/Minify JS
        },
    })
);
app.use(
    session({
        secret: config.system.session.secret,
        name: config.system.session.name,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(
    helmet.permittedCrossDomainPolicies({
        permittedPolicies: "all",
    })
);
app.use(helmet.xssFilter());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "script-src": ["'self'", `${config.domain.subdomain.cdn}.${config.domain.domain}`, "'unsafe-inline'", "'unsafe-eval'"],
            "style-src": ["'self'", `${config.domain.subdomain.cdn}.${config.domain.domain}`, "'unsafe-inline'", "'unsafe-eval'"],
            "img-src": ["'self'", `${config.domain.subdomain.cdn}.${config.domain.domain}`],
            "default-src": ["'self'", `${config.domain.subdomain.app}.${config.domain.domain}`, `${config.domain.subdomain.api}.${config.domain.domain}`, "'unsafe-inline'", "'unsafe-eval'"]
        },
    })
);
// ====================================================== //
// ============== Add Session to front  ================= //
// ====================================================== //

app.use(function(req, res, next) {
    res.setHeader("x-powered-by", " ⭐ Powered By Magic 🦄 ");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

// ====================================================== //
// ============== Setup connect middleware ============== //
// ====================================================== //

const apiConnect = connect();
const frontConnect = connect();
const cdnConnect = connect();

// ====================================================== //
// =============== Create route middleware ============== //
// ====================================================== //

apiConnect.use(require("./router/api.js"));
frontConnect.use(require("./router/front.js"));
cdnConnect.use(serveStatic("./public"));

// ====================================================== //
// ==== Execute express middleware (express configs) ==== //
// ====================================================== //
con.use(app);

// ====================================================== //
// ======== Execute express middleware (vhost) ========== //
// ====================================================== //

con.use(
    vhost(
        config.links.api.substring(config.links.api.lastIndexOf("/") + 1),
        apiConnect
    )
);
con.use(
    vhost(
        config.links.cdn.substring(config.links.cdn.lastIndexOf("/") + 1),
        cdnConnect
    )
);

// ====================================================== //
// ======== Execute express middleware (front)  ========= //
// ====================================================== //
con.use(frontConnect);

app.get("*", (req, res, next) => {
    next();
});

// ====================================================== //
// =================== Listen on port =================== //
// ====================================================== //
con.listen(config.system.port, () => {
    console.log(`Domain: ${config.domain.domain}`);
    console.log(`Protocol: ${config.domain.protocol}`);
    console.log(`Port: ${config.system.port}`);
    console.log('\nServer running...')
});