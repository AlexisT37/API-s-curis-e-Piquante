/* On aurait tendence à penser que les commentaires sont là poul expliquer le code aux développeurs */
/* La vériter c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/* Ce module est le chema des sauces */
/* il sert de blueprint pour les sauces dans la base de données */


/* message gris a cause de ES6 */
const mongoose = require('mongoose');
/* importer app.js */
const app = require('../app');

/* const listen pour ecouter */
//todo trouver origine listen███████████████████████████████████████████████████████


// const {
//     listen
// } = require('../app');

/* schéma des sauces */
const sauceSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainPepper: {
        type: String,
        required: true
    },
    imageUrl: {
        String,
        required: false
    },
    heat: {
        type: Number,
        required: false
    },
    likes: {
        type: Number,
        required: false
    },
    dislikes: {
        type: Number,
        required: false
    },
    usersLiked: {
        type: String,
        required: false
    },
    usersDisliked: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Sauce', sauceSchema);