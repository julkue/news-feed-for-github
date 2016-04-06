/******************************************************
 * News Feed for GitHub
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
        chrome.tabs.query({
            "currentWindow": true
        }, tabs => {
            let opened = -1;
            let index = 0;
            for(let tab of tabs) {
                if(tab.url.startsWith(instance.ghURL)) {
                    opened = tab.id;
                } else if(tab.active) {
                    index = ++tab.index;
                }
            }
            if(opened === -1) {
                chrome.tabs.create({
                    "url": instance.ghURL,
                    "active": true,
                    "index": index
                });
            } else {
                chrome.tabs.update(opened, {
                    "active": true
                });
            }
        });
    });
}
