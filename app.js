const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var dataObjects = {

  sets: [
    {
      title: "Question 1",
      body: "Best answer for question 1"
    },
    {
      title: "Question 2",
      body: "suggessions for question 2"
    },
    {
      title: "Question 3",
      body: "suggession for question 3"
    }
  ]

}


app.get("/" ,(req, res) => {

  res.render("index", dataObjects);

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
  res.redirect("/");
})

// --------------------------------------------post requests written here ----------------------

app.post("/addQuestion", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;

  console.log(title);
  console.log("body:\t" , body);

  const tempObject = {
    title: title,
    body: body
  }

  dataObjects.sets.push(tempObject);

  res.redirect("/");
})

app.listen(process.env.PORT, () => {
  console.log("app is running on port 3000")
})