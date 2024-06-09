const clgDev = require('../utils/clgDev');
const ErrorResponse = require('../utils/ErrorResponse');
const emailSender = require('../utils/emailSender');
const { contactUsEmail } = require('../mail/templates/contactFormRes');

// @desc      Contact us
// @route     POST /api/v1/other/contactus
// @access    Public
exports.contactUs = async (req, res, next) => {
  try {
    const { firstName, lastName, email, countryCode, phoneNo, message } = req.body;

    console.log(email);

    // Check if any required field is missing
    if (!(firstName && lastName && email && countryCode && phoneNo && message)) {
      return next(new ErrorResponse('Some fields are missing, including email', 400));
    }
      
    console.log(email + "this is the")
    try {
      
      const mailResponse1 = await emailSender(
        process.env.SITE_OWNER_EMAIL,
        `Contact Me - ${message.substring(0, 10)} ...`,
        `
          <h1>Someone requested to contact you</h1>
          <h2>Contact Details</h2>
          <p> Name : ${firstName} ${lastName}</p>
          <p> Email : ${email}</p>
          <p> Phone No : ${countryCode} ${phoneNo}</p>
          <p> Message : ${message}</p>
          <h2>Kindly contact them, and solve their problem as soon as possible.</h2>
          <h1>Thank You !</h1>
        `
      );

      console.log(email + "here i am");

      const mailResponse2 = await emailSender(
        email,
        'Your Data sent to us successfully',
        contactUsEmail(email, firstName, lastName, message, phoneNo, countryCode)
      );

      console.log(mailResponse2);

      return res.json({
        success: true,
        data: 'Details sent successfully',
      });
    } catch (err) {
      return next(new ErrorResponse('Error occurred while sending email', 500));
    }
  } catch (err) {
    return next(new ErrorResponse('Details send failed', 500));
  }
};
