const express = require('express');
const router = express.Router();
const Theater = require('../models/Theater');
const Showtime = require('../models/Showtime');

// @route   GET api/theaters
// @desc    Get all theaters
router.get('/', async (req, res) => {
    try {
        const theaters = await Theater.find();
        res.json(theaters);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/theaters/:id/showtimes
// @desc    Get showtimes for a specific theater
router.get('/:id/showtimes', async (req, res) => {
    try {
        const showtimes = await Showtime.find({ theater: req.params.id })
            .populate('movie')
            .sort({ startTime: 1 });
        res.json(showtimes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

