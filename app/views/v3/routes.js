// External dependencies
const express = require('express');
const { DateTime } = require("luxon");
const router = express.Router();

// API
const axios = require('axios');

// Add your routes here - above the module.exports line

module.exports = router;

// Start page
router.post( '/start/', (req, res) => {
    req.session.destroy()
    res.redirect('select-member-employer')
});


// Are you a member or employer?
router.post('/select-member-employer/', (req, res) => {

    var memberEmployer = req.session.data['member-employer']

    if (memberEmployer == 'I am a member of the NHS Pension Scheme') {
        res.redirect('member/select-nhs-pension-portal-general')

    } else if (memberEmployer == 'I am an employer') {
        res.redirect('employer/enter-employer-code')

    } else {
        res.redirect('third-party/enter-your-name')
    }
});

// ****************************************
// MEMBER JOURNEY
// ****************************************


// MEMBER - Select the type of query?
router.post('/select-nhs-pension-portal-general/', (req, res) => {

    var mnpGeneral = req.session.data['mnpGeneral']

    if (mnpGeneral == 'The My NHS Pension portal') {
        res.redirect('nhs-pension-portal-options')

    } else if (mnpGeneral == 'NHS pension statement') {
        res.redirect('../member/trs/trs-start')

    } else if (mnpGeneral == 'I am looking for an update') {
        res.redirect('membership-number')

    } else if (mnpGeneral == 'I am retiring') {
        res.redirect('membership-number')

    } else if (mnpGeneral == 'Requesting a form') {
        res.redirect('membership-number')

    } else if (mnpGeneral == 'Bereavement or ill health') {
        res.redirect('membership-number')

    } else if (mnpGeneral == 'Update my details') {
        res.redirect('membership-number')

    } else if (mnpGeneral == 'McCloud') {
        res.redirect('membership-number')

    } else if (mnpGeneral == 'Something else') {
        res.redirect('membership-number')

    } else {
        res.redirect('select-nhs-pension-portal-general')
    }
});

// ****************************************
// MEMBER JOURNEY- TRS deflection
// ****************************************


module.exports = router;

// TRS - Are you a current NHS employee?
router.post('/member/trs/are-you-current-employee/', (req, res) => {
  var trsEmployee = req.session.data['trsEmployee']
  req.session.data['q1'] = trsEmployee === 'Yes' ? 'yes' : 'no'
  if (trsEmployee === 'Yes') {
    res.redirect('trs-active-member')
  } else {
    res.redirect('../membership-number')
  }
});

// TRS - Are you an active member of the NHS Pension Scheme?
router.post('/member/trs/trs-active-member/', (req, res) => {
  var trsActiveMember = req.session.data['trsActiveMember']
  req.session.data['q2'] = trsActiveMember === 'Yes' ? 'yes' : 'no'
  res.redirect('trs-esr-record')
});

// TRS - Can you access your Electronic Staff Record (ESR)?
router.post('/member/trs/trs-esr-record/', (req, res) => {
  var trsEsr = req.session.data['trsEsr']
  req.session.data['q3'] = trsEsr === 'Yes' ? 'yes' : 'no'

  var q1 = req.session.data['q1']
  var q2 = req.session.data['q2']
  var q3 = req.session.data['q3']

  

  const routes = {
    'yes-yes-yes': '../trs/trs-employee-member-esr',
    'yes-yes-no':  '../trs/no-esr-record',
    'yes-no-yes':  '../trs/trs-not-active-member',
    'yes-no-no':   '../trs/no-esr-record',
    'no-yes-yes':  '../membership-number',
    'no-yes-no':   '../membership-number',
    'no-no-yes':   '../membership-number',
    'no-no-no':    '../membership-number',
  }

  var destination = routes[`${q1}-${q2}-${q3}`] ?? '../membership-number'
  res.redirect(destination)
});

// --------
// MEMBER - What can we help you with?
router.post('/nhs-pension-portal-options/', (req, res) => {

    var mnpEnquiry = req.session.data['mnpEnquiry']

    if (mnpEnquiry == 'I did not get an invitation to My NHS Pension') {
        res.redirect('membership-number')

    } else if (mnpEnquiry == 'I cannot log in to My NHS Pension') {
        res.redirect('membership-number')

    } else if (mnpEnquiry == 'I am locked out of My NHS Pension') {
        res.redirect('membership-number')

    } else if (mnpEnquiry == 'I cannot access My NHS Pension') {
        res.redirect('membership-number')
        
    } else if (mnpEnquiry == 'Something else') {
        res.redirect('membership-number')

    } else {
        res.redirect('nhs-pension-portal-options')
    }
});


// MEMBER - Do you know your membership number?
router.post('/membership-number', (req, res) => {

    var memberNumber = req.session.data['membership-number']

    if (memberNumber == 'Yes, I know my membership number') {
        res.redirect('enter-your-name')
    } else if (memberNumber == "No, I do not know my membership number") {
        res.redirect('enter-your-national-insurance-number');
    } else if (memberNumber == "I'm not sure") {
        res.redirect('enter-your-national-insurance-number');
    }else {
        res.redirect('membership-number')
    }
});

// MEMBER - What is your name?

router.post('/enter-your-name', function (req, res) {

    var firstName = req.session.data['firstName'];
    var lastName = req.session.data['lastName'];

    if (firstName && lastName) {
        res.redirect('enter-date-of-birth');
    } else {
        res.redirect('enter-your-name');
    }

});

// MEMBER - What is your national insurance number?

router.post('/enter-your-national-insurance-number', function (req, res) {
    
    let nino = req.session.data['nationalInsuranceNumber'];

    // Remove all spaces and normalize to uppercase
    nino = (nino || '').replace(/\s+/g, '').toUpperCase();

    const regex = new RegExp('^(?!BG|GB|KN|NK|NT|TN|ZZ)[A-CEGHJ-PR-TW-Z]{2}\\d{6}[A-D]$');

    if (nino) {
        if (regex.test(nino)|| nino === 'QQ123456C') { 
            res.redirect('enter-your-name');  // Valid National Insurance Number
        } else {
            res.redirect('enter-your-national-insurance-number');  // Invalid format
        }
    } else {
        res.redirect('enter-your-national-insurance-number');  // Field is empty
    }

});

// MEMBER - What is your date of birth?

router.post('/enter-date-of-birth', function (req, res) {

    var dateOfBirthDay = req.session.data['date-of-birth']?.day;
    var dateOfBirthMonth = req.session.data['date-of-birth']?.month;
    var dateOfBirthYear = req.session.data['date-of-birth']?.year;

    try {
        if (/^\d+$/.test(dateOfBirthDay) && /^\d+$/.test(dateOfBirthMonth) && /^\d+$/.test(dateOfBirthYear)) {

            req.session.data['date-of-birth'] = DateTime.fromObject({
                day: dateOfBirthDay,
                month: dateOfBirthMonth,
                year: dateOfBirthYear
            }).toFormat("d MMMM yyyy");

            res.redirect('find-your-address')
        } else {
            res.redirect('enter-date-of-birth')
        }

    } catch (err) {
        res.redirect('enter-date-of-birth')
    }
})

// MEMBER - Find your Address

router.post('/find-your-address', function (req, res) {

    var postcodeLookup = req.session.data['postcode']

    const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

    if (postcodeLookup) {

        if (regex.test(postcodeLookup) === true) {

            axios.get("https://api.os.uk/search/places/v1/postcode?postcode=" + postcodeLookup + "&key=" + process.env.POSTCODEAPIKEY)
                .then(response => {
                    var addresses = response.data.results.map(result => result.DPA.ADDRESS);

                    const titleCaseAddresses = addresses.map(address => {
                        const parts = address.split(', ');
                        const formattedParts = parts.map((part, index) => {
                            if (index === parts.length - 1) {
                                // Preserve postcode (DL14 0DX) in uppercase
                                return part.toUpperCase();
                            }
                            return part
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ');
                        });
                        return formattedParts.join(', ');
                    });

                    req.session.data['addresses'] = titleCaseAddresses;

                    res.redirect('select-your-address')
                })
                .catch(error => {
                    console.log(error);
                    res.redirect('no-address-found')
                });

        }

    } else {
        res.redirect('find-your-address')
    }

})

// MEMBER - Enter your address

router.post('/enter-your-address', function (req, res) {

    var addressLine1 = req.session.data['address-line-1'];
    var townOrCity = req.session.data['address-town'];
    var postcodeManual = req.session.data['address-postcode'];

    if (addressLine1 && townOrCity && postcodeManual) {
        res.redirect('enter-your-email');
    } else {
        res.redirect('enter-your-address');
    }

})

// MEMBER - Select your address

router.post('/select-your-address', function (req, res) {

    var address = req.session.data['address'];

    if (address) {
        res.redirect('enter-your-email');
    } else {
        res.redirect('select-your-address');
    }

})

// MEMBER - No address found
router.post('/no-address-found', function (req, res) {

    res.redirect('find-your-address');

})

// MEMBER - enter address manually

router.post('/enter-your-address', function (req, res) {

    var address = req.session.data['address'];

    if (address) {
        res.redirect('enter-your-email');
    } else {
        res.redirect('enter-your-address');
    }

})

// MEMBER - What is your email?

router.post('/enter-your-email', function (req, res) {

    var emailAddress = req.session.data['emailAddress'];

    if (emailAddress) {
        res.redirect('phone-number');
    } else {
        res.redirect('enter-your-email');

    }
})


// MEMBER - Do you have a phone number number?
router.post('/phone-number', (req, res) => {

    res.redirect('reason-for-contact');

});



// ****************************************
// THIRD PARTY JOURNEY
// ****************************************


// THIRD PARTY - What is your name?

router.post('/third-party/enter-your-name', function (req, res) {

    var firstName = req.session.data['firstName'];
    var lastName = req.session.data['lastName'];

    if (firstName && lastName) {
        res.redirect('enter-your-email');
    } else {
        res.redirect('enter-your-name');
    }

});

// THIRD PARTY - What is your email?

router.post('/third-party/enter-your-email', function (req, res) {

    var emailAddress = req.session.data['emailAddress'];

    if (emailAddress) {
        res.redirect('reason-for-contact');
    } else {
        res.redirect('enter-your-email');

    }
})



// ************************************************
// MEMBERS / THIRD PARTY JOURNEYS
// ************************************************
// THIRD PARTY - Third-party-query



router.post('/enter-your-email', (req, res) => {

    res.redirect('enter-your-name');

});


// THIRD PARTY- member - What is the member's membership number?
router.post('/member-membership-number', (req, res) => {

    var memberNumber = req.session.data['membershipNumber']

    if (memberNumber) {
        res.redirect('members-name')
    }else {
        res.redirect('member-membership-number')
    }
});


// THIRD PARTY- member -  What is the member's name?

router.post('/members-name', function (req, res) {

    var firstName = req.session.data['memberFirstName'];
    var lastName = req.session.data['memberLastName'];

    if (firstName && lastName) {
        res.redirect('members-date-of-birth');
    } else {
        res.redirect('members-name');
    }

});

// THIRD PARTY- member - What is the member's date of birth?

router.post('/members-date-of-birth', function (req, res) {

    var dateOfBirthDay = req.session.data['date-of-birth-member']?.day;
    var dateOfBirthMonth = req.session.data['date-of-birth-member']?.month;
    var dateOfBirthYear = req.session.data['date-of-birth-member']?.year;

    try {
        if (/^\d+$/.test(dateOfBirthDay) && /^\d+$/.test(dateOfBirthMonth) && /^\d+$/.test(dateOfBirthYear)) {

            req.session.data['date-of-birth-member'] = DateTime.fromObject({
                day: dateOfBirthDay,
                month: dateOfBirthMonth,
                year: dateOfBirthYear
            }).toFormat("d MMMM yyyy");

            res.redirect('lookup-members-address')
        } else {
            res.redirect('enter-members-date-of-birth')
        }

    } catch (err) {
        res.redirect('members-date-of-birth')
    }
})

// THIRD PARTY- member - What is the member's postcode?

router.post('/lookup-members-address', function (req, res) {

    var postcodeLookup = req.session.data['postcode']

    const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

    if (postcodeLookup) {

        if (regex.test(postcodeLookup) === true) {

            axios.get("https://api.os.uk/search/places/v1/postcode?postcode=" + postcodeLookup + "&key=" + process.env.POSTCODEAPIKEY)
                .then(response => {
                    var addresses = response.data.results.map(result => result.DPA.ADDRESS);

                    const titleCaseAddresses = addresses.map(address => {
                        const parts = address.split(', ');
                        const formattedParts = parts.map((part, index) => {
                            if (index === parts.length - 1) {
                                // Preserve postcode (DL14 0DX) in uppercase
                                return part.toUpperCase();
                            }
                            return part
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ');
                        });
                        return formattedParts.join(', ');
                    });

                    req.session.data['addresses'] = titleCaseAddresses;

                    res.redirect('members-address')
                })
                .catch(error => {
                    console.log(error);
                    res.redirect('no-address-found')
                });

        }

    } else {
        res.redirect('lookup-members-address')
    }

})

// THIRD PARTY- member - Enter members address

router.post('/members-address', function (req, res) {

    var addressLine1 = req.session.data['address-line-1'];
    var townOrCity = req.session.data['address-town'];
    var postcodeManual = req.session.data['address-postcode'];

    if (addressLine1 && townOrCity && postcodeManual) {
        res.redirect('members-email');
    } else {
        res.redirect('members-email');
    }

})

// THIRD PARTY- member - Select the member's address

router.post('members-address', function (req, res) {

    var address = req.session.data['address'];

    if (address) {
        res.redirect('members-email');
    } else {
        res.redirect('members-address');
    }

})

// THIRD PARTY- member  - No address found
router.post('/no-address-found', function (req, res) {

    res.redirect('lookup-members-address');

})

// THIRD PARTY- member - Enter members address manual

router.post('/members-address-manual', function (req, res) {

    var addressLine1 = req.session.data['address-line-1'];
    var townOrCity = req.session.data['address-town'];
    var postcodeManual = req.session.data['address-postcode'];

    if (addressLine1 && townOrCity && postcodeManual) {
        res.redirect('members-email');
    } else {
        res.redirect('members-email');
    }

})


// THIRD PARTY- member - What is your email?

router.post('/enter-members-email', function (req, res) {

    var emailAddress = req.session.data['memberEmail'];

    if (emailAddress) {
        res.redirect('reason-for-contact');
    } else {
        res.redirect('members-email');

    }
})

// THIRD PARTY- member  - Reason for contact
router.post('/reason-for-contact', function (req, res) {

    var additionalInfo = req.session.data['additionalInfo'];

    if (additionalInfo) {

        if (additionalInfo.length > 200) {
            res.redirect('reason-for-contact');
        } else {
            res.redirect('check-your-answers');
        }

    } else {
        res.redirect('reason-for-contact');
    }

})

// ETHIRD PARTY- member - Check your answers
router.post('/check-your-answers', (req, res) => {

    res.redirect('confirmation');

});


// ****************************************
// EMPLOYER JOURNEY
// ****************************************

// EMPLOYER - What is your employing authority code?

router.post('/enter-employer-code', function (req, res) {

    var eaCode = req.session.data['employer-code'];

    if (eaCode) {
        res.redirect('enter-your-name');
    } else {
        res.redirect('enter-employer-code');
    }

});


// EMPLOYER - What is your name?

router.post('/employer/enter-your-name', function (req, res) {

    var firstName = req.session.data['firstName'];
    var lastName = req.session.data['lastName'];

    if (firstName && lastName) {
        res.redirect('enter-your-email');
    } else {
        res.redirect('enter-your-name');
    }

});

// EMPLOYER - What is your email?

router.post('/employer/enter-your-email', function (req, res) {

    var emailAddress = req.session.data['emailAddress'];

    if (emailAddress) {
        res.redirect('select-member-employer-query');
    } else {
        res.redirect('enter-your-email');

    }
})


// EMPLOYER - Is your query about a member or employer?
router.post('/select-member-employer-query', (req, res) => {

    var memberEmployerQuery = req.session.data['member-employer-query']

    if (memberEmployerQuery == 'member-query') {
        res.redirect('member-query/membership-number')

    } else if (memberEmployerQuery == 'General-query') {
        res.redirect('employer-query/reason-for-contact')

    } else {
        res.redirect('select-member-employer-query')
    }
});

// EMPLOYER QUERY - Reason for contact
router.post('/employer-query/reason-for-contact', function (req, res) {

    var additionalInfo = req.session.data['additionalInfo'];

    if (additionalInfo) {

        if (additionalInfo.length > 200) {
            res.redirect('reason-for-contact');
        } else {
            res.redirect('check-your-answers');
        }

    } else {
        res.redirect('reason-for-contact');
    }

})

// EMPLOYER QUERY - Check your answers
router.post('/employer-query/check-your-answers', (req, res) => {

    res.redirect('confirmation');

});

// EMPLOYER - MEMBER QUERY - Do you know your membership number?
router.post('/member-query/membership-number', (req, res) => {

    var memberNumber = req.session.data['membershipNumber']

    if (memberNumber) {
        res.redirect('enter-members-name')
    }else {
        res.redirect('membership-number')
    }
});


// EMPLOYER - MEMBER QUERY - What is the members name?

router.post('/member-query/enter-members-name', function (req, res) {

    var firstName = req.session.data['memberFirstName'];
    var lastName = req.session.data['memberLastName'];

    if (firstName && lastName) {
        res.redirect('enter-members-date-of-birth');
    } else {
        res.redirect('enter-members-name');
    }

});

// EMPLOYER - MEMBER QUERY - What is the members date of birth?

router.post('/member-query/enter-members-date-of-birth', function (req, res) {

    var dateOfBirthDay = req.session.data['date-of-birth-member']?.day;
    var dateOfBirthMonth = req.session.data['date-of-birth-member']?.month;
    var dateOfBirthYear = req.session.data['date-of-birth-member']?.year;

    try {
        if (/^\d+$/.test(dateOfBirthDay) && /^\d+$/.test(dateOfBirthMonth) && /^\d+$/.test(dateOfBirthYear)) {

            req.session.data['date-of-birth-member'] = DateTime.fromObject({
                day: dateOfBirthDay,
                month: dateOfBirthMonth,
                year: dateOfBirthYear
            }).toFormat("d MMMM yyyy");

            res.redirect('find-members-address')
        } else {
            res.redirect('enter-members-date-of-birth')
        }

    } catch (err) {
        res.redirect('enter-members-date-of-birth')
    }
})

// EMPLOYER - MEMBER QUERY - Find members Address

router.post('/member-query/find-members-address', function (req, res) {

    var postcodeLookup = req.session.data['postcode']

    const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

    if (postcodeLookup) {

        if (regex.test(postcodeLookup) === true) {

            axios.get("https://api.os.uk/search/places/v1/postcode?postcode=" + postcodeLookup + "&key=" + process.env.POSTCODEAPIKEY)
                .then(response => {
                    var addresses = response.data.results.map(result => result.DPA.ADDRESS);

                    const titleCaseAddresses = addresses.map(address => {
                        const parts = address.split(', ');
                        const formattedParts = parts.map((part, index) => {
                            if (index === parts.length - 1) {
                                // Preserve postcode (DL14 0DX) in uppercase
                                return part.toUpperCase();
                            }
                            return part
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ');
                        });
                        return formattedParts.join(', ');
                    });

                    req.session.data['addresses'] = titleCaseAddresses;

                    res.redirect('select-members-address')
                })
                .catch(error => {
                    console.log(error);
                    res.redirect('no-member-address-found')
                });

        }

    } else {
        res.redirect('find-members-address')
    }

})

// EMPLOYER - MEMBER QUERY - Enter members address

router.post('/member-query/enter-members-address', function (req, res) {

    var addressLine1 = req.session.data['address-line-1'];
    var townOrCity = req.session.data['address-town'];
    var postcodeManual = req.session.data['address-postcode'];

    if (addressLine1 && townOrCity && postcodeManual) {
        res.redirect('enter-members-email');
    } else {
        res.redirect('enter-members-address');
    }

})

// EMPLOYER - MEMBER QUERY - Select members address

router.post('/member-query/select-members-address', function (req, res) {

    var address = req.session.data['address'];

    if (address) {
        res.redirect('enter-members-email');
    } else {
        res.redirect('select-members-address');
    }

})

// EMPLOYER - MEMBER QUERY - No address found
router.post('/member-query/no-members-address-found', function (req, res) {

    res.redirect('find-members-address');

})

// EMPLOYER - MEMBER QUERY - What is your email?

router.post('/member-query/enter-members-email', function (req, res) {

    var emailAddress = req.session.data['memberEmail'];

    if (emailAddress) {
        res.redirect('reason-for-contact');
    } else {
        res.redirect('enter-members-email');

    }
})

// EMPLOYER - MEMBER QUERY - Reason for contact
router.post('/member-query/reason-for-contact', function (req, res) {

    var additionalInfo = req.session.data['additionalInfo'];

    if (additionalInfo) {

        if (additionalInfo.length > 200) {
            res.redirect('reason-for-contact');
        } else {
            res.redirect('check-your-answers');
        }

    } else {
        res.redirect('reason-for-contact');
    }

})

// EMPLOYER - MEMBER QUERY - Check your answers
router.post('/member-query/check-your-answers', (req, res) => {

    res.redirect('confirmation');

});