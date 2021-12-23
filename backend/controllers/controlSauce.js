/* On aurait tendence à penser que les commentaires sont là pour expliquer le code aux développeurs */
/* La vérité c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/* ce module est un controlleur, il contient la logique metier des instructions CRUD pour les sauces */
/* chaque middleware est implémenté sous la forme d'un export */
/* il sera importé dans routeSauce.js */
/* c'est-à-dire que l'import utilisera la syntaxe import.middleware */

/* il y a 6 routes:  */
/* créer une sauce, lire une sauce, modifier une sauce, effacer une sauce, lire toutes les sauces, liker ou disliker une sauce */

/* importer le schéma sauce pour une sauce */
const Sauce = require("../models/Sauce");

/* import de fs, qui veut dire File system ou système de fichier */
/* pour manipuler les fichiers */
const fs = require("fs");

/* on crée une sauce en suivant l'instantiation du schéma */
exports.createSauce = (req, res, next) => {
  // console.log(req.body);
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
    /* puis l'URI de l'image */
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    /* on initialise les likes et dislike a un entier nul, et la liste des utilisateurs qui */
    /* likent et dislike à une liste vide */
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    /* on sauvegarde le schema */
    .then(() =>
      res.status(201).json({
        /* obtenir le status de la requête en json */
        message: "Vous avez créé une nouvelle sauce !",
      })
    )
    .catch((error) => res.status(400).json({ error }));
};

/* on affiche une sauce en utilisant l'id */
exports.getOneSauce = (req, res, next) => {
  /* query mongoose pour trouver un document selon les paramètres indiqués, ici l'id de la requête */
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) =>
      res.status(404).json({
        error,
      })
    );
};

/* on modifie une sauce */
exports.modifySauce = (req, res, next) => {
  /* on déclare un object vide */
  let sauceObject = {};
  /* initialiser marqueur pour vérifier */
  /* si on a une nouvelle image */
  let newImg = false;
  /* si on a un fichier dans la requête, c'est a dire qu'on a une nouvelle image */
  if (req.file) {
    /* marqueur devient vrai */
    newImg = true;
    /* on modifie sauceObject */
    sauceObject = {
      /* de façon à ce qu'il ait la nouvelle image */
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };
    /* si il n'y a pas de nouvelle image */
  } else {
    /* sauceObjet restera pareil sauf pour les autres changements que l'on souhaite faire */
    sauceObject = { ...req.body };
  }

  /* on va trouver notre sauce et la mettre a jour */
  /* on met a jour l'objet sauceObject en utilisant l'id de la requete */
  Sauce.findOneAndUpdate(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then((sauce) => {
      /* si le marqueur de nouvelle image est vrai */
      if (newImg == true) {
        /* on trouve le nom de l'ancienne image */
        const filenamedelete = sauce.imageUrl.split("/images/")[1];
        /* on suprime l'ancienne image a l'aide de la fonction unlink de fs */
        fs.unlink(`images/${filenamedelete}`, (error) => {
          if (error) throw error;
        });
        /* une fois le middleware terminé, le prochan newImg sera initialisé à false */
      }

      res.status(200).json({
        message: "Sauce modifiée !",
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

/* supprimer la sauce avec l'id correspondant */
exports.deleteSauce = (req, res, next) => {
  // console.log(req.body);
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      return res.status(404).json({ error: new Error("Sauce non trouvée") });
    }
    if (sauce.userId !== req.auth.userId) {
      return res.status(401).json({
        error: new Error("Requête non autorisée"),
      });
    }
  });
  /* trouver l'id de la sauce et supprimer */
  Sauce.findByIdAndRemove(req.params.id)
    .then((deleted) => {
      /* filename est la 2ème partie de l'URI, le chemin dans le répertoire */
      const filename = deleted.imageUrl.split("/images/")[1];
      /* fs.unlink veut dire retirer un lien symbolique du système */
      /* autrement dit supprimer un fichier */
      fs.unlink(`images/${filename}`, () =>
        res.status(201).json({
          message: "Sauce supprimée",
        })
      );
    })
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

/* montrer toutes les sauces */
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

exports.likerSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      console.log(req.body);
      /* si la requète like est 1 */
      if (req.body.like === 1) {
        /* utilisation de la méthode updateone avec en paramètres l'id de la sauce de la requête */
        /* ainsi que les instructions */
        /* on va utiliser $push qui est la même chose que append dans python */
        /* c'est-à-dire ajouter un élément à la fin du tableau */
        /* on utilise $inc qui vient de incrémenter */
        /* on va donc incrémenter les likes de 1 */
        if (!sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
          )
            .then(() => res.status(200).json({ message: `Sauce likée` }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          res.status(400).json({ message: `sauce déjà likée` });
        }
        /* sinon, si  la requète like est -1 */
      } else if (req.body.like == -1) {
        if (!sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            /* on fait l'inverse, on ajoute l'id à la fin du tableau des utilisateurs qui dislikent */
            /* et on incrémente les dislikes de 1 */
            { _id: req.params.id },
            {
              $push: { usersDisliked: req.body.userId },
              $inc: { dislikes: +1 },
            }
          )
            .then(() => res.status(200).json({ message: `Sauce dislikée` }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          res.status(400).json({ message: `sauce déjà dislikée` });
        }
        /* si la requète like est a 0, c'est-à-dire qu'on ne veut ni liker ni disliker */
      } else if (req.body.like === 0) {
        Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
            /* si l'user id de la requète est déjà dans le tableau des utilisateurs qui likent */
            /* la méthode includes retourne vrai si la structure de données */
            /* inclus l'élément passé en argument */
            if (sauce.usersLiked.includes(req.body.userId)) {
              Sauce.findOneAndUpdate(
                { _id: req.params.id },
                /* ici on utilise pull qui est comme remove() dans python */
                /* donc on enlève note userId de la liste des utilisateurs qui likent */
                /* on décrémente le nombre de like en utilisant un entier négatif */
                { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
              )
                .then(() => res.status(200).json({ message: `like annulé` }))
                .catch((error) => res.status(400).json({ error }));
              /* si l'user id de la requète est déjà dans le tableau des utilisateurs qui dislikent */
            } else if (sauce.usersDisliked.includes(req.body.userId)) {
              Sauce.findOneAndUpdate(
                { _id: req.params.id },
                {
                  /* ici on enlève note userId de la liste des utilisateurs qui dislikent */
                  /* on décrémente le nombre de dislike en utilisant un entier négatif */
                  $pull: { usersDisliked: req.body.userId },
                  $inc: { dislikes: -1 },
                }
              )
                .then(() => res.status(200).json({ message: `dislike annulé` }))
                .catch((error) => res.status(400).json({ error }));
            }
          })
          .catch((error) => res.status(404).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
