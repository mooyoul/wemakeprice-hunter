'use strict';

const
  request = require('request');


const
  SLACK_USERNAME = 'your_slack_username',
  SLACK_INCOMING_WEBHOOK_ENDPOINT = 'https://hooks.slack.com/YOUR_SLACK_WEBHOOK_ENDPOINT_URL',
  WMP_PRODUCT_OPTIONS_ENDPOINT = 'http://www.wemakeprice.com/c/deal_option/get_option_info/',
  FETCH_TARGETS = ['939193', '945691', '931034', '991296'],
  FETCH_INTERVAL = 5000;


const notify = (targetId, availableOptions) => {
  console.log('==== FOUND  !!!!! ==============================\n%s\n============================================', JSON.stringify(availableOptions, null, 2));
  availableOptions.forEach((option) => {
    request({
      method: 'POST',
      url: SLACK_INCOMING_WEBHOOK_ENDPOINT,
      body: {
        text: `Hey @${SLACK_USERNAME} WMP Target ID ${targetId} is available with option ${option.value && option.value.option_value} now! <http://www.wemakeprice.com/deal/adeal/${targetId}|Click here> for details!`
      }
    }, (e, xhr, body) => {
      console.log('Notify to slack - HTTP Response status code: %d', xhr.statusCode);
    });
  });
};

const fetch = (targetId) => {
  request({
    method: 'GET',
    url: `${WMP_PRODUCT_OPTIONS_ENDPOINT}${targetId}`,
    json: true
  }, (e, xhr, body) => {
    if (e) {
      console.error(e);
      return setTimeout(() => fetch(targetId), FETCH_INTERVAL);
    }


    if (body.result !== 1) {
      console.error('body.result isnt 1');
      return setTimeout(() => fetch(targetId), FETCH_INTERVAL);
    }

    let options = (body.result_set && body.result_set.option_info && body.result_set.option_info.list) || [];

    if (! options.length) {
      return setTimeout(() => fetch(targetId), FETCH_INTERVAL);
    }


    let eventOptions = options.filter((option) => ~((option.value && option.value.option_value) || '').indexOf('만우절'));
    if (!eventOptions.length) {
      console.log('targetId %s ended event');
    }

    console.error('%s: fetched %s, options: \t%s', new Date(), targetId, eventOptions.map((option) => `${option.value && option.value.option_value}/${option.value && option.value.remain_cnt}`).join(' ** '));

    let availableOptions = eventOptions.filter((option) => ((option.value && option.value.remain_cnt) || 0) > 0);

    if (!availableOptions.length) {
      return setTimeout(() => fetch(targetId), FETCH_INTERVAL);
    }

    notify(targetId, availableOptions);
  })
};



FETCH_TARGETS.forEach((targetId) => fetch(targetId));