'use strict';
var Promise = require('bluebird');
var Relationships = Promise.promisifyAll(require('../database/relationships'));

exports.findOneByQuery = function(query) {
    return Relationships.findOneAsync(query);
};

exports.findAll = function() {
    return Relationships.findAsync();
};

exports.findWhereConcerned = function(concerned_id) {
    return Relationships.find({
        $or: [
            {target_id: concerned_id},
            {enquirer_id: concerned_id}
        ]
    });
};

exports.findRelation = function(enquirer_id, target_id) {
    return Relationships.findOneAsync({
        $or: [
            { $and: [{target_id: target_id}, {enquirer_id: enquirer_id}] },
            { $and: [{target_id: enquirer_id}, {enquirer_id: target_id}] }
        ]
    });
};

exports.createRelationship = function(enquirer_id, enquirer_name, target_id, target_name) {
    return Relationships.createAsync({
    target_id: target_id,
    target_name: target_name,
    enquirer_id: enquirer_id,
    enquirer_name: enquirer_name,
    confirmed: false
    });
};

exports.confirmRelationship = function(relationship_id){
    return Relationships.findOneAndUpdateAsync(
        {_id: relationship_id},
        {confirmed: true},
        {new:true }
    );
};

exports.deleteAll = function(){
    return Relationships.removeAsync();
};

exports.deleteRelationship = function(relationship_id){
    return Relationships.removeAsync(
        {_id: relationship_id}
    );
};
