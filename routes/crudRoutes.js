const express = require('express')
const mongoose =require('mongoose')
const _ =require('lodash')

const app = express();

const itemSchema =  mongoose.Schema({
  name: String
})



const listSchema =  mongoose.Schema({
  name: String,
  items : [itemSchema]
})
const Item = mongoose.model('Item',itemSchema);
const List = mongoose.model('List', listSchema)

const item1 = new Item({
  name: "Welcome to your To-do list"
})
const item2 = new Item({
  name: "Hit the + to add a new Item "
})
const item3 = new Item({
  name: "<-- Hit the check box to delete"
})
const defultItems =[item1,item2,item3];

app.get("/", async function(req, res) {
  const items = await Item.find()

    if(items.length === 0){
      await Item.insertMany(defultItems).then((iserted)=>{
        console.log(defultItems);
      })
      res.redirect('/')
    }else{
      res.render("list", {listTitle: "Today", newListItems: items});
    }
  })
//////////////////Custom List name
app.get("/:customListName",async function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  const listA = new List({
    name: customListName,
    items:defultItems
  })

   await List.findOne({name:customListName}).then((list) => {
    if(!list ){
      listA.save();
      console.log("list created".green);
      res.redirect(`/${customListName}`)
    }else{
    res.render("list", {listTitle: list.name, newListItems: list.items});
    }
  })
});

app.post("/", async function(req, res){

  const item = req.body.newItem;
  const listName = req.body.list;
  
  if (listName === "Today") {
    await Item.create({name:item}).then(function(){
      console.log("Item added".blue); // Success
      res.redirect("/");
  }).catch(function(error){
      console.log(error); // Failure
  });

 } else{

  await List.findOneAndUpdate({name:listName},{$push:{items: {name:item}}}).then(function(){
    console.log("success".bgMagenta);
    res.redirect(`/${listName}`)
  })
  }
});

// DELETE route 
app.post("/delete", async (req,res) => {
  const itemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    await Item.findByIdAndRemove(itemId).then(function(){
      console.log("Data deleted".red); // Success
      res.redirect('/')
  }).catch(function(error){
      console.log(error); // Failure
  });
  }else{
    await List.findOneAndUpdate({name:listName},{$pull:{items: {_id:itemId}}}).then(function(){
      console.log("success".red);
      res.redirect(`/${listName}`)
  }).catch(function(error){
      console.log(error); // Failure
  });
  }
}
)
  module.exports = app;