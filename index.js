const validator = require('validator');
const Mailchimp = require('mailchimp-api-v3');

exports.handler = (event, _, callback) => {
  const body = JSON.parse(event.body)
  const email = body.email;
  
  if (!email) {
    respond(422, { message: "Email address not detected in request body" }, callback);
    return;
  };

  if (!validator.isEmail(email)) {
    respond(422, { message: `${email} is not a valid email address` }, callback);
    return;
  };

  if (event.requestContext.stage === 'dev') {
    respond(200, { message: `Successfully subsicribed ${email} (jk this is a dev environment)` }, callback);
    return;
  }

  const apiKey = event.stageVariables.mailchimp_api_key;
  const listId = event.stageVariables.mailchimp_list_id;

  if (!apiKey || !listId) {
    respond(500, { message: `Add Mailchimp API Key and List ID to API Gateway Deployment Stage` }, callback);
    return;
  }

  const mailchimp = new Mailchimp(apiKey);
  mailchimp.post(`/lists/${listId}/members`, {
    email_address : email,
    status : 'subscribed'
  }).then(function(results) {
    console.log(results);
    respond(200, { message: `Successfully subscribed ${email}` }, callback);
    return;
  }).catch(function(err) {
    console.log(err);
    if (err.title === "Member Exists") {
      respond(400, { message: `${email} is already subscribed` }, callback);
      return;
    }
    respond(500, { message: `There was an error subscribing ${email}` }, callback);
  });
};

function respond(code, body, callback) {
  callback(null, { 
    statusCode: code,
    body: JSON.stringify(body)
  });
}
