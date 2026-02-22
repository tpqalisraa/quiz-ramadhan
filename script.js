let used5050 = false;
let usedFriend = false;
let usedAudience = false;

let filteredQuestions = [];
let current = 0;

const money = [
  "Rp 100.000",
  "Rp 200.000",
  "Rp 300.000",
  "Rp 500.000",
  "Rp 1.000.000",
  "Rp 2.000.000",
  "Rp 4.000.000",
  "Rp 8.000.000",
  "Rp 16.000.000",
  "Rp 32.000.000",
  "Rp 64.000.000",
  "Rp 125.000.000",
  "Rp 250.000.000",
  "Rp 500.000.000",
  "Rp 1.000.000.000",
];

function startGame() {
  const level = document.getElementById("levelSelect").value;
  if (!level) {
    alert("Pilih kelas dulu!");
    return;
  }

  filteredQuestions = questions.filter((q) => q.level === level);

  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".container").style.display = "flex";

  document.getElementById("startSound").play();
  document.getElementById("bgMusic").play();

  current = 0;
  loadQuestion();
  // reset tombol opsi
  document.querySelectorAll(".option").forEach((btn) => {
    btn.style.visibility = "visible";
  });
}

function openFullscreen() {
  const elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}
function loadQuestion() {
  const q = filteredQuestions[current];
  document.getElementById("question").innerText = q.q;

  const optDiv = document.getElementById("options");
  optDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;
    div.onclick = () => checkAnswer(i, div);
    optDiv.appendChild(div);
  });

  renderLadder();
}

function checkAnswer(i, el) {
  const q = filteredQuestions[current];

  // Nonaktifkan klik semua opsi setelah dipilih
  document.querySelectorAll(".option").forEach((opt) => {
    opt.style.pointerEvents = "none";
  });

  if (i === q.correct) {
    document.getElementById("correctSound").play();
    el.classList.add("correct");

    setTimeout(() => {
      current++;
      if (current < 15 && current < filteredQuestions.length) {
        loadQuestion();
      } else {
        alert("🎉 Selamat Anda Menang 1 M!");
        location.reload();
      }
    }, 1000);
  } else {
    document.getElementById("wrongSound").play();
    el.classList.add("wrong");


    function showWinPopup() {
      document.getElementById("winPopup").style.display = "flex";
    }

    function restartGame() {
      location.reload();
    }
    // Tampilkan juga jawaban yang benar
    document.querySelectorAll(".option")[q.correct].classList.add("correct");

    setTimeout(() => {
      location.reload();
    }, 1500);
  }
}

function renderLadder() {
  const ladder = document.getElementById("ladder");
  ladder.innerHTML = "";

  for (let i = money.length - 1; i >= 0; i--) {
    const li = document.createElement("li");
    li.textContent = money[i];

    if (i === current) {
      li.classList.add("active"); // ← pakai class
    }

    ladder.appendChild(li);
  }
}

document.getElementById("fifty").onclick = function () {
  if (used5050) return;

  used5050 = true;
  this.classList.add("used");

  const q = filteredQuestions[current];

  let wrongIndexes = [];

  q.options.forEach((opt, i) => {
    if (i !== q.correct) wrongIndexes.push(i);
  });

  // acak salah
  wrongIndexes.sort(() => 0.5 - Math.random());

  // ambil 2 untuk disembunyikan
  const hide = wrongIndexes.slice(0, 2);

  document.querySelectorAll(".option").forEach((btn, i) => {
    if (hide.includes(i)) {
      btn.style.visibility = "hidden";
    }
  });
};

document.getElementById("friend").onclick = function () {
  if (usedFriend) return;

  usedFriend = true;
  this.classList.add("used");

  const q = filteredQuestions[current];

  // 80% kemungkinan benar
  const chance = Math.random();

  let friendAnswer;

  if (chance < 0.8) {
    friendAnswer = q.options[q.correct];
  } else {
    let wrong = q.options.filter((_, i) => i !== q.correct);
    friendAnswer = wrong[Math.floor(Math.random() * wrong.length)];
  }

  showModal(
    "📞 <b>Temanmu berkata:</b><br><br>Saya yakin jawabannya adalah <b>" +
      friendAnswer +
      "</b>",
  );
};

document.getElementById("audience").onclick = function () {
  if (usedAudience) return;

  usedAudience = true;
  this.classList.add("used");

  const q = filteredQuestions[current];

  let percentages = [0, 0, 0, 0];

  // Jawaban benar lebih tinggi
  let correctPercent = 40 + Math.floor(Math.random() * 40); // 40-80%
  percentages[q.correct] = correctPercent;

  let remaining = 100 - correctPercent;

  for (let i = 0; i < 4; i++) {
    if (i !== q.correct) {
      let value = Math.floor(Math.random() * remaining);
      percentages[i] = value;
      remaining -= value;
    }
  }

  percentages[q.correct] += remaining; // pastikan total 100

  showModal(
    "<b>📊 Hasil Penonton:</b><br><br>" +
      "A: " +
      percentages[0] +
      "%<br>" +
      "B: " +
      percentages[1] +
      "%<br>" +
      "C: " +
      percentages[2] +
      "%<br>" +
      "D: " +
      percentages[3] +
      "%",
  );
};

function showModal(text) {
  document.getElementById("modalContent").innerHTML = text;
  document.getElementById("modalOverlay").style.display = "flex";
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
}

function showCorrectPopup() {
  const popup = document.getElementById("correctPopup");
  popup.style.display = "flex";

  setTimeout(() => {
    popup.style.display = "none";
  }, 1500); // tampil 1.5 detik
}
