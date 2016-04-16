var express = require('express');
var _ = require('lodash');
var router = express.Router();
var RelationshipService = require('../services/relationships');
var UserService = require('../services/users');

var verifyIsAdmin = function(req, res, next) {
    if (req.isAuthenticated() && req.user.username === 'admin') {
        return next();
    }
    else {
        res.status(403).send({err: 'Current user can not access to this operation'});
    }
};

//GET / deserve to list all relationships between all users
router.get('/', verifyIsAdmin, function(req, res) {
    if (req.accepts('text/html') || req.accepts('application/json')) {
        RelationshipService.findAll()
            .then(function(relationships) {
                if (req.accepts('text/html')) {
                    return res.render('relationships', {relationships: relationships});
                }
                if (req.accepts('application/json')) {
                    res.status(200).send(relationships);
                }
            })
        ;
    }
    else {
        res.status(406).send({err: 'Not valid type for asked ressource'});
    }
});

// POST /:id (id is an id of a user) deserve to create new relationship between current user and other user with the id in ne the params
router.post('/:id', function(req, res) {
    if (req.accepts('text/html') || req.accepts('application/json')) {
        // Look for an existing relationship with those IDs
        RelationshipService.findRelation(req.params.id, req.user._id)
            .then(function(relationship) {
                if(relationship === null) {
                    UserService.findOneByQuery({_id: req.params.id})
                        .then(function(user){
                            RelationshipService.createRelationship(req.user._id, req.user.displayName, user._id, user.displayName)
                                .then(function(newrelationship) {
                                    if (req.accepts('text/html')) {
                                        return res.redirect('/users/' + req.params.id + '?message=success');
                                    }
                                    if (req.accepts('application/json')) {
                                        res.status(200).send(newrelationship);
                                        //201!!!
                                    }
                                })
                                .catch(function(err) {
                                    res.status(500).send(err);
                                });
                        })
                        .catch(function(err){
                            res.status(500).send(err);
                        });
                    // ce bloc t'aurais pu l'ecrire comme ça pour t'eviter le double catch et eviter le callback hell
                    /*UserService.findOneByQuery({_id: req.params.id})
                        .then(function(user) {
                            return RelationshipService.createRelationship(req.user._id, req.user.displayName, user._id, user.displayName);
                        })
                        .then(function(newrelationship) {
                            if (req.accepts('text/html')) {
                                return res.redirect('/users/' + req.params.id + '?message=success');
                            }
                            if (req.accepts('application/json')) {
                                res.status(201).send(newrelationship);
                            }
                        })
                        .catch(function(err){
                            res.status(500).send(err);
                        });
                    //--------------------
                    */
                } else {
                    if (req.accepts('text/html')) {
                        return res.redirect('/users/' + req.params.id + '?message=already');
                    }
                    if (req.accepts('application/json')) {
                        res.status(200).send(relationship);
                    }
                }
            })
            .catch(function(err) {
                res.status(500).send(err);
            });
    }
    else {
        res.status(406).send({err: 'Not valid type for asked ressource'});
    }
});

// PUT
router.put('/:id', function(req, res) {
    RelationshipService.confirmRelationship(req.params.id)
        .then(function(relationship) {
            if (req.accepts('text/html')) {
                console.log(history.go(-1));
                //Attention, pendant l'éxécution on a ceci [ReferenceError: history is not defined]
                return res.redirect(history.go(-1));
                // T'aurais du faire return res.redirect('/users/me');
            }
            if (req.accepts('application/json')) {
                return res.status(200);
            }
        })
        .catch(function(err) {
            console.log(err);
            res.status(500).send(err);
        })
    ;
});

router.delete('/', verifyIsAdmin, function(req, res) {
    RelationshipService.deleteAll()
        .then(function() {
            if (req.accepts('text/html')) {
                return res.redirect('/relationships?message=success');
            }
            if (req.accepts('application/json')) {
                return res.status(204);
            }
        })
        .catch(function(err) {
            res.status(500).send(err);
        })
    ;
});

router.delete('/:id', function(req, res) {
    RelationshipService.deleteRelationship(req.params.id)
        .then(function() {
            if (req.accepts('text/html')) {
                return res.redirect(req.header('Referer')+'?message=success' || '/');
            }
            if (req.accepts('application/json')) {
                return res.status(204);
            }
        })
        .catch(function(err) {
            console.log(err);
            res.status(500).send(err);
        })
    ;
});

module.exports = router;