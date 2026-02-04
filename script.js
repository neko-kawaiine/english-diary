let currentDate = new Date();
let selectedDate = null;

// diaries を localStorage から取得
let diaries = JSON.parse(localStorage.getItem("diaries") || "{}");

/* 画面切替 */
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* カレンダー生成 */
function renderCalendar(){
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();

  document.getElementById("monthLabel").textContent = `${year} / ${month+1}`;

  let firstDay = new Date(year, month, 1).getDay();
  let lastDate = new Date(year, month+1, 0).getDate();

  let cal = document.getElementById("calendar");
  cal.innerHTML = "";

  // 空白の日
  for(let i=0; i<firstDay; i++){
    let blank = document.createElement("div");
    cal.appendChild(blank);
  }

  // 日付生成
  for(let d=1; d<=lastDate; d++){
    let key = `${year}-${month+1}-${d}`;
    
    // ← 安全に emotion を取得
    let emo = "";
    if(diaries[key] && diaries[key].emotion){
      emo = diaries[key].emotion;
    }

    let div = document.createElement("div");
    div.className = "day " + emo;
    div.textContent = d;

    div.onclick = function(){ openDiary(key); }

    cal.appendChild(div);
  }
}

/* 月移動 */
function changeMonth(n){
  currentDate.setMonth(currentDate.getMonth() + n);
  renderCalendar();
}

/* 日記画面 */
function openDiary(dateKey){
  selectedDate = dateKey;
  showScreen("diaryScreen");

  document.getElementById("diaryDate").textContent = dateKey;

  let data = diaries[dateKey] || {};
  document.getElementById("diaryText").value = data.text || "";
  document.getElementById("emotion").value = data.emotion || "";

  updateCounter();
}

/* 文字数カウント＆50達成背景 */
function updateCounter(){
  let text = document.getElementById("diaryText").value;
  let count = text.length;

  document.getElementById("counter").textContent = `${count} / 50`;

  if(count >= 50){
    document.getElementById("diaryText").classList.add("goal");
  } else {
    document.getElementById("diaryText").classList.remove("goal");
  }
}

/* 日本語チェック */
function containsJapanese(str){
  return /[ぁ-んァ-ン一-龯]/.test(str);
}

document.getElementById("diaryText").addEventListener("input", updateCounter);

/* 日記保存 */
function saveDiary(){
  let text = document.getElementById("diaryText").value;

  if(containsJapanese(text)){
    alert("English only!");
    return;
  }

  let emo = document.getElementById("emotion").value;

  diaries[selectedDate] = {text: text, emotion: emo};
  localStorage.setItem("diaries", JSON.stringify(diaries));

  backCalendar();
  renderCalendar();
}

/* カレンダーに戻る */
function backCalendar(){
  showScreen("calendarScreen");
}

/* Analyze画面 */
function openAnalyze(){
  showScreen("analyzeScreen");
  buildDictionary();
}

/* 辞書生成 */
function buildDictionary(){
  let dict = {};

  for(let date in diaries){
    let words = diaries[date].text.toLowerCase().match(/[a-z]+/g);
    if(!words) continue;

    words.forEach(w => {
      if(!dict[w]) dict[w] = [];
      dict[w].push(date);
    });
  }

  let container = document.getElementById("dictionary");
  container.innerHTML = "";

  let grouped = {};

  Object.keys(dict).sort().forEach(word => {
    let letter = word[0].toUpperCase();
    if(!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(word);
  });

  for(let letter in grouped){
    let letterDiv = document.createElement("div");
    letterDiv.className = "letter";
    letterDiv.textContent = letter;
    container.appendChild(letterDiv);

    grouped[letter].forEach(word => {
      let w = document.createElement("div");
      w.className = "word";
      w.textContent = word;

      w.onclick = function(){
        showDates(word, dict[word]);
      }

      container.appendChild(w);
    });
  }
}

/* 単語使用日付表示 */
function showDates(word, dates){
  let list = dates.join("\n");
  let choose = prompt(`"${word}" used on:\n${list}\nEnter date:`);

  if(choose && diaries[choose]){
    openDiary(choose);
  }
}

/* 初期描画 */
renderCalendar();
