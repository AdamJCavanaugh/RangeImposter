class RangeImposterGame {
  constructor() {
    this.players = [];
    this.answers = {};
    this.questionMap = {};
    this.questionPairs = questionPairs;

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
    this.currentPair = this.questionPairs[Math.floor(Math.random() * this.questionPairs.length)];

    this.assignQuestions();
    this.renderGrid();
    document.getElementById('showAnswersBtn').classList.add('hidden');
  }

  assignQuestions() {
    const total = this.players.length;
    const minB = Math.max(1, Math.floor(total * 0.10));
    const maxB = Math.max(minB, Math.floor(total * 0.25));
    const bCount = Math.floor(Math.random() * (maxB - minB + 1)) + minB;

    const shuffled = [...this.players].sort(() => 0.5 - Math.random());
    const bGroup = new Set(shuffled.slice(0, bCount));

    this.players.forEach(name => {
      this.questionMap[name] = bGroup.has(name) ? 'B' : 'A';
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
    const type = this.questionMap[name];
    const questionText = this.currentPair[type.toLowerCase()];
    const number = prompt(`Question ${type}: ${questionText}\nEnter your number:`);

    if (number !== null && number.trim() !== '') {
      this.answers[name] = { number: number.trim() };
      element.classList.add('submitted');
      this.checkAllSubmitted();
    }
  }

  checkAllSubmitted() {
    if (Object.keys(this.answers).length === this.players.length) {
      document.getElementById('showAnswersBtn').classList.remove('hidden');
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

  revealQuestions() {
    const grid = document.getElementById('answerGrid');
    grid.innerHTML = '';

    const aColumn = document.createElement('div');
    const bColumn = document.createElement('div');
    aColumn.className = 'column';
    bColumn.className = 'column';

    const aHeader = document.createElement('h3');
    aHeader.textContent = `Question A: ${this.currentPair.a}`;
    const bHeader = document.createElement('h3');
    bHeader.textContent = `Question B: ${this.currentPair.b}`;

    aColumn.appendChild(aHeader);
    bColumn.appendChild(bHeader);

    this.players.forEach(name => {
      const answer = this.answers[name]?.number || '—';
      const entry = document.createElement('div');
      entry.className = 'entry';
      entry.textContent = `${name}: ${answer}`;

      if (this.questionMap[name] === 'A') {
        aColumn.appendChild(entry);
      } else {
        bColumn.appendChild(entry);
      }
    });

    grid.appendChild(aColumn);
    grid.appendChild(bColumn);

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

    document.getElementById('revealBtn').classList.add('hidden');
  }

  restartGame() {
    this.players = [];
    this.answers = {};
    this.questionMap = {};
    document.getElementById('nameList').innerHTML = '';
    document.getElementById('nameInput').value = '';
    document.getElementById('answers').classList.add('hidden');
    document.getElementById('setup').classList.remove('hidden');

    // Remove buttons if restarting
    ['revealBtn', 'nextRoundBtn', 'restartBtn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.remove();
    });
  }
}

const game = new RangeImposterGame();