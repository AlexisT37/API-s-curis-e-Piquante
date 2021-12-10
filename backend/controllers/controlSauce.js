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


/* on crée une sauce en suivant l'instantiation du schéma */
exports.createSauce = (req, res, next) => {
    console.log(req.body);

    delete req.body._id;
    /* on exporte la sauce */
    const sauce = new Sauce({
        /* on créée une nouvelle instantiation */
        ...req.body
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
    /* modifier la sauce */
    const sauce = new Sauce({
        _id: req.params.id,
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked
    });
    Sauce.updateOne({
        /* modifier la sauce dont la requete aura l'id correspondant */
        _id: req.params.id
    }, sauce).then(
        () => {
            res.status(201).json({
                message: "La sauce a bien été modifiée !"
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};


/* supprimer la sauce avec l'id correspondant */
exports.deleteSauce = (req, res, next) => {
    /* trouver une sauce qui a l'id de la requete */
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauce) => {
            Sauce.deleteOne({
                    _id: req.params.id
                })
                .then(() => res.status(200).json({
                    message: "Vous avez supprimé une sauce !"
                }))
                .catch((error) => res.status(400).json({
                    error
                }));
        });
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