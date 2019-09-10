const express = require('express');

// import db-config

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: 'server up'})
})

module.exports = router;