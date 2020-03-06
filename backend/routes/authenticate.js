var express = require('express');
var router = express.Router();
var my_client_id = '905baa9c4a8c41b8868f961e19b1cc71';

router.get('/', function(req, res, next) {
    var scopes = 'user-read-private user-read-email user-top-read';
    res.redirect('http://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + my_client_id +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent('http://localhost:3000/callback'));
});

module.exports = router;