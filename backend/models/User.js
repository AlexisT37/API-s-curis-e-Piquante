/* On aurait tendence à penser que les commentaires sont là poul expliquer le code aux développeurs */
/* La vérité c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/* message gris a cause de ES6 */
const mongoose = require('mongoose');

/* validateur pour vérifier que l'utilisateur ne crée 
pas deux fois le même identifiant */
const uniqueValidator = require('mongoose-unique-validator');

/* schéma utilisateur */
const userSchema = mongoose.Schema({

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

/* validateur pour vérifier que l'utilisateur ne crée 
pas deux fois le même identifiant */
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);