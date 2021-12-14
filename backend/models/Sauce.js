/* On aurait tendence à penser que les commentaires sont là poul expliquer le code aux développeurs */
/* La vérité c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/* Ce module est le chema des sauces */
/* il sert de blueprint pour les sauces dans la base de données */


/* message gris a cause de ES6 */
const mongoose = require('mongoose');



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
        type: String
    },
    heat: {
        type: Number,
        required: true
    },
    likes: {
        type: Number
    },
    dislikes: {
        type: Number
    },
    usersLiked: {
        type: Array
    },
    usersDisliked: {
        type: Array
    }
});

module.exports = mongoose.model('Sauce', sauceSchema);