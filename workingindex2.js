const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const util = require("util");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
// const GridFsStorage = require("multer-gridfs-storage");
const fs = require('fs');
var path = require('path');
// var imgModel = require('./model');



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/magazineUsersDB",{useNewUrlParser:true});

const NotesSchema = new mongoose.Schema({
    title:String,
    content:String,
    img:
    {
        data: Buffer,
        contentType: String
    }
    

});
const Note = mongoose.model("Note", NotesSchema);

module.exports = new mongoose.model('Note',NotesSchema);

app.get('/', (req, res) => {
    Note.find({}, (err, items) => {
        
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('imagesPage', { items: items });
            
        }
    });
});
app.post('/', upload.single('image'), (req, res, next) => {
 
    var obj = {
        title: req.body.title,
        content: req.body.content,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    Note.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            console.log(item);
            res.redirect('/');
        }
    });
});



app.listen(3000, function(){
    console.log("server started on port 3000");
});