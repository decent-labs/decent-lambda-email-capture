const codes = {
  success: {
    status: 200,
    code: 10,
    message: email => `Successfully subscribed ${email}`
  },

  error: {
    badRequest: {
      noEmail: {
        status: 422,
        code: 20,
        message: () => "Email address not detected in request body"
      },
      notValidEmail: {
        status: 422,
        code: 21,
        message: email => `${email} is not a valid email address`
      }
    },

    mailchimp: {
      alreadySubscribed: {
        status: 400,
        code: 30,
        message: email => `${email} is already subscribed`
      }
    },

    internal: {
      unknown: {
        status: 500,
        code: 50,
        message: email => `There was an error subscribing ${email}`
      },
      badConfig: {
        status: 500,
        code: 51,
        message: () => "Add Mailchimp API Key and List ID to API Gateway Deployment Stage"
      }
    }
  }
};

const respond = (code, email, callback) => {
  const body = {
    code: code.code,
    message: code.message(email)
  };

  callback(null, {
    statusCode: code.status,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Content-Type": "application/json"
    }
  });
};

module.exports = { codes, respond }
