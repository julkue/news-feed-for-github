/* globals xmlToJSON */
/******************************************************
 * News Feed for GitHub
 * Copyright (c) 2016–2017, Julian Motz
 * For the full copyright and license information,
 * please view the LICENSE file that was distributed
 * with this source code.
 *****************************************************/
'use strict';

class NewsFeed { // eslint-disable-line no-unused-vars

  constructor() {
    this.ghURL = 'https://github.com';
  }

  xhr(options) {
    let xmlhttp = new XMLHttpRequest();
    let url = options['url'];
    if (typeof options['cache'] !== 'boolean' || !options['cache']) {
      let divider = '&';
      if (url.indexOf('?') === -1) {
        divider = '?';
      }
      url = url + divider + (new Date().getTime());
    }
    if (typeof options['responseType'] === 'string') {
      xmlhttp.responseType = options['responseType'];
    }
    if (typeof options['withCredentials'] !== 'boolean' || options['withCredentials']) {
      xmlhttp.withCredentials = true;
    } else {
      xmlhttp.withCredentials = false;
    }
    xmlhttp.withCredentials = true;
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === XMLHttpRequest.DONE) {
        if (xmlhttp.status === 200) {
          if (typeof options['success'] === 'function') {
            if (options['responseType'] === 'blob') {
              options['success'](xmlhttp.response);
            } else {
              options['success'](xmlhttp.responseText);
            }
          }
        } else {
          if (typeof options['error'] === 'function') {
            options['error'](xmlhttp.statusText);
          }
        }
      }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  }

  getURL(successFn, errorFn) {
    if (sessionStorage.getItem('url')) {
      successFn(sessionStorage.getItem('url'));
      return;
    }
    this.xhr({
      'url': this.ghURL,
      'success': data => {
        let rss;
        try {
          let tmp = document.createElement('div');
          tmp.innerHTML = unescape(data);
          rss = tmp.querySelector('a.link-gray-dark');
          rss = rss.getAttribute('href');
          if (rss === null || rss === '') {
            throw new Error('err');
          }
        } catch (e) {
          errorFn('Log in to GitHub to receive news feed notifications!');
          return;
        }
        sessionStorage.setItem('url', this.ghURL + rss);
        successFn(sessionStorage.getItem('url'));
      },
      'error': errorThrown => {
        errorFn('Unable to load GitHub news feed URL', errorThrown);
      }
    });
  }

  load(successFn, errorFn) {
    this.getURL(url => {
      this.xhr({
        url,
        'responseType': 'text',
        'success': data => {
          let json;
          try {
            json = xmlToJSON.parseString(data, {
              'xmlns': false
            });
          } catch (e) {
            errorFn('Unable to parse news feed');
          }
          successFn(json);
        },
        'error': errorThrown => {
          errorFn('Unable to load GitHub news feed', errorThrown);
        }
      });
    }, errorFn);
  }

}
