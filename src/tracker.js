;(function (document, Math, navigator, window) {
  var image = new Image(),
      session_id = '_btic_track_sid_',
      trackingHost = '<TRACKING_HOST>',
      protocol = ('https:' == document.location.protocol ? 'https://' : 'http://');
  
  var Tracker = function (accountId, appName) {
    this.accountId  = accountId;
    this.appName    = appName;
    this._logging   = false
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
      return Math.round(new Date().getTimezoneOffset() / 60); // -2, 4, etc
    },
    
    url: function (evtType) {
      var u = [protocol, trackingHost, 'r', this.appName, this.accountId, evtType].join('/')
      u += "?r="    + this.resource();
      u += "&ref="  + this.referrer();
      u += "&tt="   + this.title();
      u += "&h="    + this.domain();
      u += "&user=" + this.sessionId();
      u += "&ua="   + this.agent();
      u += "&path=" + this.path();
      u += "&tz="   + this.timezoneOffset()

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
      var session_id = this.getCookie(session_id)
      if(!session_id) {
        session_id = new Date().getTime() + Math.random() + Math.random()
        this.setCookie(session_id, session_id)
      }
      return session_id
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
    
    _trackEvent: function (evtData) {
      this.log('pageevent', evtData)
      image.src = this.url('pageevent')
    },
    
    _setLogger: function (bool) {
      this._logging = bool
    }
  }
  
  /* instantiate tracker object */
  var s         = document.getElementById('bootic-tracker');
  var accountId = s.getAttribute('data-account');
  var appName   = s.getAttribute('data-app');
  var _tracker = new Tracker(accountId, appName);
  
  /* iterate registered events and push them to tracker instance */
  for(var i = 0; i < window._btc.length; i++) {
    _tracker.push(window._btc[i])
  }
  
  /* Replace global _btc object. From now on you will be pushing events directly onto tracker instance */
  window._btc = _tracker;
  
})(document, Math, navigator, window);