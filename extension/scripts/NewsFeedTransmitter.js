/******************************************************
 * GitHub news feed
 * Copyright (c) 2016, Julian Motz
 * For the full copyright and license information,
 * please view the LICENSE file that was distributed
 * with this source code.
 *****************************************************/
"use strict";
class NewsFeedTransmitter {

    constructor() {
        let checker = new NewsFeedChecker(this.notifyPost, this.notifyError);
    }

    notifyPost(post) {
        let message = post["title"][0]["_text"];
        let authorImage = post["thumbnail"][0]["_attr"]["url"]["_value"];
        let authorURL = post["author"][0]["uri"][0]["_text"];
        let author = post["author"][0]["name"][0]["_text"];

        console.info(post);
        console.debug(`Author: '${author}'`);
        console.debug(`Author URL: ${authorURL}`);
        console.debug(`Author image: ${authorImage}`);

        if(typeof chrome === "object" && typeof chrome.notifications === "object") {
            chrome.notifications.create({
                "type": "basic",
                "iconUrl": chrome.extension.getURL("icons/icon-48.png"),
                "title": "GitHub news feed",
                "message": message
            });
        }
    }

    notifyError(err) {
        console.error(err);
        if(typeof chrome === "object" && typeof chrome.notifications === "object") {
            chrome.notifications.create({
                "type": "basic",
                "iconUrl": chrome.extension.getURL("icons/icon-48.png"),
                "title": "GitHub news feed",
                "message": err
            });
        }
    }

}
