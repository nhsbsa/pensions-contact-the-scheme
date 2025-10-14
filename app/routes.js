// External dependencies
const express = require('express');
const router = express.Router();

// log stuff - thanks Craig Abbott!

router.use((req, res, next) => {
    const log = {
        method: req.method,
        url: req.originalUrl, //URL of page
        data: req.session.data //all data held
    }
    console.log(JSON.stringify(log, null, 2)) // show all data as a dump in terminal
    next() // continue to next action

})

// GET FOLDER NAME - useful for relative templates
router.use('/', (req, res, next) => {
    req.folder = req.originalUrl.split('/')[1]; //folder, e.g. 'current'
    req.subfolder = req.originalUrl.split('/')[2]; //sub-folder e.g. 'service'
    res.locals.folder = req.folder; // what folder the url is
    res.locals.subfolder = req.subfolder; // what subfolder the URL is in
    console.log('folder : ' + res.locals.folder + ', subfolder : ' + res.locals.subfolder);
    next();
});

// Check current and previous - good for debugging
router.use('/', (req, res, next) => {
    res.locals.currentURL = req.originalUrl; //current screen
    res.locals.prevURL = req.get('Referrer'); // previous screen
    console.log('previous page is: ' + res.locals.prevURL + " and current page is " + res.locals.currentURL);
    next();
});



// ****************************************
// Add your routes here - above the module.exports line
// ****************************************

const versionOne =  require('./views/v1/routes')
router.use('/v1', versionOne);
router.use('/v1/member', versionOne);
router.use('/v1/employer', versionOne);
router.use('/v1/third-party', versionOne);

const versionTwo =  require('./views/v2/routes')
router.use('/v1.1', versionTwo);
router.use('/v1.1/member', versionTwo);
router.use('/v1.1/employer', versionTwo);
router.use('/v1.1/third-party', versionTwo);

module.exports = router;

