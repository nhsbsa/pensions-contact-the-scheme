// External dependencies
const express = require('express');

const router = express.Router();

// Add your routes here - above the module.exports line

module.exports = router;

// Start page
router.post( /start-page/, (req, res) => {
    res.redirect('select-member-employer')
});


// Are you a member or employer?
router.post('/select-member-employer/', (req, res) => {

    const payment = req.session.data['type']

    if (member == 'member-yes') {
        res.redirect('membership-number')
    } else {
        res.redirect('employing-code')

    }
});
