var express = require('express');
var router = express.Router();
var SongService = require('../services/songs');
var UserService = require('../services/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.accepts('text/html') || req.accepts('application/json')) {
    SongService.getTop5SongsByNotes()
        .then(function(songs) {
            UserService.findLastUsers()
                .then(function(newestUser) {
                    if (req.accepts('text/html')) {
                        return res.render('index', {songs: songs, newestUser: newestUser});
                    }
                    if (req.accepts('application/json')) {
                        res.status(200).send({songs: songs, newestUser: newestUser});
                    }
                })
                .catch(function(err) {
                    console.log(err);
                    res.status(500).send(err);
                });


        })
        .catch(function(err) {
            console.log(err);
            res.status(500).send(err);
        })
    ;
  }
  else {
    res.status(406).send({err: 'Not valid type for asked ressource'});
  }
});

module.exports = router;
