const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/bookings/admin/all
// @desc    Get all bookings (Admin only) with filtering
// @access  Private/Admin
router.get('/admin/all', [auth, admin], async (req, res) => {
    try {
        const { movieId, date, time } = req.query;
        let query = {};
        
        if (movieId) {
            query['movie.id'] = movieId;
        }
        if (date) {
            query.date = date;
        }
        if (time) {
            query.time = time;
        }

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/bookings
// @desc    Create a new booking
router.post('/', async (req, res) => {
    try {
        const { user, movie, theater, date, time, seats, totalPrice } = req.body;
        
        const newBooking = new Booking({
            user,
            movie,
            theater,
            date,
            time,
            seats,
            totalPrice
        });

        const booking = await newBooking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/bookings/user/:userId
// @desc    Get all bookings for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/bookings/occupied
// @desc    Get occupied seats for a specific showtime
router.get('/occupied', async (req, res) => {
    try {
        const { movieId, theaterId, date, time } = req.query;
        
        const bookings = await Booking.find({
            'movie.id': movieId,
            'theater.id': theaterId,
            date,
            time
        });

        // Extract all seats from matching bookings
        const occupiedSeats = bookings.reduce((acc, booking) => {
            return [...acc, ...booking.seats];
        }, []);

        res.json(occupiedSeats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/bookings/:id
// @desc    Delete a booking
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    console.log(`[CANCEL] Request for booking ID: ${req.params.id}`);
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            console.log(`[CANCEL] Booking NOT FOUND: ${req.params.id}`);
            return res.status(404).json({ message: 'Booking not found' });
        }

        console.log(`[CANCEL] Booking found. User in booking: ${booking.user.toString()}`);
        console.log(`[CANCEL] Active user ID: ${req.user.id}`);

        // Fetch user from DB to get current role (since role is not in token payload)
        const user = await User.findById(req.user.id);
        const isAdmin = user && user.role === 'admin';
        console.log(`[CANCEL] Is Admin: ${isAdmin}`);

        // Check if user owns the booking (or is admin)
        const isOwner = booking.user.toString() === req.user.id;
        console.log(`[CANCEL] Is Owner: ${isOwner}`);

        if (!isOwner && !isAdmin) {
            console.log(`[CANCEL] UNAUTHORIZED: User ${req.user.id} tried to cancel booking of ${booking.user.toString()}`);
            return res.status(401).json({ message: 'User not authorized to cancel this booking' });
        }

        await Booking.findByIdAndDelete(req.params.id);
        console.log(`[CANCEL] SUCCESS: Booking ${req.params.id} removed`);
        res.json({ message: 'Booking removed successfully' });
    } catch (err) {
        console.error('[CANCEL] CRITICAL ERROR:', err.message);
        res.status(500).json({ message: 'Server Error during cancellation', details: err.message });
    }
});

module.exports = router;
