const validator = require('validator');
const Mailchimp = require('mailchimp-api-v3');

const { codes, respond } = require('./responses');

exports.handler = (event, _, callback) => {
  const body = JSON.parse(event.body);
  const email = body.email;

  if (!email) {
    respond(codes.error.badRequest.noEmail, email, callback);
    return;
  }

  if (!validator.isEmail(email)) {
    respond(codes.error.badRequest.notValidEmail, email, callback);
    return;
  }

  if (event.requestContext.stage === 'dev') {
    respond(codes.success, email, callback);
    return;
  }

  const mailchimpApiKey = event.stageVariables.mailchimp_api_key;
  const mailchimpListId = event.stageVariables.mailchimp_list_id;

  if (!mailchimpApiKey || !mailchimpListId) {
    respond(codes.error.internal.badConfig, email, callback);
    return;
  }

  const postBody = { email_address: email, status: 'subscribed' };
  const interestId = event.stageVariables.mailchimp_interest_id;
  if (interestId) postBody.interests = { [interestId]: true };

  const mailchimp = new Mailchimp(mailchimpApiKey);
  mailchimp.post(`/lists/${mailchimpListId}/members`, postBody).then(function (results) {
    console.log(results);
    respond(codes.success, email, callback);
    return;
  }).catch(function (err) {
    console.log(err);
    if (err.title === "Member Exists") {
      respond(codes.error.mailchimp.alreadySubscribed, email, callback);
      return;
    }
    respond(codes.error.internal.unknown, email, callback);
  });
};
