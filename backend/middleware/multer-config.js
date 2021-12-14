/* On aurait tendence à penser que les commentaires sont là pour expliquer le code aux développeurs */
/* La vérité c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/* ce module contrôle le middleware multer de node.js  */
/* il sert a uploader des fichiers, ici on s'en sert pour les images */

/* import de multer  */
const multer = require('multer');

/* pouvoir utiliser 3 formats differents d'images, on ajuste le chemin en conséquence */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/* on utilise la propriété diskStorage pour accéder à l'ordinateur de l'utilisateur */
/* destination détermine où on va enregistrer le fichier */
/* filename détermine quel sera le nom du fichier */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        const name = file.originalname.split('').join('').split('.' + extension).join('_');
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({
    storage
}).single('image');