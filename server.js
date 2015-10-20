var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var path = require('path');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'View')));
//Store all HTML files in view folder.
// app.use(express.static(__dirname + '/Script'));

app.use(bodyParser.urlencoded({ extended: false }));


app.get('/scrape', function(req, res){
  console.log("CALLLLED")
  res.sendFile('/form.html')
});

app.post('/scraper', function(req, res) {
  var url = req.body.url;
  request(url, function(error, response, html) {
    if(!error) {
      var $ = cheerio.load(html);

      var title, release, rating;
      var json = { title : " ", release : " ", rating: " "};
    
      $('.header').filter(function() {
        var data = $(this);

        title = data.children().first().text();
        release = data.children().last().children().text();
        
        json.title = title;
        json.release = release;
      })

      $('.star-box-giga-star').filter(function() {
        var data = $(this);

        rating = data.text();

        json.rating=rating;
      })
    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
      console.log('File successfully written!');
      res.sendFile('thanks.html');
    });

  })
});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
