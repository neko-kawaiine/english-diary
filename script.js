let currentDate = new Date();
let selectedDate = null;
let diaries = JSON.parse(localStorage.getItem("diaries") || "{}");

/* 画面切替 */
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* カレンダー描画 */
function renderCalendar(){
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();
  document.getElementById("monthLabel").textContent = `${year} / ${month+1}`;
  let firstDay = new Date(year,month,1).getDay();
  let lastDate = new Date(year,month+1,0).getDate();
  let cal = document.getElementById("calendar");
  cal.innerHTML="";

  for(let i=0;i<firstDay;i++){ cal.appendChild(document.createElement("div")); }

  for(let d=1; d<=lastDate; d++){
    let key = `${year}-${month+1}-${d}`;
    let emo = diaries[key]?.emotion || "";
    let div = document.createElement("div");
    div.className="day " + emo;
    div.textContent = d;
    div.onclick = ()=> openDiary(key);
    cal.appendChild(div);
  }
}

/* 月移動 */
function changeMonth(n){
  currentDate.setMonth(currentDate.getMonth()+n);
  renderCalendar();
}

/* 日記画面 */
function openDiary(dateKey){
  selectedDate=dateKey;
  showScreen("diaryScreen");
  document.getElementById("diaryDate").textContent = dateKey;
  let data = diaries[dateKey] || {};
  document.getElementById("diaryText").value = data.text || "";
  document.getElementById("emotion").value = data.emotion || "";
  updateCounter();
}

/* 文字数カウント */
function updateCounter(){
  let text=document.getElementById("diaryText").value;
  let count=text.length;
  document.getElementById("counter").textContent=`${count} / 50`;
  if(count>=50){ document.getElementById("diaryText").classList.add("goal"); }
  else{ document.getElementById("diaryText").classList.remove("goal"); }
}
document.getElementById("diaryText").addEventListener("input",updateCounter);

/* 英語のみ */
function containsJapanese(str){ return /[ぁ-んァ-ン一-龯]/.test(str); }

/* 保存 */
function saveDiary(){
  let text=document.getElementById("diaryText").value;
  if(containsJapanese(text)){ alert("English only!"); return; }
  let emo=document.getElementById("emotion").value;
  diaries[selectedDate]={text:text, emotion:emo};
  localStorage.setItem("diaries",JSON.stringify(diaries));
  backCalendar();
  renderCalendar();
}

/* 戻る */
function backCalendar(){ showScreen("calendarScreen"); }

/* Analyze */
function openAnalyze(){
  showScreen("analyzeScreen");
  buildDictionary();
}

/* 辞書作成 */
function buildDictionary(){
  let dict={};
  for(let date in diaries){
    let words=diaries[date].text.toLowerCase().match(/[a-z]+/g);
    if(!words) continue;
    words.forEach(w=>{ if(!dict[w]) dict[w]=[]; dict[w].push(date); });
  }

  let container=document.getElementById("dictionary");
  container.innerHTML="";

  let grouped={};
  Object.keys(dict).sort().forEach(word=>{
    let letter=word[0].toUpperCase();
    if(!grouped[letter]) grouped[letter]=[];
    grouped[letter].push(word);
  });

  for(let letter in grouped){
    let letterDiv=document.createElement("div");
    letterDiv.className="letter";
    letterDiv.textContent=letter;
    container.appendChild(letterDiv);

    grouped[letter].forEach(word=>{
      let wordDiv=document.createElement("div");
      wordDiv.className="word";
      let count=dict[word].length;
      wordDiv.textContent=`${word} (${count})`;

      // 日付リスト作成
      let datesDiv=document.createElement("div");
      datesDiv.className="dates";
      dict[word].forEach(d=>{
        let btn=document.createElement("button");
        btn.textContent=d;
        btn.onclick=()=>openDiary(d);
        datesDiv.appendChild(btn);
      });
      wordDiv.appendChild(datesDiv);

      // クリックでtoggle
      wordDiv.onclick=(e)=>{
        e.stopPropagation();
        let isVisible=datesDiv.style.display==="block";
        document.querySelectorAll(".dates").forEach(dv=>dv.style.display="none");
        datesDiv.style.display=isVisible?"none":"block";
      }

      container.appendChild(wordDiv);
    });
  }
}

/* イベント */
document.getElementById("prevMonth").onclick=()=>changeMonth(-1);
document.getElementById("nextMonth").onclick=()=>changeMonth(1);
document.getElementById("saveBtn").onclick=saveDiary;
document.getElementById("backBtn").onclick=()=>showScreen("calendarScreen");
document.getElementById("analyzeBtn").onclick=openAnalyze;
document.getElementById("backAnalyzeBtn").onclick=()=>showScreen("calendarScreen");

/* 初期描画 */
renderCalendar();
