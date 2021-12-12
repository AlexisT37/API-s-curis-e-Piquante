/* On aurait tendence à penser que les commentaires sont là pour expliquer le code aux développeurs */
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
        /* on initialise les likes et dislike a un entier nul, et la liste des utilisateurs qui */
        /* likent et dislike à une liste vide */
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

/* on affiche une sauce en utilisant l'id */
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
    Sauce.findOne({
            _id: req.params.id
        })
        .then(
            (sauce) => {
                if (!sauce) {
                    return res.status(404).json({
                        error: new Error('Sauce non trouvée')
                    });
                }
                if (sauce.userId != req.ath.userId) {
                    return res.status(401).json({
                        error: new Error('Requête non autorisée')
                    });
                }
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({
                            _id: req.params.id
                        })
                        .then(() => res.status(200).json({
                            message: 'Sauce supprimée !'
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