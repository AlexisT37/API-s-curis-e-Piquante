/* On aurait tendence à penser que les commentaires sont là poul expliquer le code aux développeurs */
/* La vériter c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/* ce module est un controlleur, il contient la logique metier des instructions CRUD pour les sauces */
/* chaque middleware est implémenté sous la forme d'un export */
/* il sera importé dans routeSauce.js sous la forme d'un element de l'objet, ou d'une methode, selon le point de vue */
/* c'est-à-dire que l'import utilisera la syntaxe import.middleware */

/* il y a 5 routes:  */
/* créer une sauce, lire une sauce, modifier une sauce, effacer une sauce, lire toutes les sauces */


/* importer le schéma sauce pour une sauce */
const Sauce = require('../models/Sauce');
const fs = require('fs');


/* on crée une sauce en suivant l'instantiation du schéma */
exports.createSauce = (req, res, next) => {
    // console.log(req.body);
    /* faire un objet avec le req.body à l'aide de JSON.parse*/
    const sauceObject = JSON.parse(req.body.sauce)
    /* enlever l'id de l'objet fait à partir de req.body */
    delete sauceObject._id;
    /* on exporte la sauce */
    const sauce = new Sauce({
        /* on créée une nouvelle instantiation */
        ...sauceObject,
        /* générer l'image de l'image de manière dynamique */
        /* host sera l'addresse localhost dus server */
        /* puis l'URI de l'image, conservée dans images */
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save().then( /* on sauvegarde le schema */
        () => {
            res.status(201).json({
                /* obtenir le status de la requete en json */
                message: "Vous avez créé une nouvelle sauce !"
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                /* indiquer les erreurs au format json */
                error: error
            });
        }
    );
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id /* trouver la sauce avec l'id utilisé lors de la requete */
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    Sauce.updateOne({
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
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Objet supprimé !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};


/* montrer toutes les sauces */
exports.getAllSauces = (req, res, next) => {
    /* showing all sauces */
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};