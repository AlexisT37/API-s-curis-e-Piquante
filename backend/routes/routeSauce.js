/* On aurait tendence à penser que les commentaires sont là poul expliquer le code aux développeurs */
/* La vériter c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/* ce module sert a établir la liste des routes pour notre application */
/* il contient les routes pour le CRUD des sauces. */
/* l'autre module, user.js est pour le CRUD des utilisateurs */

/* message gris a cause de ES6 */
const express = require('express');

/* importer auth afin de sécuriser les routes */
const auth = require('../middleware/auth');

/* importer multer afin de gérer l'upload des images */
const multer = require('../middleware/multer-config');


/* fonction router de express */
/* instance d'objet de middlewares et de routes */
/* https://expressjs.com/en/4x/api.html#router */
const router = express.Router();

/* import des middlewares dans le controller */
/* ils contiennent la logique metier des routes */
const sauceCtrl = require('../controllers/controlSauce');


/* routes pour le CRUD avec une implantation modulaire et raccourcie */
/* on a des URI raccourcies pour plus de simplicité */
/* en deuxieme argument on a l'import des middlewares dans controlSauces */
/* chaque middleware est une methode de sauceCtrl */

/* multer est mis après le auth afin que l'autentification soit faite avant d'uploader les images */
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);


/* exportation sous le nom router */
module.exports = router;