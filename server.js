import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

mongoose
.connect(
"mongodb://127.0.0.1:27017/peerlearning"
)
.then(() =>
console.log(
"MongoDB Connected"
))
.catch(console.log);

const storage =
multer.diskStorage({

destination(
req,
file,
cb
){
cb(
null,
"uploads"
);
},

filename(
req,
file,
cb
){
cb(
null,
Date.now()+
"-"+
file.originalname
);
}

});

const upload =
multer({
storage
});

const resourceSchema =
new mongoose.Schema({

title:String,

file:String,

type:String,

questions:[String]

});

const Resource =
mongoose.model(
"Resource",
resourceSchema
);

app.post(
"/upload",

upload.single(
"file"
),

async(
req,
res
)=>{

try{

const item =
new Resource({

title:
req.body.title,

file:
req.file.filename,

type:
req.file.mimetype
.includes(
"video"
)
?
"video"
:
"file",

questions:[]

});

await item.save();

res.json({
message:
"Uploaded"
});

}

catch(err){

console.log(err);

res
.status(500)
.json(err);

}

}
);

app.get(
"/resources",

async(
req,
res
)=>{

const data =
await Resource
.find();

res.json(
data
);

}
);

app.post(
"/question/:id",

async(
req,
res
)=>{

const item =
await Resource
.findById(
req.params.id
);

item.questions.push(
req.body.question
);

await item.save();

res.json({
message:
"Added"
});

}
);

app.delete(
"/delete/:id",

async(
req,
res
)=>{

try{

const item =
await Resource
.findById(
req.params.id
);

if(
item?.file
){

const path =
`uploads/${item.file}`;

if(
fs.existsSync(
path
)
){
fs.unlinkSync(
path
);
}

}

await Resource
.findByIdAndDelete(
req.params.id
);

res.json({
message:
"Deleted"
});

}

catch{

res
.status(500)
.json({
message:
"Delete Failed"
});

}

}
);

app.listen(
5000,
()=>{

console.log(
"Server running on 5000"
);

}
);