/* On aurait tendence à penser que les commentaires sont là poul expliquer le code aux développeurs */
/* La vérité c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/* message gris a cause de ES6 */
const express = require('express');
const mongoose = require('mongoose');
/* helmet pour la sécurité de l'application */
const helmet = require('helmet');

/* intercepte toutes les requètes qui ont un content type json */
/* met a disposition le contenu de cette requète dans req.body */
const app = express();

/* importer les routes */
const sauceRoutes = require('./routes/routeSauce');
const userRoutes = require('./routes/user');

/* on utilise mongo-sanitize pour empêcher les injections de query selector */
const mongoSanitize = require('express-mongo-sanitize');

/* importer express-rate-limit pour limiter le nombre de requêtes dans une période donnée */
const rateLimit = require("express-rate-limit");


/* importer le module path pour les images */
const path = require('path');

/* import de dotenv pour la connection a mongoose */
require('dotenv').config();


/* on a une limite de 100 requêtes dans une période de 15 minutes */
const limiter = rateLimit({
    /* minutes * secondes * milisecondes */
    windowMs: 15 * 60 * 1000, // 15 minutes

    /* on configure le nombre de requêtes autorisées par windowMs, ici 100 */
    max: 100 // limit each IP to 100 requests per windowMs
});


/* on se connecte a mongoose avec notre compte mongodb */
/* on utilise .env pour ne pas avoir le code dans github */
mongoose.connect(
        process.env.SECRET_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


/* pour pouvoir utiliser express */
app.use(express.json());

/* utiliser le limiteur de 100 requêtes pour 15 minutes  */
app.use(limiter);

/* app.js va utiliser express mongo sanitize */
app.use(mongoSanitize());

/* headers pour pouvoir autorizer les requetes */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/* utilisation de helmet par l'app */
app.use(helmet());

/* utiliser le chemin des images car on a besoin de l'app.js pour traiter les images */
/* sinon il y a une erreur 404 */
app.use('/images', express.static(path.join(__dirname, 'images')));

/* utiliser sauces et auth */
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;