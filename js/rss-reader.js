/*
    Date: 2016-01-06
*/
//
var currentFeed = {
    // reset when click('.feedLink')
    RSS           : "https://cordova.apache.org/feed.xml",
    entries       : [],
    // reset when getFeed();
    title         : "",
    description   : "",
    length        : "",
    lastBuildDate : "",
    selectedStory : ""
};

var readerApp = {
    self : {},
    needFeed : true,
    //
    init : function () {
        console.log("readerApp.init");
    },
    getFeed : function(externalElements) {
        externalElements['status']('Contacting Server ...');
        $.get(currentFeed.RSS, function(data, errorCode) {
            externalElements['status']('Got Feed.');
            // let's see if it will parse
            try {
                var xml           = $( data );
                externalElements['status']('xml make object okay');
            }
            catch(err) {
                externalElements['status']('Cannot create xml Object.');
                return;
            }
            //
            var title         = xml.find( "title" );
            var description   = xml.find( "description" );
            var items         = xml.find( "item" );
            var lastBuildDate = xml.find( "lastBuildDate" );
            // assign 
            currentFeed.title         = title.text();
            currentFeed.description   = description.text();
            currentFeed.lastBuildDate = lastBuildDate.text();
            currentFeed.length        = items.length;
            externalElements['status']('title:' + title.text() + ":" + items.length);
            // Parse our object
            currentFeed.entries = [];
            $.each(items, function(i, v) {
                entry = {
                    title:$(v).find("title").text(),
                    link:$(v).find("link").text(),
                    description:$.trim($(v).find("description").text())
                };
                currentFeed.entries.push(entry);
            });
            externalElements['draw'](currentFeed);
            externalElements['status']('Done.');
        });
    },
    getStory : function (displayFunc) {
        var theStory = currentFeed.entries[currentFeed.selectedStory];
        // fire only if we have a valid reference for theStory and a displayFunc.
        if (theStory && displayFunc) {
            displayFunc(theStory);
        }
    },
}
