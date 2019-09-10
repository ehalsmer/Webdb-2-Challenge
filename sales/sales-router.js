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

function validateId(req, res, next) {
    db.select('*').from('sales').where('id', `${req.params.id}`).first()
    .then(response => {
        if (response) {
            req.sale = response;
            next();
        } else {
            res.status(404).json({message: 'No sale found with that ID'})
        }
    })
    .catch(error => {
        res.status(500).json({message: 'Error looking up ID'})
    })
}

router.get('/:id', validateId, (req, res) => {
    res.status(200).json(req.sale);
})

router.post('/', (req, res)=>{

})

router.delete('/:id', (req, res) => {

})

router.put('/:id', (req, res)=>{

})

module.exports = router;