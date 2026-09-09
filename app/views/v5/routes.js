// External dependencies
const express = require('express');
const { DateTime } = require("luxon");
const router = express.Router();

// API
const axios = require('axios');


// Add your routes here - module.exports is set at the end of the file

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
        res.redirect('acting-for-member/select-query-type')
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

    } else if (mnpGeneral == 'Total Reward Statement (TRS)') {
        res.redirect('../member/trs/trs-start')

      } else if (mnpGeneral == 'Annual benefit statement (ABS)') {
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


// Are you a member or employer?
 
router.post('/member/trs/trs-start', (req, res) => {
    var viewStatement = req.session.data['view-statement'];

    if (viewStatement == "View or access statement") {
      res.redirect('are-you-current-employee')
    } else if (viewStatement == "Report an issue") {
      res.redirect('../membership-number')
    } else {
        res.redirect('/v3/member/trs/trs-start')
    }
  });



// TRS - Are you a current NHS employee?
router.post('/member/trs/are-you-current-employee/', (req, res) => {
  var trsEmployee = req.session.data['trsEmployee']
  req.session.data['q1'] = trsEmployee === 'Yes' ? 'yes' : 'no'
  if (trsEmployee === 'Yes') {
    res.redirect('are-you-active-member')
  } else {
    res.redirect('../membership-number')
  }
});

// TRS - Are you an active member of the NHS Pension Scheme?
router.post('/member/trs/are-you-active-member/', (req, res) => {
  var trsActiveMember = req.session.data['trsActiveMember']
  req.session.data['q2'] = trsActiveMember === 'Yes' ? 'yes' : 'no'
  res.redirect('access-esr')
});

// TRS - Can you access your Electronic Staff Record (ESR)?
router.post('/member/trs/access-esr/', (req, res) => {
  var trsEsr = req.session.data['trsEsr']
  req.session.data['q3'] = trsEsr === 'Yes' ? 'yes' : 'no'

  var q1 = req.session.data['q1']
  var q2 = req.session.data['q2']
  var q3 = req.session.data['q3']

  

  const routes = {
    'yes-yes-yes': '../trs/trs-employee-member-esr',
    'yes-yes-no':  '../trs/no-esr-record',
    'yes-no-yes':  '../trs/trs-not-active-member',
    'yes-no-no':   '../membership-number',
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

    } else if (mnpEnquiry == 'I cannot sign in to My NHS Pension') {
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

    if (memberNumber == 'Yes, I know the membership number') {
        res.redirect('enter-your-name')
    } else if (memberNumber == "No, I do not know the membership number") {
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

// MEMBER - What is your reason for contact?
router.post('/reason-for-contact', (req, res) => {

    res.redirect('check-your-answers');

});

// MEMBER - Check your answers
router.post('/check-your-answers', (req, res) => {

    res.redirect('confirmation');

});



// ****************************************
// ACTING-FOR-MEMBER JOURNEY
// ****************************************

//acting-for-member- What do you need help with?
router.post('/acting-for-member/select-query-type', (req, res) => {

    var thirdPartyQuery = req.session.data['third-party-query']

    if (thirdPartyQuery == 'I have a question about a members pension') {
        res.redirect('../acting-for-member/member/enter-your-name')

    } else if (thirdPartyQuery == 'I want to tell you that a member has died') {
        res.redirect('../acting-for-member/bereavement-journey/tell-us-once')

    } else {
        res.redirect('../acting-for-member/general-query/enter-your-name')
    }                           
    });

// ****************************************
// ACTING-FOR-MEMBER JOURNEY- general query
// ****************************************

//General query- What is your name?

router.post('/acting-for-member/general-query/enter-your-name', function (req, res) {

    var firstName = req.session.data['InformantFirstName'];
    var lastName = req.session.data['InformantLastName'];

    if (firstName && lastName) {
        res.redirect('../general-query/enter-your-email');
    } else {
        res.redirect('../general-query/enter-your-name');
    }

});

// ACTING-FOR-MEMBER- general query - Reason for contact
router.post('/acting-for-member/general-query/reason-for-contact', function (req, res) {

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

// ACTING-FOR-MEMBER- general query - Check your answers
router.post('/acting-for-member/general-query/check-your-answers', (req, res) => {

    res.redirect('confirmation');

});



// ****************************************
// ACTING-FOR-MEMBER JOURNEY- bereavement journey
// ****************************************

// Bereavement journey - start
router.post('/bereavement-journey/start', (req, res) => {
    req.session.destroy();
    res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-relationship');
});

// Bereavement journey - tell us once
router.post('/bereavement-journey/tell-us-once', (req, res) => {
  var TellUsOnce = req.session.data['TellUsOnce']
    // Use explicit absolute redirects so resolution is consistent
    if (TellUsOnce === 'Yes') {
        res.redirect('/v4/acting-for-member/bereavement-journey/tell-us-once-yes')
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/start')
    }
});

// Bereavement journey - informant relationship
router.post('/bereavement-journey/informant/informant-relationship', (req, res) => {
    var relationship = req.session.data['InformantRelationship'];

    if (relationship) {
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-name');
    } else {
        req.session.data['errors'] = { relationship: 'Select how you are connected to the person who died' };
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-relationship');
    }
});

// Bereavement journey - informant name
router.post('/bereavement-journey/informant/informant-name', function (req, res) {
    var firstName = req.session.data['informantFirstName'];
    var lastName = req.session.data['informantLastName'];

    if (firstName && lastName) {
        req.session.data['errors'] = {};
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-email');
    } else {
        req.session.data['errors'] = {
            informantFirstName: !firstName ? 'Enter a first name' : null,
            informantLastName: !lastName ? 'Enter a last name' : null
        };
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-name');
    }
});

// Bereavement journey - informant email
router.post('/bereavement-journey/informant/informant-email', function (req, res) {
    var emailAddress = req.session.data['informantEmail'];
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailAddress && emailRegex.test(emailAddress)) {
        req.session.data['errors'] = {};
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-phone-number');
    } else {
        req.session.data['errors'] = { informantEmail: 'Enter an email address in the correct format' };
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-email');
    }
});

// Bereavement journey - informant phone number
router.post('/bereavement-journey/informant/informant-phone-number', (req, res) => {
    var phoneChoice = req.session.data['InformantphoneNumber'];
    var phoneNumber = req.session.data['phoneNumber'];

    if (phoneChoice === 'No' || (phoneChoice === 'Yes' && phoneNumber)) {
        req.session.data['errors'] = {};
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-main-address');
    } else {
        req.session.data['errors'] = { InformantphoneNumber: 'Enter a phone number' };
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-phone-number');
    }
});

// Bereavement journey - informant main address
router.post('/bereavement-journey/informant/informant-main-address', (req, res) => {
    var addressInUk = req.session.data['addressInUk'] || req.session.data['phone-number'];

    if (addressInUk === 'Yes') {
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/find-informant-address');
    } else if (addressInUk === 'No') {
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-address');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-main-address');
    }
});

// Bereavement journey - informant find address
router.post('/bereavement-journey/informant/find-informant-address', function (req, res) {
    var postcodeLookup = req.session.data['postcode'];

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
                    res.redirect('/v4/acting-for-member/bereavement-journey/informant/select-informant-address');
                })
                .catch(error => {
                    console.log(error);
                    res.redirect('/v4/acting-for-member/bereavement-journey/informant/no-informant-address-found');
                });
        } else {
            res.redirect('/v4/acting-for-member/bereavement-journey/informant/find-informant-address');
        }
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/find-informant-address');
    }
});

// Bereavement journey - informant address
router.post('/bereavement-journey/informant/informant-address', function (req, res) {
    var addressLine1 = req.session.data['address-line-1'];
    var townOrCity = req.session.data['address-town'];

    if (addressLine1 && townOrCity) {
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-check-your-answers');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-address');
    }
});

// Bereavement journey - informant select address
router.post('/bereavement-journey/informant/select-informant-address', function (req, res) {
    var address = req.session.data['address'];

    if (address) {
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/informant-check-your-answers');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/informant/select-informant-address');
    }
});

// Bereavement journey - informant no address found
router.post('/bereavement-journey/informant/no-informant-address-found', function (req, res) {
    res.redirect('/v4/acting-for-member/bereavement-journey/informant/find-informant-address');
});

// Bereavement journey - informant check your answers
router.post('/bereavement-journey/informant/check-your-answers', function (req, res) {
    res.redirect('/v4/acting-for-member/bereavement-journey/member/member-start');
});



















// Bereavement journey - member start
router.post('/bereavement-journey/member/start', (req, res) => {
    res.redirect('/v4/acting-for-member/bereavement-journey/member/member-name');
});

// Bereavement journey - member name
router.post('/bereavement-journey/member/member-name', function (req, res) {
    var firstName = req.session.data['memberFirstName'];
    var lastName = req.session.data['memberLastName'];

    if (firstName && lastName) {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/member-national-insurance-number');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/member-name');
    }
});

// Bereavement journey - member national insurance number
router.post('/bereavement-journey/member/member-national-insurance-number', function (req, res) {
    var nino = req.session.data['natInsNum'];

    if (nino) {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/member-date-of-birth');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/member-national-insurance-number');
    }
});

// Bereavement journey - member date of birth
router.post('/bereavement-journey/member/member-date-of-birth', function (req, res) {
    var dateOfBirthDay = req.session.data['date-of-birth-member']?.day;
    var dateOfBirthMonth = req.session.data['date-of-birth-member']?.month;
    var dateOfBirthYear = req.session.data['date-of-birth-member']?.year;

    if (/^\d+$/.test(dateOfBirthDay) && /^\d+$/.test(dateOfBirthMonth) && /^\d+$/.test(dateOfBirthYear)) {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/member-date-of-death');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/member-date-of-birth');
    }
});

// Bereavement journey - member date of death
router.post('/bereavement-journey/member/member-date-of-death', function (req, res) {
    var dateOfDeathDay = req.session.data['date-of-death-member']?.day;
    var dateOfDeathMonth = req.session.data['date-of-death-member']?.month;
    var dateOfDeathYear = req.session.data['date-of-death-member']?.year;

    if (/^\d+$/.test(dateOfDeathDay) && /^\d+$/.test(dateOfDeathMonth) && /^\d+$/.test(dateOfDeathYear)) {
        res.redirect('/bereavement-journey/member/member-main-address');
    } else {
        res.redirect('/bereavement-journey/member/member-date-of-death');
    }
});



// Bereavement journey - member main address
router.post('/bereavement-journey/member/member-main-address', (req, res) => {
    var addressInUk = req.session.data['MemberaddressInUk'];

    if (addressInUk === 'Yes') {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/lookup-member-address');
    } else if (addressInUk === 'No') {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/member-address-manual');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/member-main-address');
    }
});

// Bereavement journey - member lookup address
router.post('/bereavement-journey/member/lookup-member-address', function (req, res) {
    var postcodeLookup = req.session.data['postcode'];

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
                    res.redirect('/v4/acting-for-member/bereavement-journey/member/member-select-your-address');
                })
                .catch(error => {
                    console.log(error);
                    res.redirect('/v4/acting-for-member/bereavement-journey/member/member-no-address-found');
                });
        } else {
            res.redirect('/v4/acting-for-member/bereavement-journey/member/lookup-member-address');
        }
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/lookup-member-address');
    }
});

// Bereavement journey - member address manual
router.post('/bereavement-journey/member/member-address-manual', function (req, res) {
    res.redirect('/v4/acting-for-member/bereavement-journey/member/member-check-your-answers');
});

// Bereavement journey - member select address
router.post('/bereavement-journey/member/member-select-your-address', function (req, res) {
    var address = req.session.data['address'];

    if (address) {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/member-check-your-answers');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/member/member-select-your-address');
    }
});

// Bereavement journey - member no address found
router.post('/bereavement-journey/member/member-no-address-found', function (req, res) {
    res.redirect('/v4/acting-for-member/bereavement-journey/member/lookup-member-address');
});

// Bereavement journey - member check your answers
router.post('/bereavement-journey/member/member-check-your-answers', function (req, res) {
    res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-start');
});

// Bereavement journey - dependant start
router.post('/bereavement-journey/dependant/dependant-start', (req, res) => {
    var hasDependants = req.body.dependant || req.session.data['dependant'] || req.session.data['exampleHints'];
    req.session.data['dependant'] = hasDependants;

    if (hasDependants === 'Yes') {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-same-person');
    } else if (hasDependants === 'No' || hasDependants === 'Not sure') {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-child');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-start');
    }
});


// Bereavement journey - dependant- same as Informant
router.post('/bereavement-journey/dependant/dependant-same-person', (req, res) => {
    var hasAdultdependant = req.session.data['Adultdependant'] || req.session.data['Adultdependant'];

    if (hasAdultdependant === 'You' ) {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-child');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-relationship');
    }
});


// Bereavement journey - dependant relationship
router.post('/bereavement-journey/dependant/dependant-relationship', function (req, res) {

    req.session.data['Dependantrelationship'] = req.body.Dependantrelationship;
  
    res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-name');
  
  });

// Bereavement journey - dependant name
router.post('/bereavement-journey/dependant/dependant-name', function (req, res) {
    var firstName = req.session.data['firstName'] || req.session.data['dependantFirstName'];
    var lastName = req.session.data['lastName'] || req.session.data['dependantLastName'];

    if (firstName && lastName) {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-email');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-name');
    }
});



// Bereavement journey - dependant email
router.post('/bereavement-journey/dependant/dependant-email', function (req, res) {
    var emailAddress = req.session.data['dependantemailAddress'];
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailAddress && emailRegex.test(emailAddress)) {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-phone-number');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-email');
    }
});

// Bereavement journey - dependant phone number
router.post('/bereavement-journey/dependant/dependant-phone-number', (req, res) => {
    var phoneChoice = req.body['phone-number'] || req.session.data['phone-number'];
    var phoneNumber = req.body.phoneNumber || req.session.data['phoneNumber'];
    req.session.data['phone-number'] = phoneChoice;
    req.session.data['phoneNumber'] = phoneNumber;

    if (phoneChoice === 'No' || (phoneChoice === 'Yes' && phoneNumber)) {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-main-address');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-phone-number');
    }
});

// Bereavement journey - dependant main address
router.post('/bereavement-journey/dependant/dependant-main-address', (req, res) => {
    var addressInUk = req.session.data['DependantMainAddress'] || req.session.data['DependantMainAddress'];

    if (addressInUk === 'Yes') {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/lookup-dependant-address');
    } else if (addressInUk === 'No') {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-address-manual');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-main-address');
    }
});

// Bereavement journey - dependant lookup address
router.post('/bereavement-journey/dependant/lookup-dependant-address', function (req, res) {
    var postcodeLookup = req.session.data['postcode'];

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
                    res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-select-your-address');
                })
                .catch(error => {
                    console.log(error);
                    res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-no-address-found');
                });
        } else {
            res.redirect('/v4/acting-for-member/bereavement-journey/dependant/lookup-dependant-address');
        }
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/lookup-dependant-address');
    }
});

// Bereavement journey - dependant address manual
router.post('/bereavement-journey/dependant/dependant-address-manual', function (req, res) {
    var addressLine1 = req.session.data['address-line-1'];
    var townOrCity = req.session.data['address-town'];

    if (addressLine1 && townOrCity) {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-check-your-answers');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-address-manual');
    }
});

// Bereavement journey - dependant select address
router.post('/bereavement-journey/dependant/dependant-select-your-address', function (req, res) {
    var address = req.session.data['address'];

    if (address) {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-check-your-answers');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-select-your-address');
    }
});

// Bereavement journey - dependant no address found
router.post('/bereavement-journey/dependant/dependant-no-address-found', function (req, res) {
    res.redirect('/v4/acting-for-member/bereavement-journey/dependant/lookup-dependant-address');
});

// Bereavement journey - dependant check your answers
router.post('/bereavement-journey/dependant/dependant-check-your-answers', function (req, res) {
    res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-child');
});

// Bereavement journey - child dependant 
router.post('/bereavement-journey/dependant/dependant-child', (req, res) => {
    var hasEstateRepresentative = req.session.data['child-dependant'] || req.session.data['child-dependant'];

    if (hasEstateRepresentative === 'Yes' ) {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-child-name');
    } else if (hasEstateRepresentative === 'No') {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-start');

    }
});

// Bereavement journey - child dependant-name
router.post('/bereavement-journey/dependant/dependant-child-name', function (req, res) {
    var firstName = req.session.data['child-firstName'];
    var lastName = req.session.data['child-lastName'];

    if (firstName && lastName) {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-child-check-your-answers');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-child-name');
    }
});

// Bereavement journey - child dependant-check-your-answers
router.post('/bereavement-journey/dependant/dependant-child-check-your-answers', (req, res) => {
    var hasEstateRepresentative = req.session.data['child-dependant-2'] || req.session.data['child-dependant-2'];

    if (hasEstateRepresentative === 'Yes' ) {
        res.redirect('/v4/acting-for-member/bereavement-journey/dependant/dependant-child-name');
    } else if (hasEstateRepresentative === 'No') {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-start');

    }
});

// Bereavement journey - estate- person dealing with estate
router.post('/bereavement-journey/estate/estate-same-person', (req, res) => {
    var hasEstateDealing = req.session.data['EstateDealing'] || req.session.data['EstateDealing'];

    if (hasEstateDealing === 'Other' ) {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-relationship');
    } else if (hasEstateDealing === 'The adult dependant' || hasEstateDealing === 'You') {
        res.redirect('/v4/acting-for-member/bereavement-journey/check-your-answers');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/check-your-answers');
    }
});



// Bereavement journey - estate start
router.post('/bereavement-journey/estate/estate-start', (req, res) => {
    var hasEstateRepresentative = req.session.data['estate-person'] || req.session.data['estate-person'];

    if (hasEstateRepresentative === 'Yes' ) {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-same-person');
    } else if (hasEstateRepresentative === 'No' || hasEstateRepresentative === 'Im not sure') {
        res.redirect('/v4/acting-for-member/bereavement-journey/check-your-answers');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/check-your-answers');
    }
});

// Bereavement journey - estate relationship
router.post('/bereavement-journey/estate/estate-relationship', function (req, res) {

    req.session.data['EstateRelationship'] = req.body.EstateRelationship;
  
    if (req.body.EstateRelationship) {
      res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-name');
    } else {
      res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-relationship');
    }
  
  });


// Bereavement journey - estate name
router.post('/bereavement-journey/estate/estate-name', function (req, res) {
    var firstName = req.session.data['estatefirstName'] || req.session.data['estateFirstName'];
    var lastName = req.session.data['estatelastName'] || req.session.data['estateLastName'];

    if (firstName && lastName) {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-email');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-name');
    }
});


// Bereavement journey - estate email
router.post('/bereavement-journey/estate/estate-email', function (req, res) {
    var emailAddress = req.session.data['emailAddress'];
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailAddress && emailRegex.test(emailAddress)) {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-phone-number');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-email');
    }
});

// Bereavement journey - estate phone number
router.post('/bereavement-journey/estate/estate-phone-number', (req, res) => {
    var phoneChoice = req.session.data['phone-number'];
    var phoneNumber = req.session.data['phoneNumber'];

    if (phoneChoice === 'No' || (phoneChoice === 'Yes' && phoneNumber)) {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-main-address');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-main-address');
    }
});

// Bereavement journey - estate main address
router.post('/bereavement-journey/estate/estate-main-address', (req, res) => {
    var addressInUk = req.session.data['estateMainAddress'] || req.session.data['estate-main-address'];

    if (addressInUk === 'Yes') {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/lookup-estate-address');
    } else if (addressInUk === 'No') {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-address-manual');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-main-address');
    }
});

// Bereavement journey - estate lookup address
router.post('/bereavement-journey/estate/lookup-estate-address', function (req, res) {
    var postcodeLookup = req.session.data['postcode'];

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
                    res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-select-your-address');
                })
                .catch(error => {
                    console.log(error);
                    res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-no-address-found');
                });
        } else {
            res.redirect('/v4/acting-for-member/bereavement-journey/estate/lookup-estate-address');
        }
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/lookup-estate-address');
    }
});

// Bereavement journey - estate address manual
router.post('/bereavement-journey/estate/estate-address-manual', function (req, res) {
    var addressLine1 = req.session.data['address-line-1'];
    var townOrCity = req.session.data['address-town'];

    if (addressLine1 && townOrCity) {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-check-your-answers');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-address-manual');
    }
});

// Bereavement journey - estate select address
router.post('/bereavement-journey/estate/estate-select-your-address', function (req, res) {
    var address = req.session.data['address'];

    if (address) {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-check-your-answers');
    } else {
        res.redirect('/v4/acting-for-member/bereavement-journey/estate/estate-select-your-address');
    }
});

// Bereavement journey - estate no address found
router.post('/bereavement-journey/estate/estate-no-address-found', function (req, res) {
    res.redirect('/v4/acting-for-member/bereavement-journey/estate/lookup-estate-address');
});

// Bereavement journey - estate check your answers
router.post('/bereavement-journey/estate/estate-check-your-answers', function (req, res) {
    res.redirect('/v4/acting-for-member/bereavement-journey/check-your-answers');
});

//bereavement journey - declaration
router.post('/bereavement-journey/declaration', function (req, res) {
    res.redirect('/v4/acting-for-member/bereavement-journey/confirmation');
});

//bereavement journey - check your answers
router.post('/bereavement-journey/check-your-answers', function (req, res) {
    res.redirect('/v4/acting-for-member/bereavement-journey/declaration');
});

// ************************************************
// MEMBERS / acting-for-member JOURNEYS
// ************************************************
// THIRD PARTY -acting-for-member-query- Asking on behalf od a member



router.post('/member/enter-your-email', (req, res) => {

    res.redirect('enter-your-name');

});


router.post('/member/member-membership-number', (req, res) => {

  var answer = req.session.data['member-membership-number'];

  if (answer === "Yes, I know the membership number") {
    res.redirect('members-name');
  } else if (answer === "No, I do not know the membership number") {
    res.redirect('member-national-insurance-number'); // wherever "No" should go
  } else {
    res.redirect('member-national-insurance-number'); // or an "I'm not sure" path
  }
});


// MEMBER - Do you know your membership number?
router.post('/member/member-membership-number', (req, res) => {

    var memberNumber = req.session.data['member-membership-number']

    if (memberNumber == 'Yes, I know the membership number') {
        res.redirect('members-name')
    } else if (memberNumber == "No, I do not know the membership number") {
        res.redirect('member-national-insurance-number');
    } else if (memberNumber == "I'm not sure") {
        res.redirect('member-national-insurance-number');
    }else {
        res.redirect('member-membership-number')
    }
});


// THIRD PARTY - What is your name?

router.post('/member/enter-your-name', function (req, res) {

    var firstName = req.session.data['firstName'];
    var lastName = req.session.data['lastName'];

    if (firstName && lastName) {
        res.redirect('enter-your-email');
    } else {
        res.redirect('enter-your-name');
    }

});

// THIRD PARTY - What is your email?

router.post('/member/enter-your-email', function (req, res) {

    var emailAddress = req.session.data['emailAddress'];

    if (emailAddress) {
        res.redirect('reason-for-contact');
    } else {
        res.redirect('enter-your-email');

    }
});

// MEMBER - What is your national insurance number?

router.post('/member/member-national-insurance-number', function (req, res) {
    
    let nino = req.session.data['natInsNum'];
 
    // Remove all spaces and normalize to uppercase
    nino = (nino || '').replace(/\s+/g, '').toUpperCase();

    const regex = new RegExp('^(?!BG|GB|KN|NK|NT|TN|ZZ)[A-CEGHJ-PR-TW-Z]{2}\\d{6}[A-D]$');

    if (nino) {
        if (regex.test(nino)|| nino === 'QQ123456C') { 
            res.redirect('members-name');  // Valid National Insurance Number
        } else {
            res.redirect('member-national-insurance-number');  // Invalid format
        }
    } else {
        res.redirect('member-national-insurance-number');  // Field is empty
    }

});

// THIRD PARTY- member -  What is the member's name?

router.post('/member/members-name', function (req, res) {

    var firstName = req.session.data['memberFirstName'];
    var lastName = req.session.data['memberLastName'];

    if (firstName && lastName) {
        res.redirect('../member/members-date-of-birth');
    } else {
        res.redirect('../member/members-name');
    }

});

// THIRD PARTY- member - What is the member's date of birth?

router.post('/member/members-date-of-birth', function (req, res) {

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

router.post('/member/lookup-members-address', function (req, res) {

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
router.post('/member/no-address-found', function (req, res) {

    res.redirect('lookup-members-address');

})

// THIRD PARTY- member - Enter members address manual

router.post('/member/members-address-manual', function (req, res) {

    var addressLine1 = req.session.data['address-line-1'];
    var townOrCity = req.session.data['address-town'];
    var postcodeManual = req.session.data['address-postcode'];

    if (addressLine1 && townOrCity && postcodeManual) {
        res.redirect('members-email');
    } else {
        res.redirect('members-email');
    }

})


// THIRD PARTY- member -Do you have the member's email address?

router.post('/member/members-email', (req, res) => {

    res.redirect('reason-for-contact');

});


// THIRD PARTY- member  - Reason for contact
router.post('/member/reason-for-contact', function (req, res) {

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
router.post('/member/check-your-answers', (req, res) => {

    res.redirect('confirmation');

});

//bereavement journey -acting-for-member - check-your-answers
router.post('/bereavement-journey/acting-for-member/check-your-answers', (req, res) => {

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

module.exports = router;