const express = require('express');

const db = require('../data/db-config');

const router = express.Router();

router.get('/', (req, res) => {
    // example: http://localhost:5001/api/sales?sortby=amount&sortdir=desc&limit=5 will return the top 5 sales in terms of amount the car sold for
    const limit = req.query.limit || 100;
    const sortBy = req.query.sortby || 'id'; // column to order rows by
    const sortDir = req.query.sortdir || 'asc'; // direction to order (asc or desc)
    db('sales').orderBy(`${sortBy}`, `${sortDir}`).limit(limit)
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

function validateCarId(req, res, next){
    db.select('*').from('cars').where('id', `${req.body.car_id}`).first()
    .then(response => {
        if (response) {
            next();
        } else {
            res.status(404).json({message: `Car with id ${req.body.car_id} not found`}).end();
        }
    })
    .catch(error => {
        res.status(500).json({message: `Error looking up car with ID ${req.body.car_id}`}).end();
    })
}

function validateSale(req, res, next){
    const sale = req.body;
    if (!sale.dateOfSale){
        res.status(400).json({message: 'Sale is missing required dateOfSale'}).end();
    }
    else if (!sale.seller){
        res.status(400).json({message: 'Sale is missing required seller field'}).end();
    }
    else if (!sale.buyer){
        res.status(400).json({message: 'Sale is missing required buyer field'}).end();
    }
    else if (!sale.amount){
        res.status(400).json({message: 'Sale is missing required amount field'}).end();
    }
    else if (typeof sale.amount != 'number'){
        res.status(400).json({message: 'Amount must be a number'}).end();
    }
    next();
}

router.get('/:id', validateId, (req, res) => {
    res.status(200).json(req.sale);
})

router.post('/', validateCarId, validateSale, (req, res)=>{
    db('sales').insert(req.body)
    .then(([id]) => {
        db('sales').where({ id }).first()
        .then(response => {
            res.status(200).json(response).end()
        })
        .catch(err => { res.json(err).end()})
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.delete('/:id', validateId, (req, res) => {
    db('sales').where({id: req.params.id}).del()
    .then(count => {
        res.status(200).json({message: `Deleted ${count} sale(s) with id ${req.params.id}`})
    })
    .catch(error => {res.json(error)})
})

router.put('/:id', validateId, validateSale, (req, res)=>{
    db('sales').where('id', `${req.params.id}`).update(req.body)
    .then(count => {
        res.status(200).json({message: `Updated ${count} sale(s)`})
    })
    .catch(err => { res.json(err)})
})

module.exports = router;