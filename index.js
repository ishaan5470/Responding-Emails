const express = require('express');
const app = express();
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth'); 
const { google } = require('googleapis'); 
const main = require('./functions/main');
const port = 8000;

const labelName = "Gmail Auto-Reply"; 
const scope = [ 
   
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.labels",
    "https://mail.google.com/" 
];

app.get('/', async (req, res) => {
    
    const auth = await authenticate({ 
        keyfilePath: path.join(__dirname, "credentials.json"),
        scopes: scope
    });
    console.log(auth);
    main(auth, labelName, google, res);
    res.json({Message:"Gmail Auto-Reply sent an automatic Mail Successfully"})
});

app.listen(port, () => {
    console.log("Go to the URL Given Below and Login to your Google Account");
    console.log("http://localhost:8000");
});