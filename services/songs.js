'use strict'
var Promise = require('bluebird');
var Notes = Promise.promisifyAll(require('../database/rates'))
var Songs = Promise.promisifyAll(require('../database/songs'));
var _ = require('Lodash');

exports.find = function(query) {
    return Songs.findAsync(query);
};

exports.findOneByQuery = function(query) {
    return Songs.findOneAsync(query);
};

exports.findWhereIdIn = function(array) {
    return Songs.find({
        '_id': { $in: array}
    });
};

exports.create = function(song) {
    return Songs.createAsync(song);
};

exports.deleteAll = function() {
    return Songs.removeAsync();
};

exports.updateSongById = function(songId, songToUpdate) {
    // return Songs.updateAsync({_id: songId}, songToUpdate); // updates but doesn't return updated document
    return Songs.findOneAndUpdateAsync({_id: songId}, songToUpdate, {new: true}); // https://github.com/Automattic/mongoose/issues/2756
};

exports.getTop5SongsByNotes = function (){
    var notesSongs = [];
    return Notes.aggregateAsync([
        {
            $group:{_id:"$song_id" ,
            avgNote:{$avg:"$rate"}
            }},
    {$sort:{avgNote:-1}},
    {$limit:5}
    ])
    .then(function (notes){
            var ids=_.map(notes,'_id');
            notesSongs=notes;
            return Songs.find({_id:{$in:ids}});
        })
    .then(function(songs){
            return _.map(notesSongs,function(n){
                var note=_.clone(n);
                note.song=_.find(songs,{_id:n._id});
                return note;
            });
        })
        ;
};