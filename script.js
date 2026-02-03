let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
let selected = null;

const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function drawCalendar(){

  const grid = document.getElementById("calendarGrid");
  const title = document.getElementById("monthTitle");

  grid.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth+1, 0).getDate();

  title.textContent = `${currentYear} / ${currentMonth+1}`;

  // ⭐ 曜日
  weekdays.forEach(day=>{
    const div = document.createElement("div");
    div.textContent = day;
    div.classList.add("weekday");
    grid.appendChild(div);
  });

  // ⭐ 空白セル
  for(let i=0;i<firstDay;i++){
    const blank = document.createElement("div");
    grid.appendChild(blank);
  }

  // ⭐ 日付
  for(let d=1; d<=lastDate; d++){

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("date");

    const span = document.createElement("span");
    span.textContent = d;

    const today = new Date();
    if(
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    ){
      dateDiv.classList.add("today");
    }

    dateDiv.onclick = () => selectDate(d);

    dateDiv.appendChild(span);
    grid.appendChild(dateDiv);
  }
}

function selectDate(day){

  selected = `${currentYear}-${currentMonth+1}-${day}`;
  document.getElementById("selectedDate").textContent = selected;

  const saved = localStorage.getItem(selected);
  document.getElementById("diaryText").value = saved || "";
}

function saveDiary(){
  if(!selected) return alert("Select a date first!");

  const text = document.getElementById("diaryText").value;
  localStorage.setItem(selected, text);
  alert("Saved!");
}

function prevMonth(){
  currentMonth--;
  if(currentMonth < 0){
    currentMonth = 11;
    currentYear--;
  }
  drawCalendar();
}

function nextMonth(){
  currentMonth++;
  if(currentMonth > 11){
    currentMonth = 0;
    currentYear++;
  }
  drawCalendar();
}

drawCalendar();
