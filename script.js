const calendar = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");
const diaryInput = document.getElementById("diaryInput");
const result = document.getElementById("result");

let currentDate = new Date();
let selectedDate = null;

/* カレンダー生成 */
function generateCalendar(date) {

    calendar.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    monthLabel.textContent = `${year} / ${month + 1}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= lastDate; day++) {

        const div = document.createElement("div");
        div.textContent = day;
        div.classList.add("day");

        div.onclick = () => {
            selectedDate = `${year}-${month + 1}-${day}`;
            diaryInput.value = localStorage.getItem(selectedDate) || "";
        };

        calendar.appendChild(div);
    }
}

/* 保存 */
document.getElementById("saveBtn").onclick = () => {

    if (!selectedDate) return alert("日付を選んでください");

    localStorage.setItem(selectedDate, diaryInput.value);
    alert("Saved!");
};

/* 分析（超簡易版） */
document.getElementById("analyzeBtn").onclick = () => {

    const text = diaryInput.value;

    const wordCount = text.split(/\s+/).filter(w => w).length;

    result.textContent = `Word count: ${wordCount}`;
};

/* 月移動 */
document.getElementById("prevMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
};

document.getElementById("nextMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
};

generateCalendar(currentDate);
