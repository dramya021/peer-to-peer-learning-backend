import {
useEffect,
useState
}
from "react";

export default function App(){

const[
title,
setTitle
]=useState("");

const[
selectedFile,
setSelectedFile
]=useState(null);

const[
resources,
setResources
]=useState([]);

const[
questions,
setQuestions
]=useState({});

useEffect(()=>{

loadResources();

},[]);

const loadResources=
async()=>{

const res=
await fetch(
"http://localhost:5000/resources"
);

const data=
await res.json();

setResources(
data
);

};

const upload=
async()=>{

if(
!title||
!selectedFile
){

alert(
"Enter title and select file"
);

return;

}

const form=
new FormData();

form.append(
"title",
title
);

form.append(
"file",
selectedFile
);

await fetch(
"http://localhost:5000/upload",
{
method:
"POST",

body:
form
}
);

setTitle("");

setSelectedFile(
null
);

loadResources();

alert(
"Uploaded"
);

};

const ask=
async(id)=>{

if(
!questions[id]
)
return;

await fetch(

`http://localhost:5000/question/${id}`,

{

method:
"POST",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({

question:
questions[id]

})

}

);

setQuestions({
...questions,

[id]:
""

});

loadResources();

};

const remove=
async(id)=>{

await fetch(

`http://localhost:5000/delete/${id}`,

{

method:
"DELETE"

}

);

loadResources();

};

return(

<>

<style>{`

body{

margin:0;

background:#eef3ff;

font-family:Arial;

}

.nav{

background:#17389e;

color:white;

padding:20px;

display:flex;

justify-content:
space-between;

}

.hero{

padding:40px;

text-align:center;

background:white;

}

.hero img{

width:80%;

max-width:700px;

border-radius:20px;

}

.upload{

background:white;

width:650px;

margin:30px auto;

padding:25px;

border-radius:15px;

}

input{

width:100%;

padding:14px;

margin-top:10px;

}

button{

width:100%;

padding:14px;

margin-top:10px;

background:#4361ee;

border:none;

color:white;

cursor:pointer;

}

.delete{

background:red;

}

.cards{

display:grid;

grid-template-columns:
repeat(
auto-fit,
minmax(
350px,
1fr
));

gap:20px;

padding:30px;

}

.card{

background:white;

padding:20px;

border-radius:15px;

}

video{

width:100%;

}

.open{

display:block;

padding:10px;

background:#4361ee;

color:white;

text-align:center;

text-decoration:none;

margin-top:10px;

}

.q{

background:#edf2ff;

padding:8px;

margin-top:8px;

}

`}</style>

<div>

<div className="nav">

<h2>
Peer to Peer Learning
</h2>

<h3>
Learn • Share • Grow
</h3>

</div>

<div className="hero">

<h1>

Upload,
View,
Learn

</h1>

<img
src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
alt=""
/>

</div>

<div className="upload">

<h2>

Upload Notes / Videos

</h2>

<input

placeholder=
"Enter Title"

value=
{title}

onChange=
{
e=>
setTitle(
e.target.value
)
}

/>

<input

type="file"

onChange=
{
e=>
setSelectedFile(
e.target.files[0]
)
}

/>

<button
onClick=
{upload}
>

Submit

</button>

</div>

<div className="cards">

{

resources.map(
item=>(

<div
className=
"card"

key=
{item._id}
>

<h2>

{item.title}

</h2>

{

item.type===
"video"

?

<video
controls
>

<source

src={
`http://localhost:5000/uploads/${item.file}`
}

/>

</video>

:

<a

className=
"open"

href={
`http://localhost:5000/uploads/${item.file}`
}

target=
"_blank"

rel=
"noreferrer"

>

Open File

</a>

}

<input

placeholder=
"Ask Question"

value=
{
questions[
item._id
]||""
}

onChange=
{
e=>

setQuestions({

...questions,

[item._id]:
e.target.value

})

}

/>

<button

onClick=
{
()=>ask(
item._id
)
}

>

Ask

</button>

<button

className=
"delete"

onClick=
{
()=>remove(
item._id
)
}

>

Delete

</button>

{

item.questions
?.map(
(
q,
i
)=>(

<div
className=
"q"

key=
{i}
>

❓ {q}

</div>

)
)

}

</div>

)

)

}

</div>

</div>

</>

);

}