//Todas las rutas principales de la aplicación

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("index");
});

module.exports = router;