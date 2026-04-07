const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/movies
// @desc    Add a new movie
// @access  Private/Admin
router.post('/', [auth, admin], async (req, res) => {
    try {
        const {
            title,
            description,
            fullDescription,
            genre,
            rating,
            duration,
            releaseDate,
            poster,
            backdrop,
            trailerUrl,
            status,
            cast
        } = req.body;

        const newMovie = new Movie({
            title,
            description,
            fullDescription,
            genre,
            rating,
            duration,
            releaseDate,
            poster,
            backdrop,
            trailerUrl,
            status,
            cast
        });

        const movie = await newMovie.save();
        res.json(movie);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/movies/:id
// @desc    Update an existing movie
// @access  Private/Admin
router.put('/:id', [auth, admin], async (req, res) => {
    try {
        const updateData = { ...req.body };
        delete updateData._id; // Ensure we don't try to update immutable _id
        delete updateData.__v;

        // Sanitize cast if present (remove sub-document IDs)
        if (updateData.cast) {
            updateData.cast = updateData.cast.map(member => {
                const { _id, ...cleanMember } = member;
                return cleanMember;
            });
        }

        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json(movie);
    } catch (err) {
        console.error('Update Error:', err);
        res.status(400).json({ 
            message: 'Error updating movie', 
            details: err.message,
            errors: err.errors
        });
    }
});

// @route   GET api/movies
// @desc    Get all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ releaseDate: -1 });
        res.json(movies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/movies/:id
// @desc    Get movie by ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ msg: 'Movie not found' });
        }
        res.json(movie);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Movie not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/movies/:id
// @desc    Delete a movie
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ message: 'Movie removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
