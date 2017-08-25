/* globals NewsFeedChecker, environment */
/******************************************************
 * News Feed for GitHub
 * Copyright (c) 2016–2017, Julian Motz
 * For the full copyright and license information,
 * please view the LICENSE file that was distributed
 * with this source code.
 *****************************************************/
'use strict';
class NewsFeedTransmitter extends NewsFeedChecker { // eslint-disable-line no-unused-vars

  constructor() {
    super();
    super.initialize(
      this.notifyPost.bind(this),
      this.notifyError.bind(this)
    );
  }

  notifyPost(post) {
    console.debug('GitHub news feed', post);
    let message = post['title'][0]['_text'];
    let authorImage = post['thumbnail'][0]['_attr']['url']['_value'];
    let authorURL = post['author'][0]['uri'][0]['_text'];
    let author = post['author'][0]['name'][0]['_text'];

    super.xhr({
      'cache': true,
      'url': authorImage,
      'responseType': 'blob',
      'success': blob => {
        const blobURL = window.URL.createObjectURL(blob),
          // as FF does not support the callback function
          // it is necessary to generate the id manually
          notifyPostID = Math.random().toString(36).slice(2);
        let notificationOptions = {
          'type': 'basic',
          'iconUrl': chrome.extension.getURL('icons/icon-80.png'),
          'title': 'GitHub news feed',
          'message': message
        };
        // FF does not support the buttons property
        // http://tinyurl.com/jxjgg5o
        if (environment === 'chrome') {
          notificationOptions['buttons'] = [
            {
              'title': `View ${author}`,
              'iconUrl': blobURL
            }
          ];
        }
        chrome.notifications.create(
          notifyPostID,
          notificationOptions
        );
        // FF does not support the button events for notifications
        if (environment === 'chrome') {
          chrome.notifications.onButtonClicked.addListener(
            (notifId, btnIdx) => {
              if (notifId === notifyPostID && btnIdx === 0) {
                chrome.tabs.query({
                  'currentWindow': true,
                  'active': true
                }, tabs => {
                  let opts = {
                    'url': authorURL,
                    'active': true,
                  };
                  if (tabs.length) {
                    opts['index'] = tabs[0].index + 1;
                  }
                  chrome.tabs.create(opts);
                });
              }
            }
          );
        }
      },
      'error': err => {
        this.notifyError(err);
      }
    });
  }

  notifyError(error, errorDetail) {
    let errMsg = error;
    if (typeof errorDetail === 'string' && errorDetail !== '') {
      errMsg = `${errMsg}: ${errorDetail}`;
    }
    if (sessionStorage.getItem('previousError') === error) {
      return;
    }
    sessionStorage.setItem('previousError', error);
    console.error(error, errorDetail);
    chrome.notifications.create({
      'type': 'basic',
      'iconUrl': chrome.extension.getURL('icons/icon-80.png'),
      'title': 'GitHub news feed',
      'message': errMsg
    });
  }

}
