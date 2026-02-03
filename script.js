const calendar=document.getElementById("calendar");
const weekdayHeader=document.getElementById("weekdayHeader");
const monthTitle=document.getElementById("monthTitle");
const diaryText=document.getElementById("diaryText");

let currentDate=new Date();
let selectedDateKey="";

/* ===== Calendar ===== */

function renderWeekdays(){
  const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  weekdayHeader.innerHTML="";
  days.forEach(d=>{
    const div=document.createElement("div");
    div.textContent=d;
    weekdayHeader.appendChild(div);
  });
}

function renderCalendar(){

  calendar.innerHTML="";

  const year=currentDate.getFullYear();
  const month=currentDate.getMonth();

  monthTitle.textContent=`${year} / ${month+1}`;

  const firstDay=new Date(year,month,1).getDay();
  const lastDate=new Date(year,month+1,0).getDate();

  for(let i=0;i<firstDay;i++){
    calendar.appendChild(document.createElement("div"));
  }

  for(let d=1;d<=lastDate;d++){

    const dateKey=`${year}-${month+1}-${d}`;

    const div=document.createElement("div");
    const span=document.createElement("span");
    span.textContent=d;

    const saved=JSON.parse(localStorage.getItem("diary_"+dateKey));

    if(saved){
      span.style.background=getMoodColor(saved.mood);
    }

    span.onclick=()=>openDiary("diary_"+dateKey);

    div.appendChild(span);
    calendar.appendChild(div);
  }
}

function getMoodColor(mood){
  return{
    happy:"#ffeaa7",
    sad:"#74b9ff",
    excited:"#fab1a0",
    tired:"#b2bec3",
    angry:"#ff7675",
    calm:"#55efc4"
  }[mood];
}

function prevMonth(){
  currentDate.setMonth(currentDate.getMonth()-1);
  renderCalendar();
}

function nextMonth(){
  currentDate.setMonth(currentDate.getMonth()+1);
  renderCalendar();
}

/* ===== Diary ===== */

function openDiary(key){

  selectedDateKey=key;

  document.getElementById("calendarPage").style.display="none";
  document.getElementById("analyzePage").style.display="none";
  document.getElementById("diaryPage").style.display="block";

  document.getElementById("selectedDate").textContent=key;

  const saved=JSON.parse(localStorage.getItem(key));

  if(saved){
    diaryText.value=saved.text;
    moodSelect.value=saved.mood;
  }else{
    diaryText.value="";
  }

  updateCharCount();
}

function backToCalendar(){
  document.getElementById("calendarPage").style.display="block";
  document.getElementById("diaryPage").style.display="none";
  document.getElementById("analyzePage").style.display="none";
  renderCalendar();
}

function saveDiary(){

  if(/[^a-zA-Z0-9 .,!?'\n]/.test(diaryText.value)){
    alert("English only!");
    return;
  }

  const data={
    text:diaryText.value,
    mood:moodSelect.value
  };

  localStorage.setItem(selectedDateKey,JSON.stringify(data));
  alert("Saved!");
}

diaryText.addEventListener("input",updateCharCount);

function updateCharCount(){
  const count=diaryText.value.length;
  document.getElementById("charCount").textContent=`${count} / 50`;

  document.body.style.background=
    count>=50 ? "#eafaf1" : "#f7f7f7";
}

/* ===== Analyze ===== */

function openAnalyze(){

  document.getElementById("calendarPage").style.display="none";
  document.getElementById("diaryPage").style.display="none";
  document.getElementById("analyzePage").style.display="block";

  const wordMap={};

  for(let key in localStorage){

    if(key.startsWith("diary_")){

      const data=JSON.parse(localStorage.getItem(key));
      const words=data.text.toLowerCase().match(/[a-z']+/g);

      if(!words) continue;

      words.forEach(w=>{
        if(!wordMap[w]) wordMap[w]=[];
        wordMap[w].push(key.replace("diary_",""));
      });
    }
  }

  renderWordList(wordMap);
}

function renderWordList(map){

  const container=document.getElementById("wordList");
  container.innerHTML="";

  Object.keys(map).sort().forEach(word=>{

    const div=document.createElement("div");
    div.className="wordItem";
    div.textContent=`${word} (${map[word].length})`;

    div.onclick=()=>showDates(word,map[word]);

    container.appendChild(div);
  });
}

function showDates(word,dates){

  const container=document.getElementById("dateList");
  container.innerHTML=`<h3>${word}</h3>`;

  dates.forEach(date=>{
    const btn=document.createElement("button");
    btn.textContent=date;
    btn.onclick=()=>openDiary("diary_"+date);
    container.appendChild(btn);
  });
}

/* ===== Init ===== */

renderWeekdays();
renderCalendar();
