/* On aurait tendence à penser que les commentaires sont là pour expliquer le code aux développeurs */
/* La vérité c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/* ce module est un controlleur, il contient la logique metier des instructions CRUD pour les sauces */
/* chaque middleware est implémenté sous la forme d'un export */
/* il sera importé dans routeSauce.js */
/* c'est-à-dire que l'import utilisera la syntaxe import.middleware */

/* il y a 5 routes:  */
/* créer une sauce, lire une sauce, modifier une sauce, effacer une sauce, lire toutes les sauces */


/* importer le schéma sauce pour une sauce */
const Sauce = require('../models/Sauce');
const fs = require('fs');


/* on crée une sauce en suivant l'instantiation du schéma */
exports.createSauce = (req, res, next) => {
    /* faire un objet avec le req.body à l'aide de JSON.parse*/
    const sauceObject = JSON.parse(req.body.sauce);
    /* enlever l'id de l'objet fait à partir de req.body */
    delete sauceObject._id;
    /* on exporte la sauce */
    const sauce = new Sauce({
        /* on créée une nouvelle instantiation */
        ...sauceObject,
        /* générer l'image de l'image de manière dynamique */
        /* host sera l'addresse localhost dus server */
        /* puis l'URI de l'image, conservée dans images */
        /* protocol sera le protocole, http ou https */
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        /* on initialise les likes et dislike a un entier nul, et la liste des utilisateurs qui */
        /* likent et dislike à une liste vide */
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce
        .save()
        /* on sauvegarde le schema */
        .then(() => res.status(201).json({
            /* obtenir le status de la requete en json */
            message: "Vous avez créé une nouvelle sauce !"
        }))
        .catch((error) =>
            res.status(400).json({
                /* indiquer les erreurs au format json */
                error
            }));
};


/* on affiche une sauce en utilisant l'id */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({
            error
        }));
};

/* on modifie une sauce */
exports.modifySauce = (req, res, next) => {
    /* on utilise l'opérateur ternaire ? qui permet de faire la forme suivante*/
    /* condition ? si vrai: si faux */
    /* de fait, si on a bosoin de changer l'image alors on configure l'URI */
    /* autrement on utilise seulement le corps de la requète */
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    Sauce.updateOne({
            /* on met a jour l'objet sauceObject en utilisant l'id de la requete */
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce modifiée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};


/* supprimer la sauce avec l'id correspondant */
exports.deleteSauce = (req, res, next) => {
    /* trouver l'id de la sauce et supprimer */
    Sauce.findByIdAndRemove(req.params.id)
        .then(deleted => {
            /* filename est la 2ème partie de l'URI, le chemin dans le répertoire */
            const filename = deleted.imageUrl.split('/images/')[1];
            /* fs.unlink veut dire retirer un lien symbolique du système */
            /* autrement dit supprimer un fichier */
            fs.unlink(`images/${filename}`, () => res.status(201).json({
                message: "Sauce supprimée"
            }))
        })
        .catch(error => res.status(400).json({
            error
        }));
};



/* montrer toutes les sauces */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({
            error
        }));
};