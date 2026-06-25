const API_BASE = 'http://127.0.0.1:5000';

const api = {
  predict: `${API_BASE}/predict`
};

const state = {
  history: JSON.parse(localStorage.getItem('fruit_history') || '[]'),
  stats: {
    fruits: { Apple: 12, Banana: 9, Orange: 7, Mango: 4 },
    fresh: 58,
    rotten: 42,
    grades: { A: 34, B: 41, C: 25 }
  }
};

const els = {
  video: document.getElementById('video'),
  canvas: document.getElementById('canvas'),
  uploadPreview: document.getElementById('uploadPreview'),
  webcamPreview: document.getElementById('webcamPreview'),
  uploadHint: document.getElementById('uploadHint'),
  fruitName: document.getElementById('fruitName'),
  freshStatus: document.getElementById('freshStatus'),
  confidence: document.getElementById('confidence'),
  grade: document.getElementById('grade'),
  nutrition: document.getElementById('nutrition'),
  historyList: document.getElementById('historyList'),
  voiceToggleBtn: document.getElementById('voiceToggleBtn')
};

let charts = {};
let stream = null;
let voiceEnabled = true;
let currentUtterance = null;

console.log(window.jspdf);

function showView(v) {
  document.querySelectorAll('.view').forEach(x => x.classList.add('hidden'));
  document.getElementById(v + 'View').classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === v));
}

function renderHistory() {
  els.historyList.innerHTML = state.history.slice().reverse().map((item, idx) => `
    <div class="history-item">
      <img src="${item.image}" alt="fruit">
      <div>
        <strong>${item.fruit}</strong>
        <span class="status-pill ${item.status === 'Fresh' ? 'fresh' : 'rotten'}">${item.status}</span>
        <div class="history-meta" style="margin-top:8px">Grade ${item.grade} • ${item.confidence}</div>
        <div class="history-time">${item.time}</div>
        <div class="history-meta">${item.nutrition}</div>
      </div>
      <div class="history-actions">
        <button class="btn ghost danger" data-del-index="${state.history.length - 1 - idx}">Delete</button>
      </div>
    </div>
  `).join('') || '<div class="history-meta">No history yet.</div>';

  document.querySelectorAll('[data-del-index]').forEach(btn => {
    btn.onclick = () => deleteHistoryItem(Number(btn.dataset.delIndex));
  });
}

function updateCharts() {
  Object.values(charts).forEach(c => c.destroy());

  charts.p1 = new Chart(document.getElementById('fruitPie'), {
    type: 'pie',
    data: {
      labels: Object.keys(state.stats.fruits),
      datasets: [{ data: Object.values(state.stats.fruits) }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 8 },
      plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 } } } }
    }
  });

  charts.p2 = new Chart(document.getElementById('freshBar'), {
    type: 'bar',
    data: {
      labels: ['Fresh', 'Rotten'],
      datasets: [{
        data: [state.stats.fresh, state.stats.rotten],
        backgroundColor: ['#37d67a', '#ff5d73'],
        borderRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 8 },
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { font: { size: 11 } }, grid: { display: false } },
        y: { ticks: { font: { size: 11 } }, grid: { color: 'rgba(255,255,255,.08)' } }
      }
    }
  });

  charts.p3 = new Chart(document.getElementById('gradeBar'), {
    type: 'bar',
    data: {
      labels: ['A', 'B', 'C'],
      datasets: [{
        data: [state.stats.grades.A, state.stats.grades.B, state.stats.grades.C],
        backgroundColor: ['#4cc9f0', '#7c5cff', '#ffbf47'],
        borderRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 8 },
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { font: { size: 11 } }, grid: { display: false } },
        y: { ticks: { font: { size: 11 } }, grid: { color: 'rgba(255,255,255,.08)' } }
      }
    }
  });
}

function updateAnalyticsCards(){

    const total =
    state.stats.fresh +
    state.stats.rotten;

    document.getElementById(
        "totalScans"
    ).textContent = total;

    document.getElementById(
        "freshCount"
    ).textContent =
    state.stats.fresh;

    document.getElementById(
        "rottenCount"
    ).textContent =
    state.stats.rotten;

    let topFruit = "-";

    let maxCount = 0;

    Object.entries(
        state.stats.fruits
    ).forEach(([fruit,count])=>{

        if(count > maxCount){

            maxCount = count;

            topFruit = fruit;
        }

    });

    document.getElementById(
        "topFruit"
    ).textContent = topFruit;
}

async function loadAnalytics(){

    const response =
    await fetch(
        "http://127.0.0.1:5000/analytics"
    );

    const data =
    await response.json();

    console.log(data);

    state.stats.fruits = {};

    data.fruits.forEach(item => {
        state.stats.fruits[item[0]] = item[1];
    });

    state.stats.fresh = 0;
    state.stats.rotten = 0;

    data.freshness.forEach(item => {

        if(item[0] === "Fresh")
            state.stats.fresh = item[1];

        if(item[0] === "Rotten")
            state.stats.rotten = item[1];

    });

    state.stats.grades = {
        A:0,
        B:0,
        C:0
    };

    data.grades.forEach(item => {
        state.stats.grades[item[0]] = item[1];
    });

    updateCharts();

    updateAnalyticsCards();
}

async function predictImage(file){

    const formData = new FormData();

    formData.append(
        "image",
        file,
        file.name
    );

    const response = await fetch(
        api.predict,
        {
            method:"POST",
            body:formData
        }
    );

    if(!response.ok){

        const text =
        await response.text();

        throw new Error(text);
    }

    return await response.json();
}

function speak(text) {
  if (!voiceEnabled) return;
  speechSynthesis.cancel();
  currentUtterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(currentUtterance);
}

function stopVoice() {
  speechSynthesis.cancel();
  currentUtterance = null;
}

function setVoiceButton() {
  els.voiceToggleBtn.textContent = voiceEnabled ? 'Voice: On' : 'Voice: Off';
}

function setResult(data, save = true) {
  els.fruitName.textContent = data.fruit || '-';
  els.freshStatus.textContent = data.status || '-';
  els.freshStatus.className = 'metric-value ' + ((data.status || '') === 'Fresh' ? 'fresh' : 'rotten');
  els.confidence.textContent = (data.confidence ?? '-') + '%';
  els.grade.textContent = data.grade || '-';
  if(data.nutrition){

    const n = data.nutrition;

    els.nutrition.innerHTML = `
    Calories: ${n.calories} kcal<br>
    Carbs: ${n.carbs} g<br>
    Protein: ${n.protein} g<br>
    Fat: ${n.fat} g<br>
    Fiber: ${n.fiber} g<br>
    Vitamin C: ${n.vitamin_c} mg<br>
    Potassium: ${n.potassium} mg
    `;
  }else{

    els.nutrition.innerHTML = "-";
  }
  
  document.getElementById(
    "resultImage"
  ).src = data.image;

  if (voiceEnabled) {
    speak(`${els.fruitName.textContent}. ${els.freshStatus.textContent}. Grade ${els.grade.textContent}. Confidence ${els.confidence.textContent}. ${els.nutrition.textContent}`);
  }

  if(data.image){

    document.getElementById(
        "resultImage"
    ).src = data.image;
  }

  if (save) {
    const item = {

        id: data.id,

        image: data.image || '',

        fruit: els.fruitName.textContent,

        status: els.freshStatus.textContent,

        grade: els.grade.textContent,

        confidence: els.confidence.textContent,

        nutrition: els.nutrition.textContent,

        time: new Date().toLocaleString()
    };

    state.history.push(item);

    localStorage.setItem(
        'fruit_history',
        JSON.stringify(state.history)
    );

    console.log("RESULT RECEIVED");
    console.log(data);

    renderHistory();

    console.log("HISTORY RENDERED");
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  els.video.srcObject = null;
}


async function deleteHistoryItem(idx){

    const recordId =
    state.history[idx].id;

    await fetch(
        `http://127.0.0.1:5000/delete_detection/${recordId}`,
        {
            method:"POST"
        }
    );

    state.history.splice(idx,1);

    localStorage.setItem(
        "fruit_history",
        JSON.stringify(state.history)
    );

    renderHistory();

    await loadAnalytics();
}

async function clearHistory() {

    state.history = [];

    localStorage.setItem(
        "fruit_history",
        "[]"
    );

    renderHistory();

    await fetch(
        "http://127.0.0.1:5000/clear_database",
        {
            method:"POST"
        }
    );

    await loadAnalytics();
}

document.getElementById('chooseBtn').onclick = () => document.getElementById('imageInput').click();

document.getElementById('imageInput').onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    els.uploadPreview.src = r.result;
    els.uploadPreview.classList.remove('hidden');
    els.uploadHint.classList.add('hidden');
  };
  r.readAsDataURL(f);
};

document.getElementById("predictImgBtn").onclick =
async () => {

  const btn = document.getElementById("predictImgBtn");

  btn.disabled = true;
  btn.textContent = "Predicting...";

  const file =
  document.getElementById("imageInput").files[0];

  if (!file) {

      alert("Please select an image first");

      btn.disabled = false;
      btn.textContent = "Predict";

      return;
  }

  try {

    console.log(file);
    console.log(file.size);
    console.log(file.name);

    const result =
    await predictImage(file);

    setResult({

      id: result.id,

      fruit: result.fruit,

      status: result.freshness,

      confidence: result.fruit_confidence,

      grade: result.grade,

      nutrition: result.nutrition,

      image: els.uploadPreview.src
    });

    await loadAnalytics();

    renderHistory();

    btn.disabled = false;
    btn.textContent = "Predict";

  }
  catch(err){

    console.error(err);

    alert("Prediction failed");

    btn.disabled = false;
    btn.textContent = "Predict";

  }

};

document.getElementById('startCamBtn').onclick = async () => {

  if (stream) return;

  try {

    stream =
    await navigator.mediaDevices.getUserMedia({
      video: true
    });

    els.video.srcObject = stream;

    await els.video.play();

  }
  catch(err){
    console.error(err);
    alert("Unable to access camera");
  }

};

document.getElementById('captureBtn').onclick = () => {

  if (!stream) return;

  els.canvas.width =
  els.video.videoWidth;

  els.canvas.height =
  els.video.videoHeight;

  const ctx =
  els.canvas.getContext('2d');

  ctx.drawImage(
    els.video,
    0,
    0,
    els.canvas.width,
    els.canvas.height
  );

  const snap =
  els.canvas.toDataURL('image/png');

  els.webcamPreview.src =
  snap;

  els.webcamPreview.classList.remove('hidden');

  stopCamera();

};

document.getElementById("predictCamBtn").onclick =
async () => {

  const btn = document.getElementById("predictCamBtn");

  btn.disabled = true;
  btn.textContent = "Predicting...";

  if (!els.webcamPreview.src) {

    alert("Capture image first");

    return;
  }

  try {

    const response =
    await fetch(
      els.webcamPreview.src
    );

    const blob =
    await response.blob();

    const file =
    new File(
      [blob],
      "capture.png",
      {
        type:"image/png"
      }
    );

    const result =
    await predictImage(file);

    setResult({
      id: result.id,
      fruit: result.fruit,
      status: result.freshness,
      confidence: result.fruit_confidence,
      grade: result.grade,
      nutrition: result.nutrition,
      image: els.webcamPreview.src
    });
    
    await loadAnalytics();

    renderHistory();

    btn.disabled = false;
    btn.textContent = "Predict";

  }
  catch(err){

    console.error(err);

    alert("Prediction failed");

    btn.disabled = false;
    btn.textContent = "Predict";

  }

};

document.getElementById('voiceToggleBtn').onclick = () => {

  voiceEnabled = !voiceEnabled;

  if (!voiceEnabled) {
    stopVoice();
  }

  setVoiceButton();

};

document.getElementById('speakNowBtn').onclick = () => {
  voiceEnabled = true;
  setVoiceButton();
  speak(`${els.fruitName.textContent}. ${els.freshStatus.textContent}. Grade ${els.grade.textContent}. Confidence ${els.confidence.textContent}. ${els.nutrition.textContent}`);
};

document.getElementById('stopVoiceBtn').onclick = () => stopVoice();

document.querySelectorAll('.nav-btn').forEach(b => b.onclick = () => showView(b.dataset.view));

document.getElementById('clearHistoryBtn').onclick = () => clearHistory();

renderHistory();

if(state.history.length > 0){

    state.stats.fruits = {};
    state.stats.fresh = 0;
    state.stats.rotten = 0;

    state.stats.grades = {
        A:0,
        B:0,
        C:0
    };

    state.history.forEach(item => {

        state.stats.fruits[item.fruit] =
            (state.stats.fruits[item.fruit] || 0) + 1;

        if(item.status === "Fresh")
            state.stats.fresh++;
        else
            state.stats.rotten++;

        if(state.stats.grades[item.grade] !== undefined)
            state.stats.grades[item.grade]++;
    });

    updateCharts();
    updateAnalyticsCards();

}
else{

    state.stats = {
        fruits:{},
        fresh:0,
        rotten:0,
        grades:{
            A:0,
            B:0,
            C:0
        }
    };

    updateCharts();
    updateAnalyticsCards();
}

voiceEnabled = true;

setVoiceButton();

stopCamera();

document.getElementById("downloadReportBtn").onclick = () => {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // ORIGINAL HEADING
    doc.setFontSize(18);
    doc.text(
        "Smart Fruit Quality Assessment Report",
        20,
        20
    );

    // IMAGE
    const img =
    document.getElementById(
        "resultImage"
    );

    if(img && img.complete){

        try{

            doc.addImage(
                img,
                "PNG",
                130,
                15,
                50,
                50
            );

        }catch(err){

            console.log(err);

        }

    }

    doc.setFontSize(12);

    doc.text(
        "Fruit: " +
        els.fruitName.textContent,
        20,
        60
    );

    doc.text(
        "Freshness: " +
        els.freshStatus.textContent,
        20,
        70
    );

    doc.text(
        "Confidence: " +
        els.confidence.textContent,
        20,
        80
    );

    doc.text(
        "Grade: " +
        els.grade.textContent,
        20,
        90
    );

    doc.text(
        "Date: " +
        new Date().toLocaleString(),
        20,
        100
    );

    // NUTRITION
    const nutritionText =
    document.getElementById(
        "nutrition"
    ).innerText;

    const nutritionLines =
    doc.splitTextToSize(
        nutritionText,
        170
    );

    doc.text(
        "Nutrition Information:",
        20,
        120
    );

    doc.text(
        nutritionLines,
        20,
        130
    );

    doc.save(
        "Fruit_Report.pdf"
    );

};