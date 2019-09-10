const express = require('express');

const db = require('../data/db-config');

const router = express.Router();

router.get('/', (req, res) => {
    db('sales')
    .then(response => {
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json({message: 'Error retrieving sales'})
    })
})

router.get('/:id', (req, res) => {

})

router.post('/', (req, res)=>{

})

router.delete('/:id', (req, res) => {

})

router.put('/:id', (req, res)=>{

})

module.exports = router;