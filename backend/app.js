/* On aurait tendence à penser que les commentaires sont là poul expliquer le code aux développeurs */
/* La vériter c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/* message gris a cause de ES6 */
const express = require('express');
const mongoose = require('mongoose');

/* intercepte toutes les requètes qui ont un content type json */
/* met a disposition le contenu de cette requète dans req.body */
const app = express();

const sauceRoutes = require('./routes/routeSauce');
const userRoutes = require('./routes/user');


/* on se connecte a mongoose avec notre compte mongodb */
mongoose.connect('mongodb+srv://hotaru18289:eren14@nodeapi.d5wge.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


/* pour pouvoir utiliser express */
app.use(express.json());


/* headers pour pouvoir autorizer les requetes */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


/* utiliser sauces et auth */
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;