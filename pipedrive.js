const fetch = require('node-fetch');

const pipedrive = (vars, email, ctaLocation) => {
  const pipedriveApiToken = vars.pipedrive_api_token;
  const pipedriveStageId = vars.pipedrive_stage_id;

  if (!pipedriveApiToken || !pipedriveStageId) return;

  const postBody = {
    title: `${ctaLocation && ctaLocation + ': '}${email}`,
    stage_id: pipedriveStageId
  }

  const promise = new Promise(resolve => {
    return fetch(`https://api.pipedrive.com/v1/deals?api_token=${pipedriveApiToken}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody),
    })
    .then(response => response.json())
    .then(data => {
      console.log('pipedrive success:', data);
      resolve();
      return;
    })
    .catch(error => {
      console.log('pipedrive error:', error);
      resolve();
      return;
    });
  });

  return promise;
}

module.exports = { pipedrive };
