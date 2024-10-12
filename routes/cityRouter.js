// routes/cityRoutes.js
const express = require('express');
const router = express.Router();
const {createCity,getAllCities,getCitiesByLetter,deleteCity} = require('../controllers/getLocation');
const adminTokenMiddleware = require('../middleware/admin_token');
// admin only can do 
// Routes for cities
router.post('/city',adminTokenMiddleware, createCity); // Create a city
router.delete('/city/:id',adminTokenMiddleware, deleteCity); // Delete a city by ID

// for users only
router.get('/cities', getAllCities); // Get all cities
router.get('/citySearch', getCitiesByLetter); // Get a city by ID

module.exports = router;
