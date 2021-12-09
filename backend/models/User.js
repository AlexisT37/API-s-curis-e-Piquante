/* On aurait tendence à penser que les commentaires sont là poul expliquer le code aux développeurs */
/* La vériter c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/* message gris a cause de ES6 */
const mongoose = require('mongoose');

/* validateur pour vérifier que l'utilisateur ne crée 
pas deux fois le même identifiant */
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    /* schéma utilisateur */
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(uniqueValidator);
/* validateur pour vérifier que l'utilisateur ne crée 
pas deux fois le même identifiant */

module.exports = mongoose.model('User', userSchema);