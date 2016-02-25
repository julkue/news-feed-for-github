/******************************************************
 * GitHub news feed
 * Copyright (c) 2016, Julian Motz
 * For the full copyright and license information,
 * please view the LICENSE file that was distributed
 * with this source code.
 *****************************************************/
"use strict";

// Initialize notifications
sessionStorage.clear(); // just necessary while developing
let instance = new NewsFeedTransmitter();

// Initialize icon click action
if(typeof chrome === "object" && typeof chrome.browserAction === "object") {
    chrome.browserAction.onClicked.addListener(() => {
        chrome.tabs.create({
            "url": "https://github.com/"
        });
    });
}
