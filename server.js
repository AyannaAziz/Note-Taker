// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
const fs = require('fs');
// const db = require("/db/db")
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')))

// Routes
// =============================================================


//get route 
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//post route reads the data and converts into an array and pushes the new data into the same array, then writes into file
app.post("/api/notes", function(req, res) {

  fs.readFile(path.join(__dirname, "/db/db.json"), 'utf8', (error, data) => {
    if (error){
      console.error(error)
    }
    else {
      var dataArray = req.body
      dataArray.id = Date.now(dataArray)
      var fileData = JSON.parse(data)
      fileData.push(dataArray)
      fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(fileData), (error, data) => {
        if (error){
          console.error(error)
        }
        else {
          return res.json(data)
        }
    
      });
    
    }
  }
  
);

});

//delete route read file then get ID to delete
app.delete("/api/notes/:id", function(req, res) {

  fs.readFile(path.join(__dirname, "/db/db.json"), 'utf8', (error, data) => {
    if (error){
      console.error(error)
    }
    else {
      const id = parseInt(req.params.id)
      var fileData = JSON.parse(data)
      
      for (var i=0; i < fileData.length; i++){
        if (fileData[i].id === id) {
          
          fileData.splice(i, 1)
          fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(fileData), (error, data) => {
            if (error){
              console.error(error)
            }
            else {
              return res.send("deleted successfully")
            }
        
          });
        }
      }
      
    
    }
  }
  
);

});

app.get("/api/notes", function(req, res) {
  fs.readFile(path.join(__dirname, "/db/db.json"), 'utf8', (error, data) => {
    if (error){
      console.error(error)
    }
    else {
      return res.json(JSON.parse(data))
    }
  }
  
);

});

// Basic route that sends the user first to the AJAX Page
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
