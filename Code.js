/*
  Create RSS Feed of Youtube search results
  Written by @abeperl
  Based on http://www.labnol.org/internet/twitter-rss-feed/28149/  
*/

function doGet(e) {

  var search = e || {"parameter": { "search": "vuetify"}};
  var title  = ("Youtube RSS Feed for " + search.parameter.search),
      timez  = Session.getScriptTimeZone(),
      search = encodeURIComponent(search.parameter.search),
      link   = ("https://www.youtube.com/results?search_query=" + search),
      self   = ScriptApp.getService().getUrl() + "?" + search;
        
  var rss='<?xml version="1.0"?>';
  rss+='<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">';
  rss+='<channel><title>'+title+'</title>';
  rss+='<link>'+link+'</link>';
  rss+='<atom:link href="'+self+'" rel="self" type="application/rss+xml" />';
  rss+='<description>' + title + ' updated on ' + new Date() + '.</description>';
  
  var results = YouTube.Search.list('id, snippet', {
    q: search,
    maxResults: 50,
    order: 'date'
  });
  
  for (var i = 0; i < results.items.length; i++){
    var item = results.items[i];
    rss += "<item>";
    rss += "<title>" + item.snippet.title + "</title>";
    rss += "<link>http://www.youtube.com/watch?v=" + item.id.videoId + "</link>";
    rss += "<description>" + item.snippet.description + "</description>";
    rss += "<pubDate>" + Utilities.formatDate(new Date(item.snippet.publishedAt), timez, "EEE, dd MMM yyyy HH:mm:ss Z") + "</pubDate>";
    rss += "<guid>http://www.youtube.com/watch?v=" + item.id.videoId + "</guid>";
    rss += "</item>";
  }
  
  rss+="</channel></rss>";
  
  return ContentService.createTextOutput(rss).setMimeType(ContentService.MimeType.RSS);
}