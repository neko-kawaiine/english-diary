const calendarDiv = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const diaryInput = document.getElementById("diaryInput");
const charCount = document.getElementById("charCount");
const moodSelect = document.getElementById("mood");
const warning = document.getElementById("warning");

let currentDate = new Date();
let selectedDate = "";

const screens={
calendar:calendarScreen,
diary:diaryScreen,
analyze:analyzeScreen
};

function showScreen(name){
Object.values(screens).forEach(s=>s.classList.remove("active"));
screens[name].classList.add("active");
}

/* カレンダー生成 */

function createCalendar(){
calendarDiv.innerHTML="";

let year=currentDate.getFullYear();
let month=currentDate.getMonth();

monthTitle.textContent=`${year} / ${month+1}`;

let lastDay=new Date(year,month+1,0).getDate();

for(let i=1;i<=lastDay;i++){

let dateStr=`${year}-${String(month+1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;

let div=document.createElement("div");
div.className="day";
div.textContent=i;

let data=JSON.parse(localStorage.getItem(dateStr)||"{}");

if(data.words>=50) div.classList.add("green");
if(data.mood) div.classList.add(data.mood);

div.onclick=()=>openDiary(dateStr);

calendarDiv.appendChild(div);
}
}

createCalendar();

/* 月移動 */

prevMonth.onclick=()=>{
currentDate.setMonth(currentDate.getMonth()-1);
createCalendar();
};

nextMonth.onclick=()=>{
currentDate.setMonth(currentDate.getMonth()+1);
createCalendar();
};

/* 日記 */

function openDiary(date){
selectedDate=date;
selectedDateText.textContent=date;

let data=JSON.parse(localStorage.getItem(date)||"{}");

diaryInput.value=data.text||"";
moodSelect.value=data.mood||"";

updateCount();

showScreen("diary");
}

diaryInput.addEventListener("input",updateCount);

function updateCount(){

let words=diaryInput.value.trim().split(/\s+/).filter(Boolean);
charCount.textContent=words.length;

if(/[ぁ-んァ-ン一-龥]/.test(diaryInput.value)){
warning.textContent="日本語禁止";
saveBtn.disabled=true;
}else{
warning.textContent="";
saveBtn.disabled=false;
}

if(words.length>=50){
diaryInput.style.background="#dcfce7";
}else{
diaryInput.style.background="white";
}
}

/* 保存 */

saveBtn.onclick=()=>{

let words=diaryInput.value.trim().split(/\s+/).filter(Boolean);

localStorage.setItem(selectedDate,JSON.stringify({
text:diaryInput.value,
words:words.length,
mood:moodSelect.value
}));

createCalendar();
alert("Saved");
};

/* Analyze */

analyzeBtn.onclick=()=>{
generateAnalysis();
showScreen("analyze");
};

function generateAnalysis(){

wordList.innerHTML="";
dateList.innerHTML="";

let dictionary={};

Object.keys(localStorage).forEach(date=>{
let data=JSON.parse(localStorage.getItem(date));

if(!data.text) return;

let words=data.text.toLowerCase().split(/\s+/);

words.forEach(w=>{
if(!dictionary[w]) dictionary[w]=[];
dictionary[w].push(date);
});
});

/* A-Z構造 */

let grouped={};

Object.keys(dictionary).forEach(word=>{
let first=word[0].toUpperCase();

if(!grouped[first]) grouped[first]=[];
grouped[first].push(word);
});

Object.keys(grouped).sort().forEach(letter=>{

let h=document.createElement("h3");
h.textContent=letter;
wordList.appendChild(h);

grouped[letter].sort().forEach(word=>{

let w=document.createElement("span");
w.textContent=word;
w.className="word";

w.onclick=()=>{
dateList.innerHTML="";

dictionary[word].forEach(date=>{
let d=document.createElement("div");
d.textContent=date;
d.onclick=()=>openDiary(date);
dateList.appendChild(d);
});
};

wordList.appendChild(w);
});
});
}

/* 戻る */

document.querySelectorAll(".backBtn").forEach(btn=>{
btn.onclick=()=>showScreen("calendar");
});
