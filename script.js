let now=new Date();
let year=now.getFullYear();
let month=now.getMonth();
let selected=null;

const weekdays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function showScreen(n){
["screen1","screen2","screen3"].forEach(id=>{
document.getElementById(id).classList.add("hidden");
});
document.getElementById("screen"+n).classList.remove("hidden");
}

/* calendar */

function drawCalendar(){

const grid=document.getElementById("calendarGrid");
grid.innerHTML="";

monthTitle.textContent=`${year}/${month+1}`;

/* weekday */
weekdays.forEach(d=>{
let div=document.createElement("div");
div.textContent=d;
div.classList.add("weekday");
grid.appendChild(div);
});

let first=new Date(year,month,1).getDay();
let last=new Date(year,month+1,0).getDate();

for(let i=0;i<first;i++) grid.appendChild(document.createElement("div"));

for(let d=1;d<=last;d++){

let div=document.createElement("div");
div.classList.add("date");

let span=document.createElement("span");
span.textContent=d;

let key=`${year}-${month+1}-${d}`;
let data=JSON.parse(localStorage.getItem(key));

if(data?.mood) div.classList.add(data.mood);

div.onclick=()=>{
selected=key;
selectedDate.textContent=key;
loadDiary();
showScreen(2);
};

div.appendChild(span);
grid.appendChild(div);
}
}

/* diary */

function loadDiary(){
let data=JSON.parse(localStorage.getItem(selected))||{};
diaryText.value=data.text||"";
mood.value=data.mood||"";
updateCount();
}

function saveDiary(){

let text=diaryText.value;

/* English only */
if(/[ぁ-んァ-ン一-龥]/.test(text)){
alert("Please write in English only");
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

/* character count */

diaryText.addEventListener("input",updateCount);

function updateCount(){

let n=diaryText.value.length;
charCount.textContent=`${n} / 50`;

if(n>=50){
screen2.classList.add("goal");
}else{
screen2.classList.remove("goal");
}
}

/* analyze */

function openAnalyze(){

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

/* month move */

function prevMonth(){
month--;
if(month<0){month=11;year--;}
drawCalendar();
}

function nextMonth(){
month++;
if(month>11){month=0;year++;}
drawCalendar();
}

drawCalendar();
