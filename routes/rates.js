var express = require('express');
var _ = require('lodash');
var router = express.Router();
var RateService = require('../services/rates');

var verifyIsAdmin = function(req, res, next) {
    if (req.isAuthenticated() && req.user.username === 'admin') {
        return next();
    }
    else {
        res.status(403).send({err: 'Current user can not access to this operation'});
    }
};


var songBodyVerification = function(req, res, next) {
    var attributes = _.keys(req.body);
    var mandatoryAttributes = ['rate'];
    var missingAttributes = _.difference(mandatoryAttributes, attributes);
    if (missingAttributes.length) {
        res.status(400).send({err: missingAttributes.toString()});
    }
    else {
        if (req.body.rate) {
            next();
        }
        else {
            var error = mandatoryAttributes.toString() + ' are mandatory';
            if (req.accepts('text/html')) {
                req.session.err = error;
                res.redirect('/songs/');
            }
            else {
                res.status(400).send({err: error});
            }
        }
    }
};


router.post('/:id', songBodyVerification, function(req, res) {
    // la route n'est pas assez explicite... POST /rates/123 aurait pu être POST /rates/song/123 ou encore POST /rates/user/toto/song/123
    RateService.findOneByQuery({song_id: req.params.id, username: req.user.username})
        .then(function(rate) {
            console.log(rate);
            if(!rate)
            {
                RateService.create({rate: req.body.rate, song_id: req.params.id, username: req.user.username})
                    .then(function(rate) {
                        if (req.accepts('text/html')) {
                            return res.redirect('/songs/' + req.params.id + '?message=success');
                        }
                        if (req.accepts('application/json')) {
                            return res.status(201).send(rate);
                        }
                    })
                    .catch(function(err) {
                        res.status(500).send(err);
                    });
            } else {
                if (req.accepts('text/html')) {
                    return res.redirect('/songs/' + req.params.id + '?message=already');
                }
                if (req.accepts('application/json')) {
                    return res.status(304).send({err: 'You have already vote for this song.'});
                    // plutot un 409 - conflict
                }
            }
        })
        .catch(function(err) {
            res.status(500).send(err);
        });
});

router.delete('/:song_id', function(req, res) {
    RateService.findOneByQuery({song_id: req.params.song_id, username: req.user.username})
        .then(function(rate) {
            if(!rate)
            {
                if (req.accepts('text/html')) {
                    return res.redirect('/songs/' + req.params.song_id + '?message=error');
                }
                if (req.accepts('application/json')) {
                    return res.status(400);
                    // il manque un send... ceci genere un timeout
                }
            } else {
                RateService.delete(rate)
                    .then(function() {
                        if (req.accepts('text/html')) {
                            return res.redirect('/songs/' + req.params.song_id + '?message=success');
                        }
                        if (req.accepts('application/json')) {
                            return res.status(204);
                            // il manque un send... tu tombes en timeout
                        }
                    })
                    .catch(function(err) {
                        res.status(500).send(err);
                    })
                ;
            }
        })
        .catch();
});

module.exports = router;