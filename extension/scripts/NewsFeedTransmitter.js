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
            "success": blob => {
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
                                chrome.tabs.query({
                                    "currentWindow": true,
                                    "active": true
                                }, tabs => {
                                    const index = ++tabs[0].index;
                                    chrome.tabs.create({
                                        "url": authorURL,
                                        "active": true,
                                        "index": index
                                    });
                                });
                            }
                        }
                    });
                }
            },
            "error": err => {
                this.notifyError(err);
            }
        });
    }

    notifyError(error, errorDetail) {
        let errMsg = error;
        if(typeof errorDetail === "string" && errorDetail !== "") {
            errMsg = `${errMsg}: ${errorDetail}`;
        }
        if(sessionStorage.getItem("previousError") === error) {
            return;
        }
        sessionStorage.setItem("previousError", error);
        console.error(error, errorDetail);
        if(typeof chrome === "object" && typeof chrome.notifications === "object") {
            chrome.notifications.create({
                "type": "basic",
                "iconUrl": chrome.extension.getURL("icons/icon-80.png"),
                "title": "GitHub news feed",
                "message": errMsg
            });
        }
    }

}
