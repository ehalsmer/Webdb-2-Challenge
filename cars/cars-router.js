const express = require('express');

const db = require('../data/db-config');

const router = express.Router();

function validateId(req, res, next){
    db.select('*').from('cars').where('id', `${req.params.id}`).first()
    .then(response => {
        if (response){
            req.data = response;
            next();
        } else {
            res.status(404).json({message: 'No car found with that ID'})
        }
    })
    .catch(error => {
        res.status(500).json({message: 'Error looking up ID'})
    })
}

function validateCar(req, res, next){
    const car = req.body;
    if (!car.vin){
        res.status(400).json({message: 'Car is missing required vin field'}).end();
    }
    else if (!car.make){
        res.status(400).json({message: 'Car is missing required make field'}).end();
    }
    else if (!car.model){
        res.status(400).json({message: 'Car is missing required make field'}).end();
    }
    else if (!car.mileage){
        res.status(400).json({message: 'Car is missing required mileage field'}).end();
    }
    else if (car.vin.length > 17){
        res.status(400).json({message: 'Vin cannot be more than 17 characters'}).end();
    }
    else if (typeof car.mileage != 'number'){
        res.status(400).json({message: 'Mileage must be a number'}).end();
    }
    next();
}

function validateVin (req, res, next) {
    db.select('*').from('cars').where('vin', `${req.body.vin}`).first()
    .then(response => {
        if (response){
            res.status(400).json({message: 'A car with that vin already exists'}).end();
        } else {
            next()
        }
    })
    .catch(error => {
        res.status(500).json({message: 'Error checking vin'})
    })
}

router.get('/', (req, res) => {
    // example: http://localhost:5001/api/cars?sortby=mileage&sortdir=desc
    const limit = req.query.limit || 100;
    const sortBy = req.query.sortby || 'id'; // column to order rows by
    const sortDir = req.query.sortdir || 'asc'; // direction to order (asc or desc)
    db('cars').orderBy(`${sortBy}`, `${sortDir}`).limit(limit)
    .then(response => {
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json({message: 'Error retrieving cars'})
    })
})

router.get('/:id', validateId, (req, res) => {
    res.status(200).json(req.data)
})

router.post('/', validateCar, validateVin, (req, res)=>{
    db('cars').insert(req.body)
    .then(([id]) => {
        db('cars').where({ id }).first()
        .then(response => {
            res.status(200).json(response).end()
        })
        .catch(err => { res.json(err).end()})
    })
    .catch(err => { res.json(err).end()})
})

router.delete('/:id', validateId, (req, res) => {
    db('cars').where({id: req.params.id}).del()
    .then(count => {
        res.status(200).json({message: `Deleted ${count} car(s) with id ${req.params.id}`})
    })
    .catch(err => { res.json(err)})
})

router.put('/:id', validateId, validateCar, validateVin, (req, res)=>{
    db('cars').where('id', `${req.params.id}`).update(req.body)
    .then(count => {
        res.status(200).json({message: `Updated ${count} car(s)`})
    })
    .catch(err => { res.json(err)})
})

module.exports = router;