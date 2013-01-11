## Bootic tracker

```html
<script type="text/javascript">
  var _btc = _btc || [];
  _btc.push(['_setLogger', true]);
  _btc.push(['_trackPageview']);
  _btc.push(['_trackEvent', {foo:1}]);
  
  ;(function() {
    var t   = document.createElement('script');
    t.type  = 'text/javascript';
    t.async = true;
    t.id    = 'bootic-tracker';
    t.setAttribute('data-account', 'test_account');
    t.setAttribute('data-app', 'bootic_tracker_app');
    t.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + "js.bootic.net/tracker/0.0/tracker.min.js";
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(t, s);
  })();
</script>
```

## Build and minify

    $ rake build
    
## Upload to S3

You'll need the BOOTIC_S3_KEY and BOOTIC_S3_SECRET variables in your environment, then:

    $ rake release
    
## License

tracker.js

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