var site_id=1;
var pkBaseURL = (("https:" == document.location.protocol) ? "https://piwik.iasa.com.ua/" : "http://piwik.iasa.com.ua/");
document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));
try {
var piwikTracker = Piwik.getTracker(pkBaseURL + "piwik.php", 1);
piwikTracker.trackPageView();
piwikTracker.enableLinkTracking();
} catch( err ) {}

