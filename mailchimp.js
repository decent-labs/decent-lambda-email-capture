const Mailchimp = require('mailchimp-api-v3');

const mailchimp = (vars, email, ctaLocation) => {
  const mailchimpApiKey = vars.mailchimp_api_key;
  const mailchimpListId = vars.mailchimp_list_id;

  if (!mailchimpApiKey || !mailchimpListId) return;

  const postBody = { email_address: email, status: 'subscribed' };
  const interestId = vars.mailchimp_interest_id;
  if (interestId) postBody.interests = { [interestId]: true };
  if (ctaLocation) postBody.tags = [ ctaLocation ];

  const mailchimp = new Mailchimp(mailchimpApiKey);

  const promise = new Promise(resolve => {
    return mailchimp.post(`/lists/${mailchimpListId}/members`, postBody).then(results => {
      console.log('mailchimp success:', results);
      resolve();
      return;
    }).catch(err => {
      console.log('mailchimp error:', err);
      resolve();
      return;
    });
  });

  return promise;
}

module.exports = { mailchimp };
