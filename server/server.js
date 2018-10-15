// const express =  require('express');
// const bodyParser= require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
// const Issue = require('./issue.js');


import express from 'express';                          //ES2015 
import bodyParser from 'body-parser';                   //ES2015 
import { MongoClient, ObjectId } from 'mongodb';                  //ES2015 
import Issue from './issue.js'                          //ES2015 
import 'babel-polyfill';
import SourceMapSupport from 'source-map-support';   //To let Node.js report line numbers by using source maps, we need to install thesource-map-support module, and also call the library in the application once
SourceMapSupport.install();

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());


let db;
MongoClient.connect('mongodb://localhost').then(client => {
    db = client.db('lmr');
    app.listen(3000, () => {
        console.log('App startedddddd on port 3000');
    });
}).catch(error => {
    console.log('ERROR:', error);
});

app.get('/api/landmarks', (req,res) => {
    const filter = {};
    
    db.collection('lmr').find(filter).toArray().then( landmarks => {
        const metadata = { total_count: landmarks.length };
        res.json({ _metadata: metadata, records : landmarks})
    }).catch(error =>{
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
 });

app.get('/api/landmark/:id', (req,res) =>{
        let issueId;
        console.log("PARAMSSS ", req.params)
        try {
            issueId = new ObjectId(req.params.id);
        } catch (error){
            res.status(422).json({ message: `Invalid issue ID format: ${error}` });
            return;
        }
        
        db.collection('lmr').find({ _id : issueId }).limit(1)
        .next()
        .then( issue => { 
            console.log("landmark retrieved from data ", issue)
            if (!issue) res.status(404).json({ message: `No such issue: ${issueId}` });
            else res.json(issue);
        })
        .catch( error => {
            console.log(error);
            res.status(500).json({ message: `Internal Server Error: ${error}` });
        });
    });
 
app.post('/api/landmark', (req,res) => {
    const newLandmark = req.body;
    // newIssue.id = issues.length + 1;
    newLandmark.date = new Date();
    newLandmark.location.lat= parseFloat(newLandmark.location.lat);
    newLandmark.location.lng= parseFloat(newLandmark.location.lng)
   console.log(JSON.stringify(newLandmark));
    // const err = Issue.validateIssue(newLandmark)
    // console.log(newLandmark);

    // if(err){
    //     res.status(422).json({ message: `Invalid request: ${err}` });
    //     return;
    // }

   // issues.push(newIssue);
    db.collection('lmr').insertOne(newLandmark).then( result => 
        db.collection('lmr').findOne({ _id: result.insertedId })).then( query_result => 
            db.collection('lmr').count().then( metadata => 
                res.json({ _metadata: metadata , new_landmark : query_result})        
            )        
        ).catch(err =>{
        console.log(err);
        res.status(500).json({ message: `Internal Server Error: ${err}` });
    });
});


app.put('/api/landmark/:id', (req, res) => {
  let landmarkId;
  try {
    landmarkId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
    return;
  }

  const landmark = req.body;
  console.log("landmark put req body",landmark);


  delete landmark._id;

//   console.log("issue =>",issue);
if(landmark.location){
landmark.location.lat= parseFloat(landmark.location.lat);
landmark.location.lng= parseFloat(landmark.location.lng)
}
// landmark.date = new Date(landmark.date);
landmark.date = new Date();     //Last Updated


console.log(JSON.stringify(landmark));

//   const err = Issue.validateIssue(landmark);
//   if (err) {
//     res.status(422).json({ message: `Invalid request: ${err}` });
//     return;
//   }

  db.collection('lmr').updateOne({ _id: landmarkId }, { $set : landmark}).then(() =>
    db.collection('lmr').find({ _id: landmarkId }).limit(1)
    .next()
  )
  .then(savedLandmark => {
    res.json(savedLandmark);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
});

app.delete('/api/landmark/:id', (req,res) => {
    let landmarkId;
try{
    landmarkId = new ObjectId(req.params.id);
}
catch (error){
    res.status(422).json({ message : `Invalid issue ID format: ${error}`});
    return;
}
    
    db.collection('lmr').deleteOne({ _id : landmarkId }).then( deleteResult => {
        if(deleteResult.result.n === 1) res.json({ status: 'OK'});
        else res.json({ status: 'Warning: object not found' });
    })
    .catch( error => {
        console.log(error);
        res.status(500).json({ message : `Internal Server Error: ${errror}` });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('static/index.html'));
});
