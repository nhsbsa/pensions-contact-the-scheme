// External dependencies
const express = require('express');

const router = express.Router();

// Add your routes here - above the module.exports line

module.exports = router;


// re you a member or employer?
router.post(/previous-contract/, (req, res) => {

    const contract = req.session.data['member']

    if (contract == 'yes') {
        res.redirect('membership-number')
    } else {
        res.redirect(employer-code')

    }
});
