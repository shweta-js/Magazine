const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const util = require("util");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
// const GridFsStorage = require("multer-gridfs-storage");
const fs = require('fs');



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/magazineUsersDB",{useNewUrlParser:true});

const NotesSchema = {
    title:String,
    content:String,
    img:
    {
        data: Buffer,
        contentType: String
    }
};
const Note = mongoose.model("Note", NotesSchema);



app.get("/", function(req, res, next){
    Note.find(function(err, foundNotes){
        if(!err){
            res.send(foundNotes);
            console.log(foundItems);
        }else{
            res.send(err);
        }
    });
});

app.post("/",upload.single('img'), function(req,res,next){
   
    const newNote = new Note({
        title:req.body.title,
        content:req.body.content,
        img:req.body.file
    });
    newNote.save(function(err){
        if(!err){
            res.send("Successfully added a new note");
        }else{
            res.send(err);
        }
    });
});


// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
//   })
   

app.listen(3000, function(){
    console.log("server started on port 3000");
});