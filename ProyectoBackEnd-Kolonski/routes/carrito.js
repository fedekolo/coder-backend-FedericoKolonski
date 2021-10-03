const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/',(req,res) => {
    res.send({prueba: "esto es una prueba"});
});

module.exports = router;