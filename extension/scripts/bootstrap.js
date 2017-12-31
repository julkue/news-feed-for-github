/* globals NewsFeedTransmitter */
/******************************************************
 * News Feed for GitHub
 * Copyright (c) 2016–2018, Julian Kühnel
 * For the full copyright and license information,
 * please view the LICENSE file that was distributed
 * with this source code.
 *****************************************************/
'use strict';

// Specify environment, either "firefox" or "chrome" as some features are
// limited. Is replaced in the build for the respective target.
const environment = 'chrome'; // eslint-disable-line no-unused-vars

// Initialize notifications
sessionStorage.clear(); // just necessary while developing
let instance = new NewsFeedTransmitter();

// Initialize icon click action
if (typeof chrome === 'object' && typeof chrome.browserAction === 'object') {
  chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.query({
      'currentWindow': true
    }, tabs => {
      let opened = -1;
      let index = 0;
      for (let tab of tabs) {
        if (tab.url === instance.ghURL + '/') {
          opened = tab.id;
        } else if (tab.active) {
          index = ++tab.index;
        }
      }
      if (opened === -1) {
        chrome.tabs.create({
          'url': instance.ghURL,
          'active': true,
          'index': index
        });
      } else {
        chrome.tabs.update(opened, {
          'active': true
        });
      }
    });
  });
}
