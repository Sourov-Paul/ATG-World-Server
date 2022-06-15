const express = require('express');
const app=express();
const cors= require('cors');
require('dotenv').config()
const { MongoClient,ServerApiVersion  } = require('mongodb');
const port=process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
const fileUpload=require('express-fileupload');

// use midleWare
app.use(cors())
app.use(express.json());
app.use(fileUpload())




// mongoDb connection cdn  
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.imlla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
        await client.connect();
        const database= client.db('atgworld');
        const userCollection=database.collection('users')
        const articleCollection=database.collection('allArticle')
        const educationCollection=database.collection('m')



// user save database
app.post('/users',async(req,res)=>{
    const newUser=req.body;
    const result=await userCollection.insertOne(newUser);
    res.json(result)
}) 

// post handle title/image
app.post('/allArticle',async(req,res)=>{
    const title=req.body.title;
    const title2=req.body.title2;
    const pic=req.files.image;
    const picData=pic.data;
    const date =new Date().toLocaleDateString();
    const encodedPic=picData.toString('base64');
    const imageBuffer=Buffer.from(encodedPic,'base64');
    const allArticles={
        title,
        title2,
        image:imageBuffer,
        date:date
    }
    const result=await articleCollection.insertOne(allArticles)
    res.json(result)
}) 

// Get handle title/image
    app.get('/allArticle',async(req,res)=>{
        const cursor=articleCollection.find({});
        const articles=await cursor.toArray();
        res.json(articles)
    })
// Get user 
    app.get('/users',async(req,res)=>{
        const cursor=userCollection.find({});
        const user=await cursor.toArray();
        res.json(user)
    })

    // GET SINGLE ARTICLE
     app.get('/singleArticle/:id',(req,res)=>{
        
       articleCollection.findOne({_id:ObjectId(req.params.id)})
        .then((article)=>{
            
            res.send(article)
        })});

    app.put('/updatePost/:id', async(req,res)=>{
        const id= req.params.id;
        const updateInfo=req.body;
        const result=await articleCollection.updateOne({_id:ObjectId(id)},{
            $set:{
                title:updateInfo.title,
                title2:updateInfo.title2
            }
        })
        res.send(result)
        // .then((result)=>console.log(result))
    })
    
}

    finally{
        // await client.close()
}
}
run().catch(console.dir)


app.get('/', (req,res)=>{
    res.send("Welcome to Server.")
})

app.listen(port,()=>{
    console.log('Wellcome to Server!')
})