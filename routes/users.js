var express = require('express');
var router = express.Router();
var UserService = require('../services/users');
var SongService = require('../services/songs');

/* GET users listing. */
router.get('/', function(req, res, next) {
    UserService.findAll()
        .then(function (users) {
            if (!users) {
                res.status(404).send({err: 'No user found with id'});
                return;
            }
            if (req.accepts('text/html')) {
                return res.render('users', {users: users});
            }
            if (req.accepts('application/json')) {
                res.status(200).send(users);
            }
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
    ;
});

router.get('/me', function(req, res, next) {
    UserService.findOneByQuery({_id: req.user._id})
        .then(function (user) {
            SongService.findWhereIdIn(user.favoriteSongs)
                .then(function(songs) {
                    if (req.accepts('text/html')) {
                        return res.render('me', {user: user, songs: songs});
                    }
                    if (req.accepts('application/json')) {
                        res.status(200).send({user: user,songs: songs});
                    }
                })
                .catch(function (err) {
                    res.status(500).send(err);
                });
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
    ;
});

router.get('/:id', function(req, res, next) {
    UserService.findOneByQuery({_id: req.params.id})
        .then(function (user) {
            if (!user) {
                res.status(404).send({err: 'No user found with id'. req.params.id});
                return;
            }
            SongService.findWhereIdIn(user.favoriteSongs)
                .then(function(songs) {
                    if (req.accepts('text/html')) {
                        return res.render('user', {user: user, songs: songs});
                    }
                    if (req.accepts('application/json')) {
                        res.status(200).send({user: user,songs: songs});
                    }
                })
                .catch(function (err) {
                    res.status(500).send(err);
                });
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
    ;
});

router.get('/favorite/:id', function(req, res) {
    UserService.addFavoritesToUser(req.user._id, req.params.id)
        .then(function (user) {
            if (!user) {
                res.status(404).send({err: 'No user found with id' + user_id});
                return;
            }
            if (req.accepts('text/html')) {
                return res.redirect('/songs/' + req.params.id + '?message=success');
            }
            if (req.accepts('application/json')) {
                res.status(200).send(user);
            }
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
    ;
});

router.delete('/favorite', function(req, res) {
    UserService.deleteFavoriteSongs(req.user._id)
        .then(function (user) {
            if (req.accepts('text/html')) {
                return res.redirect('/users/me?message=success');
            }
            if (req.accepts('application/json')) {
                res.status(200).send(user);
            }
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
    ;
});

router.delete('/favorite/:id', function(req, res) {
    UserService.deleteFavoriteSong(req.user._id, req.params.id)
        .then(function (user) {
            if (req.accepts('text/html')) {
                return res.redirect('/users/me?message=success');
            }
            if (req.accepts('application/json')) {
                res.status(200).send(user);
            }
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
    ;
});

module.exports = router;
