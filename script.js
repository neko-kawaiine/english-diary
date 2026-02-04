let currentDate = new Date();
let selectedDate = null;
let diaries = JSON.parse(localStorage.getItem("diaries") || "{}");

function showScreen(id){
document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
document.getElementById(id).classList.remove("hidden");
}

/* calendar */

function renderCalendar(){

let year = currentDate.getFullYear();
let month = currentDate.getMonth();

document.getElementById("monthLabel").textContent =
`${year} / ${month+1}`;

let firstDay = new Date(year,month,1).getDay();
let lastDate = new Date(year,month+1,0).getDate();

let cal = document.getElementById("calendar");
cal.innerHTML="";

for(let i=0;i<firstDay;i++){
cal.innerHTML+="<div></div>";
}

for(let d=1; d<=lastDate; d++){

let key = `${year}-${month+1}-${d}`;
let emo = diaries[key]?.emotion || "";

let div = document.createElement("div");
div.className = "day " + emo;
div.textContent = d;

div.onclick = ()=> openDiary(key);

cal.appendChild(div);
}
}

function changeMonth(n){
currentDate.setMonth(currentDate.getMonth()+n);
renderCalendar();
}

/* diary */

function openDiary(dateKey){
selectedDate = dateKey;
showScreen("diaryScreen");

document.getElementById("diaryDate").textContent = dateKey;

let data = diaries[dateKey] || {};
document.getElementById("diaryText").value = data.text || "";
document.getElementById("emotion").value = data.emotion || "";

updateCounter();
}

function updateCounter(){
let text = document.getElementById("diaryText").value;
let count = text.length;

document.getElementById("counter").textContent = `${count} / 50`;

if(count>=50){
document.getElementById("diaryText").classList.add("goal");
}else{
document.getElementById("diaryText").classList.remove("goal");
}
}

document.getElementById("diaryText").addEventListener("input",updateCounter);

function containsJapanese(str){
return /[ぁ-んァ-ン一-龯]/.test(str);
}

function saveDiary(){

let text = document.getElementById("diaryText").value;

if(containsJapanese(text)){
alert("English only!");
return;
}

let emo = document.getElementById("emotion").value;

diaries[selectedDate] = {text, emotion:emo};
localStorage.setItem("diaries",JSON.stringify(diaries));

backCalendar();
renderCalendar();
}

function backCalendar(){
showScreen("calendarScreen");
}

/* analyze */

function openAnalyze(){
showScreen("analyzeScreen");
buildDictionary();
}

function buildDictionary(){

let dict = {};

for(let date in diaries){

let words = diaries[date].text
.toLowerCase()
.match(/[a-z]+/g);

if(!words) continue;

words.forEach(w=>{
if(!dict[w]) dict[w]=[];
dict[w].push(date);
});
}

let container = document.getElementById("dictionary");
container.innerHTML="";

let grouped = {};

Object.keys(dict).sort().forEach(word=>{
let letter = word[0].toUpperCase();
if(!grouped[letter]) grouped[letter]=[];
grouped[letter].push(word);
});

for(let letter in grouped){

let letterDiv = document.createElement("div");
letterDiv.className="letter";
letterDiv.textContent = letter;
container.appendChild(letterDiv);

grouped[letter].forEach(word=>{

let w = document.createElement("div");
w.className="word";
w.textContent = word;

w.onclick = ()=> showDates(word, dict[word]);

container.appendChild(w);

});
}
}

function showDates(word, dates){

let list = dates.join("\n");

let choose = prompt(`"${word}" used on:\n${list}\nEnter date:`);

if(choose && diaries[choose]){
openDiary(choose);
}
}

/* start */
renderCalendar();
