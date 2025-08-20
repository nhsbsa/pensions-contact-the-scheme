// External dependencies
const express = require('express');

const router = express.Router();

// Add your routes here - above the module.exports line

module.exports = router;

// Start page
router.post( '/start-page/', (req, res) => {
    res.redirect('select-member-employer')
});


// Are you a member or employer?
router.post('/select-member-employer/', (req, res) => {

    const member = req.session.data['type']

    if (member == 'member-yes') {
        res.redirect('membership-number')
    } else {
        res.redirect('employer-code')

    }
});

// Do you know your membership number?
router.post('/membership-number/', (req, res) => {

    const number = req.session.data['member-number']

    if (number == 'input') {
        res.redirect('member-name')
    } else {
        res.redirect('ni-number')

    }
});

// We cannot find the address for the postcode ABC 123
router.post('/member-postcode-no-result/', (req, res) => {

    const number = req.session.data['noAddress']

    if (number == 'change') {
        res.redirect('member-postcode-lookup')
    } else {
        res.redirect('member-manual-address')

    }
});

// Do you have a member or employer query?
router.post('/emp-select-member-employer/', (req, res) => {

    const member = req.session.data['type']

    if (member == 'member-yes') {
        res.redirect('emp-membership-number')
    } else {
        res.redirect('employer-name')

    }
});