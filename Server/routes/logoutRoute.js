const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send({ message: 'Failed to logout' });
            }
            res.clearCookie('connect.sid');
            res.status(200).send({ message: 'Logged out successfully' });
        });
    } catch (error) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;