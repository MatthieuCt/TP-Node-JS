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
     /* La logique est très bien, voici un autre façon de l'écrire en plus concis,
     sachant qu'on peut paralleliser les requetes
     Promise.all([SongService.getTop5SongsByNotes(), UserService.findLastUsers()])
          .then(function(values) {
              if (req.accepts('text/html')) {
                  return res.render('index', {songs: values[0], newestUser: values[1]});
              }
              if (req.accepts('application/json')) {
                  res.status(200).send({songs: values[0], newestUser: values[1]});
              }
          })
          .catch(function(err) {
              console.log(err);
              res.status(500).send(err);
          })
      ;*/
      }
  else {
    res.status(406).send({err: 'Not valid type for asked ressource'});
  }
});

module.exports = router;
