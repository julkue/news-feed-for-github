/******************************************************
 * News Feed for GitHub
 * Copyright (c) 2016, Julian Motz
 * For the full copyright and license information,
 * please view the LICENSE file that was distributed
 * with this source code.
 *****************************************************/
"use strict";
class NewsFeedTransmitter extends NewsFeedChecker {

    constructor() {
        super();
        super.initialize(
            this.notifyPost.bind(this),
            this.notifyError.bind(this)
        );
    }

    notifyPost(post) {
        console.debug(post);
        let message = post["title"][0]["_text"];
        let authorImage = post["thumbnail"][0]["_attr"]["url"]["_value"];
        let authorURL = post["author"][0]["uri"][0]["_text"];
        let author = post["author"][0]["name"][0]["_text"];

        super.xhr({
            "cache": true,
            "url": authorImage,
            "responseType": "blob",
            "success": (blob) => {
                let blobURL = window.URL.createObjectURL(blob);
                if(typeof chrome === "object" && typeof chrome.notifications === "object") {
                    // as FF does not support the callback function
                    // it is necessary to generate the id manually
                    let notifyPostID = (0.5).toString(36).substr(2, 16);
                    chrome.notifications.create(notifyPostID, {
                        "type": "basic",
                        "iconUrl": chrome.extension.getURL("icons/icon-80.png"),
                        "title": "GitHub news feed",
                        "message": message,
                        "buttons": [{
                            "title": `View ${author}`,
                            "iconUrl": blobURL
                        }]
                    });
                    chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
                        if(notifId === notifyPostID) {
                            if(btnIdx === 0) {
                                chrome.tabs.create({
                                    "url": authorURL
                                });
                            }
                        }
                    });
                }
            },
            "error": (err) => {
                this.notifyError(err);
            }
        });
    }

    notifyError(err) {
        if(sessionStorage.getItem("previousError") === err) {
            return;
        }
        sessionStorage.setItem("previousError", err);
        console.error(err);
        if(typeof chrome === "object" && typeof chrome.notifications === "object") {
            chrome.notifications.create({
                "type": "basic",
                "iconUrl": chrome.extension.getURL("icons/icon-80.png"),
                "title": "GitHub news feed",
                "message": err
            });
        }
    }

}
