class RangeImposterGame {
  constructor() {
    this.players = [];
    this.answers = {};
    this.questionMap = {};
    this.questions = questions;

    document.getElementById('nameInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.addPlayer();
    });
  }

  addPlayer() {
    const input = document.getElementById('nameInput');
    const name = input.value.trim();
    if (name && !this.players.includes(name)) {
      this.players.push(name);
      this.players.sort();
      input.value = '';
      this.updateNameList();
    }
  }

  updateNameList() {
    const list = document.getElementById('nameList');
    list.innerHTML = '';
    this.players.forEach(name => {
      const div = document.createElement('div');
      div.textContent = name;
      list.appendChild(div);
    });
  }

  startGame() {
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('answers').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');

    this.answers = {};
    this.selectQuestions();
    this.assignQuestions();
    this.renderGrid();
    document.getElementById('showAnswersBtn').classList.add('hidden');
    document.getElementById('shareCodeBtn').classList.add('hidden');
  }

  selectQuestions() {
    const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
    this.questionA = shuffled[0];
    this.questionB = shuffled[1];
  }

  assignQuestions() {
    const total = this.players.length;
    const minB = Math.max(1, Math.floor(total * 0.10));
    const maxB = Math.max(minB, Math.floor(total * 0.25));
    const bCount = Math.floor(Math.random() * (maxB - minB + 1)) + minB;

    const shuffled = [...this.players].sort(() => 0.5 - Math.random());
    const bGroup = new Set(shuffled.slice(0, bCount));

    this.players.forEach(name => {
      this.questionMap[name] = bGroup.has(name) ? this.questionB : this.questionA;
    });
  }

  renderGrid() {
    const grid = document.getElementById('playerGrid');
    grid.innerHTML = '';
    this.players.forEach(name => {
      const div = document.createElement('div');
      div.className = 'player';
      div.textContent = name;
      div.onclick = () => this.openAnswerPrompt(name, div);
      grid.appendChild(div);
    });
  }

  openAnswerPrompt(name, element) {
    const questionText = this.questionMap[name];
    const number = prompt(`${questionText}\nEnter your number:`);

    if (number !== null && number.trim() !== '') {
      this.answers[name] = { number: number.trim() };
      element.classList.add('submitted');
      this.checkAllSubmitted();
    }
  }

  checkAllSubmitted() {
    if (Object.keys(this.answers).length === this.players.length) {
      document.getElementById('showAnswersBtn').classList.remove('hidden');
      document.getElementById('shareCodeBtn').classList.remove('hidden');
    }
  }

  showAnswers() {
    document.getElementById('game').classList.add('hidden');
    document.getElementById('answers').classList.remove('hidden');

    const grid = document.getElementById('answerGrid');
    grid.innerHTML = '';

    this.players.forEach(name => {
      const entry = document.createElement('div');
      entry.className = 'entry';
      entry.textContent = `${name}: ${this.answers[name]?.number || '—'}`;
      grid.appendChild(entry);
    });

    if (!document.getElementById('revealBtn')) {
      const revealBtn = document.createElement('button');
      revealBtn.id = 'revealBtn';
      revealBtn.textContent = 'Reveal Questions';
      revealBtn.onclick = () => this.revealQuestions();
      document.getElementById('answers').appendChild(revealBtn);
    }
  }

  shareCode() {
    const qrContainer = document.getElementById("qrContainer");
    if (!qrContainer) return console.error("QR container not found!");

    const data = this.players.map(name => ({
      name,
      question: this.questionMap[name],
      answer: this.answers[name]?.number || null
    }));

    const BASE_URL = (() => {
      const { origin, pathname } = window.location;

      // If running from file:///, origin will be "null"
      if (origin === "null") {
        // Extract folder path from pathname
        const pathParts = pathname.split("/");
        pathParts.pop(); // remove current file (e.g. index.html)
        return "file:///" + pathParts.join("/") + "/";
      }

      // If hosted (e.g. GitHub Pages), use origin + path
      return origin + pathname.replace(/index\.html$/, "");
    })();

    const encoded = encodeURIComponent(btoa(JSON.stringify(data)));
    const shareURL = `${BASE_URL}show.html?data=${encoded}`;
    console.log("Share URL:", shareURL);

    qrContainer.innerHTML = "";

    if (typeof QRCode !== "undefined") {
      const canvas = document.createElement("canvas");
      qrContainer.appendChild(canvas);
      QRCode.toCanvas(canvas, shareURL, error => {
        if (error) console.error("QR generation failed:", error);
      });
    }
  }

  revealQuestions() {
    document.getElementById('game').classList.add('hidden');
    document.getElementById('answers').classList.remove('hidden');

    const grid = document.getElementById('answerGrid');
    grid.innerHTML = '';

    const data = this.players.map(name => ({
      name,
      question: this.questionMap[name],
      answer: this.answers[name]?.number || '—'
    }));

    renderAnswers(data, "answerGrid", questionLabels);

    if (!document.getElementById('nextRoundBtn')) {
      const nextBtn = document.createElement('button');
      nextBtn.id = 'nextRoundBtn';
      nextBtn.textContent = 'Next Question';
      nextBtn.onclick = () => this.startGame();
      document.getElementById('answers').appendChild(nextBtn);

      const restartBtn = document.createElement('button');
      restartBtn.id = 'restartBtn';
      restartBtn.textContent = 'Restart Game';
      restartBtn.onclick = () => this.restartGame();
      document.getElementById('answers').appendChild(restartBtn);
    }

    const revealBtn = document.getElementById('revealBtn');
    if (revealBtn) revealBtn.classList.add('hidden');
  }

  restartGame() {
    this.players = [];
    this.answers = {};
    this.questionMap = {};
    document.getElementById('nameList').innerHTML = '';
    document.getElementById('nameInput').value = '';
    document.getElementById('answers').classList.add('hidden');
    document.getElementById('setup').classList.remove('hidden');

    ['revealBtn', 'nextRoundBtn', 'restartBtn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.remove();
    });
  }
}

const game = new RangeImposterGame();