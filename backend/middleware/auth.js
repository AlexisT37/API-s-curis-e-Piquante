/* On aurait tendence à penser que les commentaires sont là pour expliquer le code aux développeurs */
/* La vérité c'est que le code est là pour expliquer les commentaires à l'ordinateur */

/*  ce  module auth.js est le middleware d'autentification */
/* il sert a ajouter une sécurité lors de la procédure d'authentification de l'utilisateur */

const jwt = require("jsonwebtoken");
/* utiliser le webtoken pour l'autentification */
/* message gris a cause de ES6 */

/* format try et catch pour eviter les crashs si erreur */
module.exports = (req, res, next) => {
  try {
    /* avoir juste le webtoken avec le 2eme element du tableau et pas bearer */
    const token = req.headers.authorization.split(" ")[1];
    /* decoder le token avec le seed */
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    /* assigner l'userid a celui donné dans le token */
    /* le token décodé est un objet qui a deux propriétés, et là */
    /* on veut la propriété userId */
    const userId = decodedToken.userId;

    /* assignement de userId au l'autentification pour que */
    /* seul le propriétaire de la sauce puisse la supprimer */
    req.auth = {
      userId,
    };
    /* si le userid de la requete et le userId demandé ne sont pas les mêmes */
    if (req.body.userId && req.body.userId !== userId) {
      throw "Vous n'avez pas le bon ID";
    } else {
      next();
    }
  } catch {
    /* erreur 400 si on arrive pas a lancer la requete d'autentification */
    res.status(401).json({
      error: new Error("Requête invalide"),
    });
  }
};
