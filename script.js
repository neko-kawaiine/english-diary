let date = new Date();
let selected = null;
let diaryData = JSON.parse(localStorage.getItem("diary") || "{}");

const calendar = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");

function renderCalendar(){

calendar.innerHTML="";
let y = date.getFullYear();
let m = date.getMonth();

monthLabel.textContent = `${y} / ${m+1}`;

let first = new Date(y,m,1).getDay();
let last = new Date(y,m+1,0).getDate();

for(let i=0;i<first;i++){
calendar.innerHTML += "<div></div>";
}

for(let d=1; d<=last; d++){

let key = `${y}-${m+1}-${d}`;

let div = document.createElement("div");
div.className="day";
div.textContent=d;

if(diaryData[key]){
div.style.background = emotionColor(diaryData[key].emotion);
}

div.onclick = ()=> openDiary(key);
calendar.appendChild(div);
}
}

function emotionColor(e){
return {
happy:"#ffe082",
sad:"#90caf9",
tired:"#b0bec5",
angry:"#ef9a9a",
excited:"#a5d6a7",
normal:"white"
}[e];
}

function openDiary(key){
selected = key;

document.getElementById("calendarView").classList.add("hidden");
document.getElementById("diaryView").classList.remove("hidden");

document.getElementById("selectedDate").textContent=key;

let data = diaryData[key] || {text:"",emotion:"normal"};

diaryInput.value=data.text;
emotion.value=data.emotion;

updateCount();
}

saveBtn.onclick=()=>{
let text = diaryInput.value;

if(/[ぁ-んァ-ン一-龥]/.test(text)){
alert("English only!");
return;
}

diaryData[selected]={
text,
emotion:emotion.value
};

localStorage.setItem("diary",JSON.stringify(diaryData));
renderCalendar();
alert("Saved!");
}

diaryInput.oninput=updateCount;

function updateCount(){
let c = diaryInput.value.split(/\s+/).filter(Boolean).length;
count.textContent = `Words: ${c} / 50`;

if(c>=50){
diaryInput.classList.add("goal");
}else{
diaryInput.classList.remove("goal");
}
}

backCalendar.onclick=()=>{
diaryView.classList.add("hidden");
calendarView.classList.remove("hidden");
}

prevMonth.onclick=()=>{
date.setMonth(date.getMonth()-1);
renderCalendar();
}

nextMonth.onclick=()=>{
date.setMonth(date.getMonth()+1);
renderCalendar();
}

goAnalyze.onclick=showAnalyze;
backCalendar2.onclick=()=>{
analyzeView.classList.add("hidden");
calendarView.classList.remove("hidden");
}

function showAnalyze(){
calendarView.classList.add("hidden");
analyzeView.classList.remove("hidden");

let words={};

for(let k in diaryData){
let arr = diaryData[k].text.toLowerCase().match(/[a-z']+/g) || [];
arr.forEach(w=>{
if(!words[w]) words[w]=[];
words[w].push(k);
});
}

wordList.innerHTML="";

Object.keys(words).sort().forEach(w=>{
let div=document.createElement("div");
div.textContent=`${w} (${words[w].length})`;

div.onclick=()=>{
let dates=words[w].join(", ");
alert(`${w} used on:\n${dates}`);
}

wordList.appendChild(div);
});
}

renderCalendar();
