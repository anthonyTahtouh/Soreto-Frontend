var express = require('express');
var app = express();
const path = require('path');

app.set('port', process.env.PORT || 4000);

//if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname,'/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/build/index.html'));
    });
//}

// Listen for requests
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Server running on port ' + port);
  });