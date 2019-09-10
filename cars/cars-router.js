const express = require('express');

const db = require('../data/db-config');

const router = express.Router();

router.get('/', (req, res) => {
    db('cars')
    .then(response => {
        res.status(200).json(response)
    })
})

module.exports = router;