let date=new Date();
let y=date.getFullYear();
let m=date.getMonth();
let selected=null;

const weekdays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function showScreen(n){
["screen1","screen2","screen3"].forEach(id=>{
document.getElementById(id).classList.add("hidden");
});
document.getElementById("screen"+n).classList.remove("hidden");
}

function drawCalendar(){
const grid=document.getElementById("calendarGrid");
grid.innerHTML="";

document.getElementById("monthTitle").textContent=`${y}/${m+1}`;

weekdays.forEach(d=>{
let div=document.createElement("div");
div.textContent=d;
grid.appendChild(div);
});

let first=new Date(y,m,1).getDay();
let last=new Date(y,m+1,0).getDate();

for(let i=0;i<first;i++) grid.appendChild(document.createElement("div"));

for(let d=1;d<=last;d++){

let div=document.createElement("div");
div.classList.add("date");

let span=document.createElement("span");
span.textContent=d;

let key=`${y}-${m+1}-${d}`;
let data=JSON.parse(localStorage.getItem(key));

if(data?.mood) div.classList.add(data.mood);

div.onclick=()=>{
selected=key;
document.getElementById("selectedDate").textContent=key;
loadDiary();
showScreen(2);
};

div.appendChild(span);
grid.appendChild(div);
}
}

function loadDiary(){
let data=JSON.parse(localStorage.getItem(selected)) || {};
diaryText.value=data.text||"";
mood.value=data.mood||"";
updateCount();
}

function saveDiary(){

let text=diaryText.value;

if(/[ぁ-んァ-ン一-龥]/.test(text)){
alert("English only!");
return;
}

localStorage.setItem(selected,JSON.stringify({
text:text,
mood:mood.value
}));

drawCalendar();
backCalendar();
}

function backCalendar(){
showScreen(1);
}

/* ⭐ Analyze */
function openDictionary(){

let words={};

for(let i=0;i<localStorage.length;i++){
let data=JSON.parse(localStorage.getItem(localStorage.key(i)));
if(!data?.text) continue;

data.text.toLowerCase().split(/\W+/).forEach(w=>{
if(!w) return;
words[w]=(words[w]||0)+1;
});
}

let html="";
Object.entries(words)
.sort((a,b)=>b[1]-a[1])
.forEach(([w,c])=>{
html+=`<div>${w} : ${c}</div>`;
});

dictionary.innerHTML=html;
showScreen(3);
}

/* 文字数 */
diaryText.addEventListener("input",updateCount);

function updateCount(){
let n=diaryText.value.length;
charCount.textContent=`${n} / 50`;

if(n>=50){
screen2.style.background="#e8ffe8";
}else{
screen2.style.background="white";
}
}

function prevMonth(){m--; if(m<0){m=11;y--;} drawCalendar();}
function nextMonth(){m++; if(m>11){m=0;y++;} drawCalendar();}

drawCalendar();
