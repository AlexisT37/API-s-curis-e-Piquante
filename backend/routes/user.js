/* On aurait tendence à penser que les commentaires sont là poul expliquer le code aux développeurs */
/* La vériter c'est que le code est là pour expliquer les commentaires à l'ordinateur */

const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

/* route pour créer un compte */
router.post('/signup', userCtrl.signup);
/* route pour se connecter */
router.post('/login', userCtrl.login);

module.exports = router;