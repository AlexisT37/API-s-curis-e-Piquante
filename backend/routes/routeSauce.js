const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/controlSauce');

router.get('/', stuffCtrl.getAllSauces);
router.post('/', stuffCtrl.createSauce);
router.get('/:id', stuffCtrl.getOneSauce);
router.put('/:id', stuffCtrl.modifySauce);
router.delete('/:id', stuffCtrl.deleteSauce);

module.exports = router;