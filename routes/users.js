var express = require('express');
var router = express.Router();
var UserService = require('../services/users');
var SongService = require('../services/songs');
var RelationshipService = require('../services/relationships');

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
                    RelationshipService.findWhereConcerned(req.user._id)
                        .then(function(relations) {
                            var friends = [];
                            var pendings = [];
                            var gottaAnswer = [];
                            relations.forEach(function(relation){
                                if(relation.confirmed) {
                                    if(relation.enquirer_id.toString() === req.user._id.toString())
                                    {
                                        friends.push({id: relation._id, friend_id:relation.target_id, friend_name: relation.target_name});
                                    } else {
                                        friends.push({id: relation._id, friend_id:relation.enquirer_id, friend_name: relation.enquirer_name});
                                    }
                                } else {
                                    if(relation.enquirer_id.toString() === req.user._id.toString())
                                    {
                                        pendings.push({id: relation._id, friend_id:relation.target_id, friend_name: relation.target_name});
                                    } else {
                                        gottaAnswer.push({id: relation._id, friend_id:relation.enquirer_id, friend_name: relation.enquirer_name});
                                    }
                                }
                            });
                            if (req.accepts('text/html')) {
                                return res.render('me', {user: user, songs: songs, relationships: {friends: friends, pendings: pendings, gottaAnswer: gottaAnswer}});
                            }
                            if (req.accepts('application/json')) {
                                res.status(200).send({user: user, songs: songs, relationships: {friends: friends, pendings: pendings, gottaAnswer: gottaAnswer}});
                            }
                        })
                        .catch(function (err) {
                            res.status(500).send(err);
                        });
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
    if(req.params.id === req.user._id)
    {
        return res.redirect('/users/me');
    } else {
        UserService.findOneByQuery({_id: req.params.id})
            .then(function (user) {
                if (!user) {
                    res.status(404).send({err: 'No user found with id'.req.params.id});
                    return;
                }
                SongService.findWhereIdIn(user.favoriteSongs)
                    .then(function (songs) {
                        RelationshipService.findRelation(req.params.id, req.user._id)
                            .then(function (relationship) {
                                if (req.accepts('text/html')) {
                                    return res.render('user', {user: user, songs: songs, relationship: relationship});
                                }
                                if (req.accepts('application/json')) {
                                    res.status(200).send({user: user, songs: songs, relationship: relationship});
                                }
                            })
                            .catch(function (err) {
                                res.status(500).send(err);
                            });
                    })
                    .catch(function (err) {
                        res.status(500).send(err);
                    });
            })
            .catch(function (err) {
                res.status(500).send(err);
            })
        ;
    }
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
