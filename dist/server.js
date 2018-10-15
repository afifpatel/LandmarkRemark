'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _issue = require('./issue.js');

var _issue2 = _interopRequireDefault(_issue);

require('babel-polyfill');

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//To let Node.js report line numbers by using source maps, we need to install thesource-map-support module, and also call the library in the application once
//ES2015 
//ES2015 
// const express =  require('express');
// const bodyParser= require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
// const Issue = require('./issue.js');


_sourceMapSupport2.default.install(); //ES2015 
//ES2015 


const app = (0, _express2.default)();
app.use(_express2.default.static('static'));
app.use(_bodyParser2.default.json());

// const issues = [
//     {
//         id: 1, status: 'open', owner: 'Ravan',
//         created: new Date('2016-08-15'), effort: 5, completionDate: undefined,
//         title: 'Error in console when clicking Add',
//     },
//     {
//         id: 2, status: 'Assigned', owner: 'Eddie',
//         created: new Date('2016-08-16'), effort: 14,
//         completionDate: new Date('2016-08-30'),
//         title: 'Missing bottom border on panel',
//     },
//     ];

// const validIssueStatus = {
//     New: true,
//     Open: true,
//     Assigned: true,
//     Fixed: true,
//     Verified: true,
//     Closed: true,
//     };

// const issueFieldType = {
//     status: 'required',
//     owner: 'required',
//     effort: 'optional',
//     created: 'required',
//     completionDate: 'optional',
//     title: 'required',
//     };

// app.get('/hello', (req,res) => {
//     res.send('Hello World');
// });

let db;
_mongodb.MongoClient.connect('mongodb://localhost').then(client => {
    db = client.db('lmr');
    app.listen(3000, () => {
        console.log('App startedddddd on port 3000');
    });
}).catch(error => {
    console.log('ERROR:', error);
});

app.get('/api/landmarks', (req, res) => {
    const filter = {};
    // console.log(req);
    // if (req.query.status) filter.status = req.query.status;
    // if(req.query.effort_lte || req.query.effort_gte) filter.effort = {};
    // if(req.query.effort_lte)
    //     filter.effort.$lte = parseInt(req.query.effort_lte, 10);
    // if(req.query.effort_gte)
    //     filter.effort.$gte = parseInt(req.query.effort_gte, 10)
    // if(req.query.owner)
    //     filter.owner = req.query.owner;

    db.collection('lmr').find(filter).toArray().then(landmarks => {
        const metadata = { total_count: landmarks.length };
        res.json({ _metadata: metadata, records: landmarks });
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

app.get('/api/landmark/:id', (req, res) => {
    let issueId;
    console.log("PARAMSSS ", req.params);
    try {
        issueId = new _mongodb.ObjectId(req.params.id);
    } catch (error) {
        res.status(422).json({ message: `Invalid issue ID format: ${error}` });
        return;
    }

    db.collection('lmr').find({ _id: issueId }).limit(1).next().then(issue => {
        console.log("landmark retrieved from data ", issue);
        if (!issue) res.status(404).json({ message: `No such issue: ${issueId}` });else res.json(issue);
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

app.post('/api/landmark', (req, res) => {
    const newLandmark = req.body;
    // newIssue.id = issues.length + 1;
    newLandmark.date = new Date();
    newLandmark.location.lat = parseFloat(newLandmark.location.lat);
    newLandmark.location.lng = parseFloat(newLandmark.location.lng);
    console.log(JSON.stringify(newLandmark));
    // const err = Issue.validateIssue(newLandmark)
    // console.log(newLandmark);

    // if(err){
    //     res.status(422).json({ message: `Invalid request: ${err}` });
    //     return;
    // }

    // issues.push(newIssue);
    db.collection('lmr').insertOne(newLandmark).then(result => db.collection('lmr').findOne({ _id: result.insertedId })).then(query_result => db.collection('lmr').count().then(metadata => res.json({ _metadata: metadata, new_landmark: query_result }))).catch(err => {
        console.log(err);
        res.status(500).json({ message: `Internal Server Error: ${err}` });
    });
});

app.put('/api/landmark/:id', (req, res) => {
    let landmarkId;
    try {
        landmarkId = new _mongodb.ObjectId(req.params.id);
    } catch (error) {
        res.status(422).json({ message: `Invalid issue ID format: ${error}` });
        return;
    }

    const landmark = req.body;
    console.log("landmark put req body", landmark);

    delete landmark._id;

    //   console.log("issue =>",issue);
    if (landmark.location) {
        landmark.location.lat = parseFloat(landmark.location.lat);
        landmark.location.lng = parseFloat(landmark.location.lng);
    }
    // landmark.date = new Date(landmark.date);
    landmark.date = new Date(); //Last Updated


    console.log(JSON.stringify(landmark));

    //   const err = Issue.validateIssue(landmark);
    //   if (err) {
    //     res.status(422).json({ message: `Invalid request: ${err}` });
    //     return;
    //   }

    db.collection('lmr').updateOne({ _id: landmarkId }, { $set: landmark }).then(() => db.collection('lmr').find({ _id: landmarkId }).limit(1).next()).then(savedLandmark => {
        res.json(savedLandmark);
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

app.delete('/api/landmark/:id', (req, res) => {
    let landmarkId;
    try {
        landmarkId = new _mongodb.ObjectId(req.params.id);
    } catch (error) {
        res.status(422).json({ message: `Invalid issue ID format: ${error}` });
        return;
    }

    db.collection('lmr').deleteOne({ _id: landmarkId }).then(deleteResult => {
        if (deleteResult.result.n === 1) res.json({ status: 'OK' });else res.json({ status: 'Warning: object not found' });
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${errror}` });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('static/index.html'));
});
// app.listen(3000, function(){
//     console.log('App started on port 3000');
// });

// function validateIssue(issue) {
//     for(const field in issue ){
//         const type = issueFieldType[field];
//     if(!type) {
//         delete issue[field];
//     } else if ( type == 'required' && !issue[field]){
//         return `${field} is required.`;
//     }
// }

// if(!validIssueStatus[issue.status])
//     return `${issue.status} is not a valid status.`;

// return null;

// }
//# sourceMappingURL=server.js.map