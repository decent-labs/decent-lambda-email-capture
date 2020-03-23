const validator = require('validator');

const { codes, respond } = require('./responses');

exports.handler = (event, _, callback) => {
  const body = JSON.parse(event.body);
  const email = body.email;

  console.log(`new CTA`);
  console.log(`post body: ${JSON.stringify(body)}`);

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
};
