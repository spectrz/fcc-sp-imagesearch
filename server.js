var express = require('express');
var app = express();
var fs = require('fs');

var imageSearch = require('node-google-image-search');

//contains search history
var searchHist = [];

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


//image search
app.get('/search/:urlpar', function ( req, res ) {
  //console.log(req);
  
  //get search string and offset
  var searchStr = req.params.urlpar;
  var offset = req.query.offset;
  console.log("Search: " + searchStr + ', Offset: ' + offset);
  console.log( 'query: ' + JSON.stringify(req.query) + Object.keys(req.query).length );
  
  //check for errors
  if ( Object.keys(req.query).length >0 && isNaN(offset) ){
    console.log("error");
    res.end("error");
    return;
  }
  
  console.log("offset: " + offset);
  
  //get search results
  getImgs( searchStr, offset, function(srchRes) {
    //console.log(srchRes);
    
    //clean up stuff we dont need
    var slimObj = srchRes.map( function( a ){
      return { 'url': a.link
             , 'altText': a.snippet
             , 'pageUrl': a.image.contextLink }
    });
    
    //console.log(slimObj);
  
    res.end(JSON.stringify(slimObj));
    
    
    //save search term in history
    var shObj = {};
    
    shObj.term = searchStr;
    shObj.when = Date().toLocaleString();
    
    searchHist.push(shObj);
    
    //clear old
    if ( searchHist.length > 10 ) searchHist = searchHist.slice(searchHist.length - 10,searchHist.length);
    
    fs.writeFile('searchHist.txt', JSON.stringify(searchHist), function ( err ) {
      if ( err ) throw err;
    });
    
  });
  
  
});


//return latest searches
app.get('/latest', function ( req, res ) {
  res.end(JSON.stringify(searchHist));
});

var listener = app.listen(process.env.PORT, function(){
  console.log('Init, port: ' + listener.address().port)
});
 
//init
fs.readFile('searchHist.txt', function ( err, data) {
  if ( err ) throw err;
  searchHist = JSON.parse(data);
});

function getImgs(searchStr, offset, callback)
{
  //comment lines to change modes
  //test just returns saved data for testing
  //live actually does the search
  
  var retrieveMode = 'live';
  //var retrieveMode = 'test';
  
  if ( offset === undefined ) offset = 0;
  var index = parseInt(offset);

  
  if ( retrieveMode === 'test'){
    fs.readFile('imgSearch.txt', function (err, dat){
      var jdat = JSON.parse(dat)
      
      console.log('loaded');
      var jdat2 = jdat.slice(index, index + 4 );
      callback( jdat2 );
    });
  }
  else if ( retrieveMode === 'live') {
    imageSearch(searchStr, function(results){
      console.log('live');
      //console.log(results);
      // fs.writeFile('imgSearch.txt', JSON.stringify(results), function ( err, data ){
      //   if ( err ) throw err;
      // });
      //console.log(results);
      //res.end(results);
      callback( results);
    },index,10);
  }

}