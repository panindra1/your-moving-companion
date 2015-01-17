
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var location = $('#city').val();
    var address = street + "," + location;

    if(street != '' && location != '') {
        var url = "https://maps.googleapis.com/maps/api/streetview?size= 600x300&location="+address; 
        //alert(url );
        $body.append('<img class = "bgimg" src="'+url+'"></img>');
    }

    var nyUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+location+"&api-key=YOUR KEY";
    
    $.getJSON( nyUrl, function( data ) {
        $nytHeaderElem.text("New York Times Articles about" + location);
        $.each( data.response.docs, function( key, val ) {
            var article = data.response.docs[key];
            $nytElem.append( "<li calss ='article'> <a href ='"+ article.web_url+"'>"+article.headline.main+"</a><p>"+article.snippet+"</p></li>" );
        });
    })
    .error(function() {
        $nytHeaderElem.text("New York Times Articles about" + location+ "cannot be loaded");
    });
    
    var wikirequestTimeout = setTimeout(function(){
        $wikiElem.text("Your wiki API is taking too long");
    });
    
    var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search="+location+"&format=json&callback=wikicallback";
    //alert(wikiUrl);
    $.ajax( {
        url: wikiUrl,
        dataType:'jsonp',
        success: function(data) {
            var articleList = data[1];
            console.log(articleList);
            
            $.each( articleList, function( key, val ) {
             var articleStr = articleList[key];
             var url = "http://en.wikipedia.org/wiki/" + articleStr;
            $wikiElem.append( "<li> <a href ='"+ url+"'>"+articleStr+"</a></li>" );
        });      
        }
    });


    return false;
};

$('#form-container').submit(loadData);

// loadData();
