'use strict';
var Promise = require('bluebird');
var Users = Promise.promisifyAll(require('../database/users'));

exports.findOneByQuery = function(query) {
    return Users.findOneAsync(query);
};

exports.findAll = function() {
    return Users.findAsync();
};

exports.findLastUsers = function() {
    //return Users.findAsync();
    return Users.find().sort({createdAt: -1}).limit(3);
};

exports.createUser = function(user) {
    return Users.createAsync(user);
};

exports.addFavoritesToUser = function(user_id,song_id){
    return Users.findOneAndUpdateAsync(
        {_id: user_id},
        {$push:{favoriteSongs: song_id}},
        {new:true }
    );
};

exports.deleteFavoriteSong = function(user_id, song_id){
    return Users.findOneAndUpdateAsync(
        {_id: user_id},
        {$pull:{favoriteSongs: song_id}},
        {new:true }
    );
};

exports.deleteFavoriteSongs = function(user_id){
    return Users.findOneAndUpdateAsync(
        {_id: user_id},
        {$set:{favoriteSongs: []}},
        {new:true }
    );
};
