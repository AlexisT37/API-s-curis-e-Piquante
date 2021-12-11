/* On aurait tendence à penser que les commentaires sont là pour expliquer le code aux développeurs */
/* La vériter c'est que le code est là pour expliquer les commentaires à l'ordinateur */


/* ce module est un controlleur, il contient la logique metier */
/* des commandes utilisateur. */
/* on peut faire 2 actions: */
/* créer un nouvel utiliateur, s'identifier comme utilisateur */


/* on importe bcrypt pour encrypter le mot de passe */
const bcrypt = require('bcrypt');

/* on importe le schema User pour avoir une structure de base de l'utilisateur */
const User = require('../models/User');

/*  on importe jsonwebtoken pour creer un token d'autentification */
/* pour augmenter la sécurité de l'identification de l'utilisateurr */
const jwt = require('jsonwebtoken');

/* créer un nouvel utilisateur */
exports.signup = (req, res, next) => {
    /* hasher le mot de passe avec un degré 10 de salaison */
    bcrypt.hash(req.body.password, 10)
        /* retourner une promise */
        .then(hash => {
            /* instantiation d'un utilisateur */
            /* en tant qu'object avec 2 propriétés */
            const user = new User({
                email: req.body.email,
                password: hash
            });
            /* sauvegarder l'utilisateur */
            user.save()
                /* avertir que l'utiliateur a été créé en modifiant le status */
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                /* envoyer l'erreur en json et modifier le status */
                /* status 400 si on ne peut pas sauvegarder l'utilisateur */
                .catch(error => res.status(400).json({
                    error
                }));
        })
        /* status 500 si on arrive pas à crypter le mot de passe */
        .catch(error => res.status(500).json({
            error
        }));
};


/* connecte l'utilisateur à la base de données */
/* car l'utilisateur ne peut effectuer que certaines actions */
exports.login = (req, res, next) => {
    /* trouver un utilisateur en cherchant l'email correspondant */
    /* dans la liste des emails */
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            /* si l'email n'existe pas dans */
            /* la base de données */
            if (!user) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            /* on compare le mot de passe du corps de la  */
            /* requette au mot de passe de l'email trouvé  */
            /* dans la base de données */
            bcrypt.compare(req.body.password, user.password)
                /* promise pour le mot de passe */
                .then(valid => {
                    /* si ce n'est pas le bon mot de passe */
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    /* si on a le bon mot de passe */
                    res.status(200).json({
                        /* on utilise le userId */
                        userId: user._id,
                        /* on utilise le token de jsonwebtoken */
                        token: jwt.sign({
                                userId: user._id
                            },
                            /* chaine de caractere qui sera le seed du token */
                            'RANDOM_TOKEN_SECRET', {
                                /* le token ne sera plus valide dans 24h */
                                expiresIn: '24h'
                            }
                        )
                    });
                })
                /* erreur 500 si on arrive pas chercher un utilisateur */
                .catch(error => res.status(500).json({
                    error
                }));
        })
        /* erreur 500 si on arrive pas a démarrer la requete*/
        .catch(error => res.status(500).json({
            error
        }));
};