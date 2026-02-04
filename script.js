const screens = {
calendar: document.getElementById("calendarScreen"),
diary: document.getElementById("diaryScreen"),
analyze: document.getElementById("analyzeScreen")
};

const calendar = document.getElementById("calendar");
const diaryInput = document.getElementById("diaryInput");
const charCount = document.getElementById("charCount");
const warning = document.getElementById("warning");
const saveBtn = document.getElementById("saveBtn");
const selectedDateText = document.getElementById("selectedDate");
const analyzeBtn = document.getElementById("analyzeBtn");
const wordList = document.getElementById("wordList");
const dateList = document.getElementById("dateList");

let selectedDate = "";

/* 画面切替 */
function showScreen(name){
Object.values(screens).forEach(s=>s.classList.remove("active"));
screens[name].classList.add("active");
}

/* カレンダー生成 */
function createCalendar(){
calendar.innerHTML="";
for(let i=1;i<=31;i++){
const div=document.createElement("div");
div.className="day";
div.textContent=i;
div.onclick=()=>openDiary(`2026-02-${String(i).padStart(2,"0")}`);
calendar.appendChild(div);
}
}

createCalendar();

/* 日記画面 */
function openDiary(date){
selectedDate=date;
selectedDateText.textContent=date;

diaryInput.value=localStorage.getItem(date)||"";
updateCount();

showScreen("diary");
}

/* 文字数 */
diaryInput.addEventListener("input",updateCount);

function updateCount(){
const words = diaryInput.value.trim().split(/\s+/).filter(Boolean);
charCount.textContent = words.length;

if(/[ぁ-んァ-ン一-龥]/.test(diaryInput.value)){
warning.textContent="⚠ 日本語は使用できません";
saveBtn.disabled=true;
}else{
warning.textContent="";
saveBtn.disabled=false;
}
}

/* 保存 */
saveBtn.onclick=()=>{
localStorage.setItem(selectedDate, diaryInput.value);
alert("Saved!");
};

/* 戻る */
document.querySelectorAll(".backBtn").forEach(btn=>{
btn.onclick=()=>showScreen("calendar");
});

/* Analyze */
analyzeBtn.onclick=()=>{
generateAnalysis();
showScreen("analyze");
};

function generateAnalysis(){
wordList.innerHTML="";
dateList.innerHTML="";

const wordsMap={};

Object.keys(localStorage).forEach(date=>{
const text=localStorage.getItem(date);
const words=text.toLowerCase().split(/\s+/);

words.forEach(w=>{
if(!wordsMap[w]) wordsMap[w]=[];
wordsMap[w].push(date);
});
});

const sorted=Object.keys(wordsMap).sort();

sorted.forEach(word=>{
const span=document.createElement("span");
span.textContent=word;

span.onclick=()=>{
dateList.innerHTML="";
wordsMap[word].forEach(date=>{
const d=document.createElement("div");
d.textContent=date;

d.onclick=()=>openDiary(date);
dateList.appendChild(d);
});
};

wordList.appendChild(span);
});
}
