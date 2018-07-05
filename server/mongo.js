const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const fs = require('fs')
const path = require('path')
const credentials = require("./credentials.json")

const url = `mongodb://${credentials.mongoUser}:${credentials.mongoPass}@127.0.0.1:27017/fitnessapp-two`
const dbName = 'fitnessapp';

let db;
let client;
let user;

let connectToDb = async function() {
  try {
    client = await MongoClient.connect(url, {authSource: "admin"})
    console.log('Fitnessapp-two: ' + 'connected to mongo server...');
    db = client.db(dbName);
    return db;
  }
  catch (err) {
    return err;
  }
}();

module.exports = {

  update: async function(req, res) {
    try {
      let body = req.body;
      let result = await updateDocs(body, db);

      let data = await asyncgetData({user: user.user}, db);
      user = data[0];
      let userProfile = user.profile;

      res.set('Content-Type', 'application/json')
      let json = JSON.stringify(userProfile)
      res.send(json)
    }
    catch(err) {
      console.log("ERR:", err);
      return err;
    }
  },
  view: async function(req, res) {
    try {
      let query = {user: req.body};
      let data = await asyncgetData(query, db);
      user = data[0];
      let userProfile = user.profile
      
      res.set('Content-Type', 'application/json')
      let json = JSON.stringify(userProfile)
      res.send(json)
    }
    catch(err) {
      console.log("ERR:", err);
      return err;
    }
  },

  remove: async function(req, res) {
    let body = req.body;
    try {
      let result = await removeData(body, db)   
      let data = await asyncgetData({user: user.user}, db);
      
      user = data[0];
      let userProfile = user.profile

      res.set('Content-Type', 'application/json')
      let json = JSON.stringify(userProfile)
      res.send(json)
    }
    catch(err) {
      console.log("ERR:", err);
      return err;
    }
  }
}

const asyncgetData = async function(query, db) {
  try {
    return await db.collection('registeredusers').find(query).toArray()
  }
  catch(err) {
    console.log(err.stack);
    console.log('Error finding collection...');
    return err;
  }
}


const updateDocs = async function(data, db) {
  try {
    let result = await db.collection('registeredusers').findOneAndUpdate(user, {$addToSet: {"profile": data}} )
    return result;
  }
  catch(err) {
    console.log(err.stack);
    console.log('Error inserting collection...');
    return err;
  }
}

const removeData = async function(data, db) {
  try {
    let result = await db.collection('registeredusers').findOneAndUpdate(user, {$set: {"profile": data} })
    console.log('NEW OBJECT: ', result);
    return result;
  }
  catch(err) {
    console.log('Error removing collection...');
    console.log(err.stack);
    return err;
  }
}
