/*  tracker.js, version 0.0.4

Copyright (c) 2013 Ismael Celis for Bootic S.P.A. (http://bootic.net)

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
------------------------------------------------------------------*/
;(function (document, Math, navigator, window) {
  var image = new Image(),
      session_id = '_btic_track_sid_',
      trackingHost = 'tracker.bootic.net',
      protocol = (document.location.protocol + '//');
  
  var Tracker = function (accountId, appName) {
    this.accountId  = accountId;
    this.appName    = appName;
    this._logging   = true
  }
  
  Tracker.prototype = {
    resource: function () {
      return this.escape(document.location.href)
    },
    
    escape: function (a) {
      return (typeof(encodeURIComponent) == 'function') ? encodeURIComponent(a) : escape(a)
    },
    
    referrer: function () {
      var a = '';
      try {
        a = top.document.referrer
      } catch (e1) {
        try {
          a = parent.document.referrer
        } catch (e2) {
          a = ''
        }
      }
      if (a == '') {
        a = document.referrer
      }
      return this.escape(a)
    },
    
    path: function () {
      return location.pathname;
    },
    
    domain: function () {
      return window.location.hostname
    },
    
    title: function () {
      return (document.title && document.title != "") ? this.escape(document.title) : ''
    },
    
    agent: function () {
      return this.escape(navigator.userAgent)
    },
    
    timezoneOffset: function () {
      return Math.round(new Date().getTimezoneOffset() / 60) * -1; // -2, 4, etc
    },
    
    url: function (evtType, evtName) {
      var u = protocol + [trackingHost, 'r', this.appName, this.accountId, evtType].join('/');
      u += "?r="    + this.resource();
      u += "&ref="  + this.referrer();
      u += "&tt="   + this.title();
      u += "&h="    + this.domain();
      u += "&user=" + this.sessionId();
      u += "&path=" + this.path();
      u += "&tz="   + this.timezoneOffset()
      u += "&_ts="   + new Date().getTime();
      if(evtName) {
        u += "&status=" + evtName
      }

      return u
    },
    
    setCookie: function (a, b, d) {
      var f, c;
      b = escape(b);
      if (d) {
        f = new Date();
        f.setTime(f.getTime() + (d * 1000));
        c = '; expires=' + f.toGMTString()
      } else {
        c = ''
      }
      document.cookie = a + "=" + b + c + "; path=/"
    },
    
    getCookie: function (a) {
      var b = a + "=",
          d = document.cookie.split(';');
      for (var f = 0; f < d.length; f++) {
        var c = d[f];
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length)
        }
        if (c.indexOf(b) == 0) {
          return unescape(c.substring(b.length, c.length))
        }
      }
      return null
    },
    
    sessionId: function () {
      var uid = this.getCookie(session_id)
      if(!uid) {
        var tstamp = new Date().getTime() + Math.random() + Math.random()
        this.setCookie(session_id, tstamp)
      }
      return tstamp
    },
    
    log: function () {
      if(!this._logging) return;
      if('console' in window && 'log' in window.console) {
        var args = Array.prototype.slice.call(arguments)
        args.unshift('[_btc]')
        window.console.log.call(window.console, args)
      }
    },
    
    /* #push(['init', 'accountId']) */
    push: function (opAndArgs) {
      var op    = opAndArgs[0],
          args  = opAndArgs[1];

      this[op].call(this, args)
    },
    
    /* Call these via #push() */
    _trackPageview: function () {
      this.log('pageview')
      image.src = this.url('pageview')
    },
    
    _trackEvent: function (evtType, evtName) {
      this.log('pageevent', evtType)
      image.src = this.url(evtType, evtName)
    },
    
    _setLogger: function (bool) {
      this._logging = bool
    },
    
    _setTrackingHost: function (host) {
      trackingHost = host
    }
  }
  
  /* instantiate tracker object */
  var s         = document.getElementById('bootic-tracker');
  var accountId = s.getAttribute('data-account');
  var appName   = s.getAttribute('data-app');
  var _tracker = new Tracker(accountId, appName);
  
  /* iterate registered events and push them to tracker instance */
  if(window._btc == undefined) {
    throw new Error("You need to define _btc global array")
  }
  
  for(var i = 0; i < window._btc.length; i++) {
    _tracker.push(window._btc[i])
  }
  
  /* Replace global _btc object. From now on you will be pushing events directly onto tracker instance */
  window._btc = _tracker;
  
})(document, Math, navigator, window);
