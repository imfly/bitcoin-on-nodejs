require(["gitbook", "jQuery"], function(gitbook, $) {

    var root = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]);

    gitbook.events.bind("start", function(e, config){
    });

    gitbook.events.bind("page.change", function(e){
        _hmt.push(['_trackEvent', location.pathname, 'page.change', '', '']);
    });

});
