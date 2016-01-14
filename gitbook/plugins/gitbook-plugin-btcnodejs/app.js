require(["gitbook", "lodash", "jQuery"], function(gitbook, _, $) {
    gitbook.events.bind("page.change", function() {
        var $link = $(".gitbook-link")[0];
        $link.text = "撰写并维护: @imfly";
        $link.href = "http://book.btcnodejs.com"
    });
});

