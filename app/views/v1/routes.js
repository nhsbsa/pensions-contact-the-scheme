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
    const employer = req.session.data['type']

    if (member == 'member-yes') {
        res.redirect('select-mnp-general')

    } else if (employer == 'employer-yes') {
        res.redirect('employer-code')

    } else {
        res.redirect('third-party-name')
    }
});

//mnp-options
router.post( '/mnp-options/', (req, res) => {
    res.redirect('membership-number')
});

// select-mnp or general query
router.post('/select-mnp-general/', (req, res) => {

    const query = req.session.data['type']

    if (query == 'mnp-yes') {
        res.redirect('mnp-options')
    } else {
        res.redirect('general-enquiry-options')

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
        res.redirect('employer-reason')

    }
});

// Employer-code
router.post( '/employer-code/', (req, res) => {
    res.redirect('employer-name')
});

// Employer-name
router.post( '/employer-name/', (req, res) => {
    res.redirect('employer-email')
});

// Employer-email
router.post( '/employer-email/', (req, res) => {
    res.redirect('emp-select-member-employer')
});