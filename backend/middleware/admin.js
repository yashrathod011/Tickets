const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
