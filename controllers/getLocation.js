// controllers/cityController.js
const City = require('../model/allCitySchema');
const { cityValidationSchema } = require('../validation/cityValidation');

// Create a city

exports.createCity = async (req, res) => {
    // Validate the request body
    const { error } = cityValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
  
    try {
      // Check if a city with the same name already exists
      const existingCity = await City.findOne({ name: req.body.name });
      if (existingCity) {
        return res.status(400).json({ error: 'City with the same name already exists' });
      }
  
      // Create and save the new city
      const city = new City(req.body);
      await city.save();
      res.status(201).json({ message: 'City created successfully', city });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create city' });
    }
  };

// Get all cities with optional search
exports.getAllCities = async (req, res) => {
  const { name, country } = req.query;

  try {
    let query = {};

    // Filter by city name (case-insensitive, partial match)
    if (name) {
      query.name = { $regex: `^${name}`, $options: 'i' }; // Search by name starting with the given letters
    }

    // Filter by country (if provided)
    if (country) {
      query.country = { $regex: country, $options: 'i' }; // Case-insensitive country match
    }

    const cities = await City.find(query);
    res.status(200).json({ cities });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve cities' });
  }
};


// Get cities that start with the given letters
exports.getCitiesByLetter = async (req, res) => {
    const { letter } = req.query; // Get the letter from the query parameters
  
    // Validate that a letter has been provided
    if (!letter) {
      return res.status(400).json({ error: 'Letter parameter is required' });
    }
  
    try {
      // Search for cities starting with the given letter (case-insensitive)
      const cities = await City.find({ name: { $regex: `^${letter}`, $options: 'i' } });
  
      if (cities.length === 0) {
        return res.status(404).json({ message: 'No cities found matching the given letters' });
      }
  
      res.status(200).json({ cities });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve cities' });
    }
  };

// Delete city
exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ error: 'City not found' });
    res.status(200).json({ message: 'City deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete city' });
  }
};
