let currentDate = new Date();
let selectedDateKey = null;

function formatDateKey(date){
  return date.toISOString().split("T")[0];
}

function renderCalendar(){

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById("monthTitle").textContent =
    `${year} / ${month+1}`;

  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  days.forEach(d=>{
    const div = document.createElement("div");
    div.textContent = d;
    div.className = "day-name";
    grid.appendChild(div);
  });

  const firstDay = new Date(year,month,1).getDay();
  const lastDate = new Date(year,month+1,0).getDate();

  for(let i=0;i<firstDay;i++){
    grid.appendChild(document.createElement("div"));
  }

  for(let d=1; d<=lastDate; d++){

    const date = new Date(year,month,d);
    const key = formatDateKey(date);

    const div = document.createElement("div");
    div.textContent = d;
    div.className = "date-cell";

    const diary = JSON.parse(localStorage.getItem("diary_"+key));

    if(diary){
      div.style.background = diary.color || "#ccc";
    }

    div.onclick = ()=>openDiary(key);

    grid.appendChild(div);
  }
}

function prevMonth(){
  currentDate.setMonth(currentDate.getMonth()-1);
  renderCalendar();
}

function nextMonth(){
  currentDate.setMonth(currentDate.getMonth()+1);
  renderCalendar();
}

function openDiary(key){

  selectedDateKey = key;

  document.getElementById("calendarPage").style.display="none";
  document.getElementById("diaryPage").style.display="block";

  document.getElementById("selectedDate").textContent = key;

  const saved = JSON.parse(localStorage.getItem("diary_"+key));

  if(saved){
    diaryText.value = saved.text;
    moodSelect.value = saved.mood;
  }else{
    diaryText.value="";
  }

  updateCharCount();
}

function backToCalendar(){
  document.getElementById("calendarPage").style.display="block";
  document.getElementById("diaryPage").style.display="none";
  renderCalendar();
}

/* 英語チェック */
function isEnglishOnly(text){
  return /^[A-Za-z0-9\s.,!?'"-]*$/.test(text);
}

/* 文字数 */
function updateCharCount(){
  const text = diaryText.value;
  const count = text.length;

  charCount.textContent = count;

  if(count >= 50){
    diaryText.style.background = "#d4ffd4";
  }else{
    diaryText.style.background = "white";
  }
}

diaryText.addEventListener("input", updateCharCount);

/* 保存 */
function saveDiary(){

  const text = diaryText.value;

  if(!isEnglishOnly(text)){
    alert("English only!");
    return;
  }

  const mood = moodSelect.value;

  const colors = {
    happy:"#ffd966",
    sad:"#9fc5e8",
    angry:"#ff6b6b",
    calm:"#b6d7a8",
    excited:"#f4cccc",
    tired:"#d9d2e9"
  };

  const data = {
    text,
    mood,
    color:colors[mood]
  };

  localStorage.setItem("diary_"+selectedDateKey, JSON.stringify(data));

  updateWordStats(selectedDateKey,text);

  backToCalendar();
}

/* ===== 単語分析 ===== */

function updateWordStats(dateKey,text){

  const words = text.toLowerCase().match(/[a-z']+/g);
  if(!words) return;

  let stats = JSON.parse(localStorage.getItem("wordStats") || "{}");

  words.forEach(w=>{
    if(!stats[w]) stats[w]=[];

    if(!stats[w].includes(dateKey)){
      stats[w].push(dateKey);
    }
  });

  localStorage.setItem("wordStats",JSON.stringify(stats));
}

/* Analyze画面 */
function openAnalyze(){

  document.getElementById("calendarPage").style.display="none";
  document.getElementById("analyzePage").style.display="block";

  const container = document.getElementById("wordList");
  container.innerHTML="";

  const stats = JSON.parse(localStorage.getItem("wordStats") || "{}");

  Object.keys(stats).sort().forEach(word=>{

    const btn = document.createElement("button");
    btn.textContent = `${word} (${stats[word].length})`;

    btn.onclick = ()=>showWordDates(word);

    container.appendChild(btn);
  });
}

/* 単語→日付一覧 */
function showWordDates(word){

  const stats = JSON.parse(localStorage.getItem("wordStats"));

  const container = document.getElementById("wordDates");
  container.innerHTML = `<h3>${word}</h3>`;

  stats[word].forEach(date=>{

    const btn = document.createElement("button");
    btn.textContent = date;

    btn.onclick = ()=>{
      openDiary(date);
    };

    container.appendChild(btn);
  });
}

function backFromAnalyze(){
  document.getElementById("analyzePage").style.display="none";
  document.getElementById("calendarPage").style.display="block";
}

/* 初期表示 */
renderCalendar();
