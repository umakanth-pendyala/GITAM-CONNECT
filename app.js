require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

mongoose.connect(process.env.URL, { useUnifiedTopology: true,  useNewUrlParser: true  }, (err) => {
  if (err) console.log("error occured");
  else console.log("connected successfully");
})

var Schema = mongoose.Schema({
  Question: String,
  Answer: String
})

var problem = mongoose.model("problem", Schema);     //collection name problem


//-----------------------------------mongo db CURD operations SYNTAXES written here ----------------

// var problem_2 = new problem({                  ===> create a new model set
//   Question: "this is question 2",
//   Answer: "this is its answer"
// })

// problem_2.save((err, data) => {            ===> save the set
//   if (err) console.log(err);
//   else console.log("okok");
// })

// problem.find((err, data) => {      ===> print the whole array of objects
//   if (data) console.log(data);
//   else console.log(err);
// })


// problem.deleteMany({}, (data) => {   ===> deletes all the documents inside the collection
//   console.log(data);
// })


// problem.find((err, data) => {                      //  ===>  iterate though the array 
//   if (data) {
//     for (var i = 0; i < data.length; i++) {
//       console.log(data[i].Question);
//       console.log(data[i].Answer);
//     }
//   }
// })


// ---------------------------------ACTUAL PROGRAMMING WRITTEN HERE--------------------------

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var dataObjects = {

  sets: [

  ]

}


app.get("/" ,(req, res) => {

  dataObjects.sets = [];

  problem.find((err, data) => {

    let tempSets;
    console.log(data);
    if (data) {
      // console.log(dataObjects.sets[0])
      for (var i = 0; i < data.length; i++) {
        console.log("data length :\t" + data.length);
        tempSets ={
          title: data[i].Question,
          body: data[i].Answer
        }
        dataObjects.sets.push(tempSets);
      }

      // console.log(dataObjects.sets);
      res.render("index", dataObjects);  
    } else if (err) {
      res.send("data base error occured");
    }
  })

  

})

app.get("/about", (req, res) => {
  res.render("About");
})

app.get("/contact", (req, res) => {
  res.render("Contact");
})

app.get("/Question/:name", (req, res) => {

  const QuestionName = req.params.name;
  console.log(QuestionName);


  for (var i = 0; i < dataObjects.sets.length; i++) {

    if (dataObjects.sets[i].title === QuestionName) {
      console.log(dataObjects.sets[i]);
      res.render("Question", {
        title: dataObjects.sets[i].title,
        body: dataObjects.sets[i].body 
      });
      return;
    } 
  }

  res.render("error");
  
})

app.get("/mission", (req, res) => {
  res.render("Mission");
})

//-------------------------------------------refresh method made here ----------------------------

app.get("/refresh", (req, res) => {
  dataObjects.sets = []
  problem.deleteMany({}, () => {
    res.redirect("/");
  })
})

// --------------------------------------------post requests written here (add question)----------------------

app.post("/addQuestion", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;

  console.log(title);
  console.log("body:\t" , body);

  const nextProblem = new problem({
    Question: title,
    Answer: body
  })

  nextProblem.save((err, data) => {
    if (data) {
      const tempObject = {
        title: title,
        body: body
      }
      dataObjects.sets.push(tempObject);
      res.redirect("/");
    } else if (err) {
      res.send("sorry database error occured");
    }
  });

})

app.listen(process.env.PORT || 3000, () => {
  console.log("app is running on port 3000")
})