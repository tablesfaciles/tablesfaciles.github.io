// Alpine.js Global Store for Multiplication App
document.addEventListener('alpine:init', () => {
  // Store pour la navigation partagée
  Alpine.store('nav', {
    mobileMenuOpen: false,
    toggle() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    close() {
      this.mobileMenuOpen = false;
    }
  });

  // Définition du parcours d'apprentissage par niveaux détaillés et pédagogiques
  const LEARNING_PATH = [
    { level: 1, name: "Découverte des Bases", tables: [2, 5, 10], description: "Familiarisation avec les tables de 2, 5 et 10. Prenez votre temps pour comprendre les concepts." },
    { level: 2, name: "Maîtrise des Bases", tables: [2, 5, 10], description: "Pratiquez les tables de 2, 5 et 10 pour améliorer votre précision et votre vitesse." },
    { level: 3, name: "Rapidité des Bases", tables: [2, 5, 10], description: "Défiez votre rapidité sur les tables de 2, 5 et 10. L'objectif est l'automatisation." },
    { level: 4, name: "Introduction aux Moyennes", tables: [3, 4], description: "Découvrez les tables de 3 et 4. Concentrez-vous sur la compréhension des nouvelles tables." },
    { level: 5, name: "Renforcement des Moyennes", tables: [3, 4], description: "Consolidez votre connaissance des tables de 3 et 4, tout en révisant les bases." },
    { level: 6, name: "Automatisation des Moyennes", tables: [3, 4], description: "Travaillez l'automatisation des tables de 3 et 4 pour des réponses rapides et justes." },
    { level: 7, name: "Défi des Premières Difficiles", tables: [6, 7], description: "Attaquez les tables de 6 et 7. Elles demandent plus de concentration !" },
    { level: 8, name: "Conquête des Dernières Difficiles", tables: [8, 9], description: "Maîtrisez les tables de 8 et 9. C'est ici que les plus grands progrès se font." },
    { level: 9, name: "Excellence des Difficiles", tables: [6, 7, 8, 9], description: "Devenez un expert des tables complexes. La régularité est la clé de la réussite." },
    { level: 10, name: "Grand Maître", tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], description: "Révision intensive de TOUTES les tables. Prouvez que vous êtes un Grand Maître de la multiplication !" }
  ];

  // Paramètres évolutifs pour chaque niveau du parcours d'apprentissage
  const LEARNING_PATH_SETTINGS = [
    { numOfQuestions: 10, secondsChrono: 45, chronoMode: 'question', operationType: 'multiplication' },
    { numOfQuestions: 12, secondsChrono: 40, chronoMode: 'question', operationType: 'multiplication' },
    { numOfQuestions: 15, secondsChrono: 30, chronoMode: 'question', operationType: 'multiplication' },
    { numOfQuestions: 12, secondsChrono: 40, chronoMode: 'question', operationType: 'multiplication' },
    { numOfQuestions: 15, secondsChrono: 35, chronoMode: 'question', operationType: 'multiplication' },
    { numOfQuestions: 18, secondsChrono: 25, chronoMode: 'question', operationType: 'multiplication' },
    { numOfQuestions: 15, secondsChrono: 30, chronoMode: 'question', operationType: 'multiplication' },
    { numOfQuestions: 20, secondsChrono: 25, chronoMode: 'question', operationType: 'multiplication' },
    { numOfQuestions: 25, secondsChrono: 20, chronoMode: 'question', operationType: 'multiplication' },
    { numOfQuestions: 20, secondsChrono: 20, chronoMode: 'question', operationType: 'multiplication' }
  ];

  window.LEARNING_PATH = LEARNING_PATH;
  window.LEARNING_PATH_SETTINGS = LEARNING_PATH_SETTINGS;

  Alpine.store('quiz', {
    // État global du quiz
    numOfQuestions: 10,
    secondsChrono: 30,
    chronoMode: 'question',
    countdownMode: 'all',
    selectedValues: [2, 3, 4, 5, 6, 7, 8, 9],
    operationType: 'multiplication',
    shouldSaveResult: true,

    // Apprentissage & Niveaux
    currentLevel: 0,
    modeApprentissage: false,
    latestGrade: null,
    beteNoire: null,
    proposedNextLevel: false,

    // État du quiz en cours
    currentQuestionIndex: 0,
    remainingDuration: 0,
    numCorrectAnswers: 0,
    numIncorrectAnswers: 0,
    pairs: [],
    currentPair: null,
    timerInterval: null,
    isQuizRunning: false,
    isQuizFinished: false,
    userAnswer: '',
    quizModeUsed: 'question',
    totalSecondsAllocated: 0,

    // Opérateurs
    operatorSymbols: {
      multiplication: { string: '×', symbol: '*' },
      division: { string: '÷', symbol: '/' },
      addition: { string: '+', symbol: '+' },
      soustraction: { string: '−', symbol: '-' }
    },

    // Historique
    quizResults: [],

    // Maîtrise des paires (LocalStorage)
    masteryData: {},

    // Table de Pythagore
    pythagoreValues: {},
    highlightMode: null,

    // Initialisation
    init() {
      this.loadResults();
      this.loadQuizPreferences();
      this.initPythagoreValues();
      this.loadMasteryData();
      this.loadLevel();
    },

    loadLevel() {
      const stored = localStorage.getItem('quiz_current_level');
      this.currentLevel = stored ? parseInt(stored, 10) : 0;
    },

    getLevelTables() {
      return LEARNING_PATH[this.currentLevel]?.tables || [2, 3, 4, 5, 6, 7, 8, 9];
    },

    loadResults() {
      const stored = localStorage.getItem('quizResults');
      if (stored) {
        try {
          this.quizResults = JSON.parse(stored);
        } catch (e) {
          this.quizResults = [];
        }
      } else {
        this.quizResults = [];
      }
    },

    loadMasteryData() {
      const stored = localStorage.getItem('mastery_data');
      if (stored) {
        try {
          this.masteryData = JSON.parse(stored);
        } catch (e) {
          this.masteryData = {};
        }
      } else {
        this.masteryData = {};
      }
    },

    updateStats(pairKey, isCorrect, time) {
      if (!this.masteryData[pairKey]) {
        this.masteryData[pairKey] = { success: 0, failure: 0, avgTime: 0 };
      }
      const stats = this.masteryData[pairKey];
      if (isCorrect) stats.success++;
      else stats.failure++;

      const totalAttempts = stats.success + stats.failure;
      stats.avgTime = (stats.avgTime * (totalAttempts - 1) + time) / totalAttempts;
      localStorage.setItem('mastery_data', JSON.stringify(this.masteryData));
    },

    loadQuizPreferences() {
      const stored = localStorage.getItem('quizPreferences');
      if (stored) {
        try {
          const prefs = JSON.parse(stored);
          this.operationType = prefs.operationType || 'multiplication';
          this.secondsChrono = prefs.secondsChrono || 30;
          this.chronoMode = prefs.chronoMode || 'question';
          this.numOfQuestions = prefs.numOfQuestions || 10;
          this.selectedValues = prefs.selectedValues || [2, 3, 4, 5, 6, 7, 8, 9];
        } catch (e) {
          console.error('Erreur chargement préférences:', e);
        }
      }
    },

    saveQuizPreferences() {
      const prefs = {
        operationType: this.operationType,
        secondsChrono: this.secondsChrono,
        chronoMode: this.chronoMode,
        numOfQuestions: this.numOfQuestions,
        selectedValues: this.selectedValues
      };
      localStorage.setItem('quizPreferences', JSON.stringify(prefs));
    },

    saveResultData(quizData) {
      if (!this.quizResults) {
        this.quizResults = [];
      }
      this.quizResults.push(quizData);
      localStorage.setItem('quizResults', JSON.stringify(this.quizResults));
    },

    formatTime(seconds) {
      const totalSeconds = parseFloat(seconds) || 0;
      if (totalSeconds <= 0) return '0s';
      const mins = Math.floor(totalSeconds / 60);
      const secs = Math.floor(totalSeconds % 60);
      let result = '';
      if (mins > 0) result += `${mins}min `;
      if (secs > 0 || mins === 0) result += `${secs}s`;
      return result.trim();
    },

    generatePairs() {
      let selected;
      if (this.modeApprentissage) {
        selected = this.generateIntelligentPairs();
      } else {
        const allPossible = this.getAllPossiblePairs();
        selected = this.selectRandomPairs(allPossible, this.numOfQuestions);
      }
      return selected.map(pair => ({
        factors: pair,
        answer: null,
        isCorrect: null
      }));
    },

    generateIntelligentPairs() {
      const tables = this.getLevelTables();
      const allPossible = [];
      for (let t of tables) {
        for (let i = 1; i <= 10; i++) {
          allPossible.push([t, i]);
        }
      }

      const selected = [];
      const numToSelect = Math.min(this.numOfQuestions, allPossible.length);
      let pool = [...allPossible];

      while (selected.length < numToSelect) {
        let totalWeight = 0;
        const weightedPool = pool.map(p => {
          const key = `${p[0]}x${p[1]}`;
          const stats = this.masteryData[key] || { failure: 0, success: 0, avgTime: 0 };
          let weight = 1;
          if (stats.failure > stats.success) weight += 10;
          if (stats.avgTime > 4000) weight += 5;
          if (stats.success === 0 && stats.failure === 0) weight += 3;
          totalWeight += weight;
          return { pair: p, weight };
        });

        let r = Math.random() * totalWeight;
        let cumulativeWeight = 0;
        for (let entry of weightedPool) {
          cumulativeWeight += entry.weight;
          if (r <= cumulativeWeight) {
            selected.push(entry.pair);
            pool = pool.filter(p => p !== entry.pair);
            break;
          }
        }
      }
      return this.shuffle(selected);
    },

    getAllPossiblePairs() {
      const pairs = [];
      if (this.selectedValues.length > 0) {
        for (let table of this.selectedValues) {
          for (let j = 1; j <= 10; j++) {
            let a, b;
            if (this.operationType === 'multiplication') { a = table; b = j; }
            else if (this.operationType === 'division') { a = table * j; b = table; }
            else if (this.operationType === 'addition') { a = table; b = j; }
            else if (this.operationType === 'soustraction') { a = table + j; b = table; }
            pairs.push([a, b]);
          }
        }
      } else {
        for (let i = 2; i <= 9; i++) {
          for (let j = 2; j <= 9; j++) {
            if (this.operationType === 'soustraction' && i < j) continue;
            if (this.operationType === 'division' && i % j !== 0) continue;
            pairs.push([i, j]);
          }
        }
      }
      return pairs;
    },

    selectRandomPairs(allPairs, count) {
      const selected = [];
      const available = [...allPairs];
      if (available.length < count) {
        for (let i = 0; i < count; i++) {
          const index = Math.floor(Math.random() * allPairs.length);
          selected.push([...allPairs[index]]);
        }
      } else {
        for (let i = 0; i < count; i++) {
          if (available.length === 0) break;
          const index = Math.floor(Math.random() * available.length);
          selected.push(available[index]);
          available.splice(index, 1);
        }
      }
      return selected;
    },

    getCorrectAnswer(a, b) {
      switch (this.operationType) {
        case 'multiplication': return a * b;
        case 'division': return a / b;
        case 'addition': return a + b;
        case 'soustraction': return a - b;
        default: return 0;
      }
    },

    checkAnswer(userAnswer) {
      if (!this.currentPair) return false;
      const [a, b] = this.currentPair.factors;
      const correct = this.getCorrectAnswer(a, b);
      const userAnswerNum = userAnswer === '' ? null : parseInt(userAnswer, 10);
      const isCorrect = userAnswerNum === correct;

      if (isCorrect) this.numCorrectAnswers++;
      else this.numIncorrectAnswers++;

      this.currentPair.answer = userAnswer;
      this.currentPair.isCorrect = isCorrect;
      return isCorrect;
    },

    calculateGrade(accuracy, avgTime) {
      if (accuracy === 100) {
        if (avgTime < 2500) return 'A+';
        return 'A';
      }
      if (accuracy >= 90) return 'A';
      if (accuracy >= 75) return 'B';
      return 'C';
    },

    getBeteNoire() {
      let worst = null;
      let maxFailRatio = -1;
      for (let pair of this.pairs) {
        const key = `${pair.factors[0]}x${pair.factors[1]}`;
        const stats = this.masteryData[key];
        if (stats) {
          const ratio = stats.failure / (stats.success + stats.failure || 1);
          if (ratio > maxFailRatio) { maxFailRatio = ratio; worst = pair.factors; }
          else if (ratio === maxFailRatio && worst) {
             if (stats.avgTime > (this.masteryData[`${worst[0]}x${worst[1]}`]?.avgTime || 0)) worst = pair.factors;
          }
        }
      }
      return worst;
    },

    checkLevelProgression(grade) {
      if (this.modeApprentissage && (grade === 'A' || grade === 'A+')) {
        if (this.currentLevel < LEARNING_PATH.length - 1) this.proposedNextLevel = true;
      }
    },

    acceptLevelUp() {
      this.currentLevel++;
      localStorage.setItem('quiz_current_level', this.currentLevel);
      this.proposedNextLevel = false;
    },

    initPythagoreValues() {
      for (let i = 2; i < 10; i++) {
        for (let j = 2; j < 10; j++) {
          const value = i * j;
          this.pythagoreValues[value] = (this.pythagoreValues[value] || 0) + 1;
        }
      }
    },

    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  });

  Alpine.data('debutantComponent', () => ({
    selectedTable: 1, revealedCells: [],
    selectTable(num) { this.selectedTable = num; this.revealedCells = []; },
    toggleCellReveal(index) {
      if (this.revealedCells.includes(index)) this.revealedCells = this.revealedCells.filter((i) => i !== index);
      else this.revealedCells.push(index);
    },
    revealAll() { this.revealedCells = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; },
    hideAll() { this.revealedCells = []; }
  }));

  Alpine.data('niveauComponent', () => ({
    selectedTable: 6, revealedCells: [],
    selectTable(num) { this.selectedTable = num; this.revealedCells = []; },
    toggleCellReveal(index) {
      if (this.revealedCells.includes(index)) this.revealedCells = this.revealedCells.filter((i) => i !== index);
      else this.revealedCells.push(index);
    },
    revealAll() { this.revealedCells = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; },
    hideAll() { this.revealedCells = []; },
    aleaTable() {
      const tables = [6, 7, 8];
      this.selectedTable = tables[Math.floor(Math.random() * tables.length)];
      this.revealedCells = [];
    }
  }));

  Alpine.data('expertComponent', () => ({
    selectedTable: 9, revealedCells: [],
    selectTable(num) { this.selectedTable = num; this.revealedCells = []; },
    toggleCellReveal(index) {
      if (this.revealedCells.includes(index)) this.revealedCells = this.revealedCells.filter((i) => i !== index);
      else this.revealedCells.push(index);
    },
    revealAll() { this.revealedCells = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; },
    hideAll() { this.revealedCells = []; },
    aleaTable() {
      const tables = [9, 10, 11, 12];
      this.selectedTable = tables[Math.floor(Math.random() * tables.length)];
      this.revealedCells = [];
    }
  }));

  Alpine.data('randomTablesComponent', () => ({
    tables: [], showScrollTop: false, operationType: "multiplication", selectedTables: [2, 3, 4, 5, 6, 7, 8, 9],
    init() {
      this.loadPreferences();
      this.$watch("operationType", () => { this.generateTables(); this.savePreferences(); });
      this.$watch("selectedTables", () => { this.generateTables(); this.savePreferences(); }, { deep: true });
      this.generateTables();
    },
    loadPreferences() {
      const saved = localStorage.getItem("randomTablesPreferences");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.operationType = data.operationType || "multiplication";
          this.selectedTables = data.selectedTables || [2, 3, 4, 5, 6, 7, 8, 9];
        } catch (e) {}
      }
    },
    savePreferences() {
      localStorage.setItem("randomTablesPreferences", JSON.stringify({ operationType: this.operationType, selectedTables: this.selectedTables }));
    },
    setOperationType(type) { this.operationType = type; },
    getOperatorSymbol() {
      const symbols = { multiplication: "×", division: "÷", addition: "+", soustraction: "−" };
      return symbols[this.operationType] || "×";
    },
    calculateResult(a, b) {
      switch (this.operationType) {
        case "multiplication": return a * b;
        case "division": return Math.floor(a / b);
        case "addition": return a + b;
        case "soustraction": return a - b;
        default: return a * b;
      }
    },
    generateTables() {
      this.tables = [];
      for (let a of this.selectedTables) {
        const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let numbers = [...allNumbers];
        if (this.operationType === "division") numbers = allNumbers.filter((b) => a % b === 0);
        else if (this.operationType === "soustraction") numbers = allNumbers.filter((b) => a >= b);

        const items = this.shuffle([...numbers]).map(num => ({ num, result: this.calculateResult(a, num) }));
        this.tables.push({ num: a, items });
      }
    },
    toggleTable(num) {
      const index = this.selectedTables.indexOf(num);
      if (index > -1) this.selectedTables.splice(index, 1);
      else { this.selectedTables.push(num); this.selectedTables.sort((a, b) => a - b); }
    },
    selectAllTables() { this.selectedTables = [2, 3, 4, 5, 6, 7, 8, 9]; },
    deselectAllTables() { this.selectedTables = []; },
    remixTable(tableNum) {
      const tIdx = this.tables.findIndex((t) => t.num === tableNum);
      if (tIdx !== -1) {
        this.shuffle(this.tables[tIdx].items);
        this.tables[tIdx] = { ...this.tables[tIdx] };
      }
    },
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }
  }));

  Alpine.data('pythagoreComponent', () => ({
    mode: "complete", showDuplicates: true, highlightMode: null, selectedRow: null, selectedCol: null, cellValues: {}, discoveredCells: [], selectedTablesDiscover: [2, 3, 4, 5, 6, 7, 8, 9],
    init() {
      for (let r = 2; r <= 9; r++) { for (let c = 2; c <= 9; c++) {
        const v = r * c; if (!this.cellValues[v]) this.cellValues[v] = [];
        this.cellValues[v].push({ r, c });
      }}
      this.loadDiscovered(); this.loadTablePreferences(); this.loadDuplicatesPreference(); this.loadModePreference();
    },
    loadDiscovered() { const s = localStorage.getItem("pythagoreDiscovered"); if (s) this.discoveredCells = JSON.parse(s); },
    saveDiscovered() { localStorage.setItem("pythagoreDiscovered", JSON.stringify(this.discoveredCells)); },
    loadTablePreferences() { const s = localStorage.getItem("pythagoreTablePreferences"); if (s) this.selectedTablesDiscover = JSON.parse(s); },
    saveTablePreferences() { localStorage.setItem("pythagoreTablePreferences", JSON.stringify(this.selectedTablesDiscover)); },
    loadDuplicatesPreference() { const s = localStorage.getItem("pythagoreDuplicates"); if (s !== null) this.showDuplicates = JSON.parse(s); },
    saveDuplicatesPreference() { localStorage.setItem("pythagoreDuplicates", JSON.stringify(this.showDuplicates)); },
    setMode(m) { this.mode = m; this.highlightMode = null; this.saveModePreference(); },
    saveModePreference() { localStorage.setItem("pythagoreMode", this.mode); },
    loadModePreference() { const s = localStorage.getItem("pythagoreMode"); if (s) this.mode = s; },
    resetDiscovery() { this.discoveredCells = []; localStorage.removeItem("pythagoreDiscovered"); },
    toggleDuplicates() { this.showDuplicates = !this.showDuplicates; this.saveDuplicatesPreference(); },
    toggleSelectedTable(n) {
      const i = this.selectedTablesDiscover.indexOf(n);
      if (i > -1) this.selectedTablesDiscover.splice(i, 1);
      else { this.selectedTablesDiscover.push(n); this.selectedTablesDiscover.sort((a, b) => a - b); }
      this.saveTablePreferences();
    },
    isCellDiscovered(r, c) { return this.discoveredCells.some((cell) => cell.row === r && cell.col === c); },
    addDiscoveredCell(r, c) { if (!this.isCellDiscovered(r, c)) { this.discoveredCells.push({ row: r, col: c }); this.saveDiscovered(); } },
    isDuplicate(v) { return (this.cellValues[v]?.length || 0) >= 3; },
    getCellClass(row, col) {
      const v = row * col;
      if (this.mode === "discover") {
        const inTable = this.selectedTablesDiscover.includes(row) || this.selectedTablesDiscover.includes(col);
        if (this.isCellDiscovered(row, col)) {
          if (this.showDuplicates && this.isDuplicate(v)) return (this.cellValues[v].length === 3) ? "bg-orange-500 text-white font-bold" : "bg-red-500 text-white font-bold";
          return "bg-blue-500 text-white font-bold";
        }
        return inTable ? "bg-yellow-200 dark:bg-yellow-900/40" : "bg-gray-200 dark:bg-gray-700 text-transparent";
      }
      if (this.highlightMode === "rowcol" && row === this.selectedRow && col === this.selectedCol) return "bg-blue-700 text-white font-bold";
      if (this.showDuplicates && this.isDuplicate(v)) return (this.cellValues[v].length === 3) ? "bg-orange-500 text-white font-bold" : "bg-red-500 text-white font-bold";
      return "hover:bg-gray-100 dark:hover:bg-gray-700";
    },
    highlightRowColumn(r, c) {
      if (this.mode === "discover") { this.addDiscoveredCell(r, c); return; }
      if (this.highlightMode === "rowcol" && this.selectedRow === r && this.selectedCol === c) this.highlightMode = null;
      else { this.highlightMode = "rowcol"; this.selectedRow = r; this.selectedCol = c; }
    },
    selectAllTableDiscover() { this.selectedTablesDiscover = [2, 3, 4, 5, 6, 7, 8, 9]; this.saveTablePreferences(); },
    deselectAllTableDiscover() { this.selectedTablesDiscover = []; this.saveTablePreferences(); },
    getProgressPercentage() {
      let total = 0;
      for (let r = 2; r <= 9; r++) { for (let c = 2; c <= 9; c++) {
          if (this.selectedTablesDiscover.includes(r) || this.selectedTablesDiscover.includes(c)) total++;
      }}
      if (total === 0) return 0;
      let discovered = this.discoveredCells.filter(cell => this.selectedTablesDiscover.includes(cell.row) || this.selectedTablesDiscover.includes(cell.col)).length;
      return (discovered / total) * 100;
    }
  }));

  Alpine.data('quizComponent', () => ({
    isStarted: false,
    isFinished: false,
    selectedStartMode: 'choose',
    userAnswer: "",
    remainingTime: 0,
    showFeedback: false,
    isLastAnswerCorrect: false,
    timerInterval: null,
    isProcessing: false,
    timePerQuestion: [],
    questionStartTime: 0,
    audioCtx: null,
    feedbackType: "",
    isMobileModal: false,
    isFeedbackModalVisible: false,

    get timeRatio() {
      const t = Alpine.store('quiz').chronoMode === "question" ? Alpine.store('quiz').secondsChrono : Alpine.store('quiz').totalSecondsAllocated;
      return this.remainingTime / t;
    },

    init() {
      this.isMobileModal = window.innerHeight < 600;
      this.remainingTime = Alpine.store('quiz').secondsChrono;
      this.$watch("Alpine.store('quiz').chronoMode", (m) => {
        Alpine.store('quiz').secondsChrono = (m === "question") ? 30 : 300;
        this.remainingTime = Alpine.store('quiz').secondsChrono;
      });
    },

    selectStartMode(mode) {
      this.selectedStartMode = mode;
      if (mode === 'free') {
          Alpine.store('quiz').loadQuizPreferences();
          this.remainingTime = Alpine.store('quiz').secondsChrono;
      }
    },

    speak(t) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(t);
        u.lang = "fr-FR";
        window.speechSynthesis.speak(u);
      }
    },

    beep(freq = 440, duration = 0.1) {
      if (!this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {}
    },

    toggleTable(n) {
      const i = Alpine.store('quiz').selectedValues.indexOf(n);
      if (i > -1) Alpine.store('quiz').selectedValues.splice(i, 1);
      else Alpine.store('quiz').selectedValues.push(n);
    },

    selectAllTables() { Alpine.store('quiz').selectedValues = [2, 3, 4, 5, 6, 7, 8, 9]; },
    deselectAllTables() { Alpine.store('quiz').selectedValues = []; },

    startLearningPath() {
      if (Alpine.store('quiz').currentLevel >= LEARNING_PATH.length) {
        this.selectedStartMode = 'choose';
        return;
      }
      Alpine.store('quiz').modeApprentissage = true;
      Alpine.store('quiz').selectedValues = Alpine.store('quiz').getLevelTables();
      const levelSettings = LEARNING_PATH_SETTINGS[Alpine.store('quiz').currentLevel];
      Alpine.store('quiz').operationType = levelSettings.operationType;
      Alpine.store('quiz').numOfQuestions = levelSettings.numOfQuestions;
      Alpine.store('quiz').secondsChrono = levelSettings.secondsChrono;
      Alpine.store('quiz').chronoMode = levelSettings.chronoMode;
      Alpine.store('quiz').shouldSaveResult = true;
      this.startQuiz();
    },

    startQuiz() {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (!Alpine.store('quiz').modeApprentissage && Alpine.store('quiz').selectedValues.length === 0) return alert("Sélectionnez au moins une table");
      Alpine.store('quiz').pairs = Alpine.store('quiz').generatePairs();
      Alpine.store('quiz').currentQuestionIndex = 0;
      Alpine.store('quiz').numCorrectAnswers = 0;
      Alpine.store('quiz').numIncorrectAnswers = 0;
      Alpine.store('quiz').currentPair = Alpine.store('quiz').pairs[0];
      Alpine.store('quiz').proposedNextLevel = false;
      this.isStarted = true;
      this.isFinished = false;
      this.timePerQuestion = [];
      this.userAnswer = "";
      this.showFeedback = false;
      this.remainingTime = Alpine.store('quiz').secondsChrono;
      if (Alpine.store('quiz').chronoMode === 'quiz') Alpine.store('quiz').totalSecondsAllocated = Alpine.store('quiz').secondsChrono;

      this.$nextTick(() => {
        this.startTimer();
        this.questionStartTime = Date.now();
        this.speak(`${Alpine.store('quiz').currentPair.factors[0]} fois ${Alpine.store('quiz').currentPair.factors[1]}`);
      });
    },

    startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime > 0 && this.remainingTime <= 3) this.beep(880, 0.1);
        if (this.remainingTime <= 0) {
          clearInterval(this.timerInterval);
          if (Alpine.store('quiz').chronoMode === 'quiz') { this.finishQuiz(); return; }
          if (this.userAnswer !== "") { this.submitAnswer(); }
          else {
            const pair = Alpine.store('quiz').currentPair;
            Alpine.store('quiz').updateStats(`${pair.factors[0]}x${pair.factors[1]}`, false, Date.now() - this.questionStartTime);
            Alpine.store('quiz').checkAnswer("");
            this.feedbackType = "noAnswer";
            this.showFeedback = true;
            setTimeout(() => this.nextQuestion(), 2000);
          }
        }
      }, 1000);
    },

    submitAnswer() {
      if (this.userAnswer === "" || this.isProcessing) return;
      this.isProcessing = true;
      clearInterval(this.timerInterval);
      const respTime = Date.now() - this.questionStartTime;
      const pair = Alpine.store('quiz').currentPair;
      this.isLastAnswerCorrect = Alpine.store('quiz').checkAnswer(this.userAnswer);
      Alpine.store('quiz').updateStats(`${pair.factors[0]}x${pair.factors[1]}`, this.isLastAnswerCorrect, respTime);
      this.feedbackType = this.isLastAnswerCorrect ? "correct" : "incorrect";
      this.showFeedback = true;
      this.speak(this.isLastAnswerCorrect ? `Bravo, ${this.userAnswer}` : `Faux, le résultat était ${Alpine.store('quiz').getCorrectAnswer(pair.factors[0], pair.factors[1])}`);
      setTimeout(() => this.nextQuestion(), 2000);
    },

    nextQuestion() {
      if (Alpine.store('quiz').chronoMode === "question") this.timePerQuestion.push(Alpine.store('quiz').secondsChrono - this.remainingTime);
      Alpine.store('quiz').currentQuestionIndex++;
      if (Alpine.store('quiz').currentQuestionIndex >= Alpine.store('quiz').numOfQuestions) { this.finishQuiz(); }
      else {
        Alpine.store('quiz').currentPair = Alpine.store('quiz').pairs[Alpine.store('quiz').currentQuestionIndex];
        this.userAnswer = "";
        this.showFeedback = false;
        this.isProcessing = false;
        if (Alpine.store('quiz').chronoMode === "question") this.remainingTime = Alpine.store('quiz').secondsChrono;
        this.$nextTick(() => {
          this.startTimer();
          this.questionStartTime = Date.now();
          this.speak(`${Alpine.store('quiz').currentPair.factors[0]} fois ${Alpine.store('quiz').currentPair.factors[1]}`);
        });
      }
    },

    finishQuiz() {
      if (this.isFinished) return;
      this.isFinished = true;
      clearInterval(this.timerInterval);
      const totalTime = this.timePerQuestion.reduce((a, b) => a + b, 0) * 1000;
      const avgTime = totalTime / Alpine.store('quiz').numOfQuestions;
      const accuracy = (Alpine.store('quiz').numCorrectAnswers / Alpine.store('quiz').numOfQuestions) * 100;
      Alpine.store('quiz').latestGrade = Alpine.store('quiz').calculateGrade(accuracy, avgTime);
      Alpine.store('quiz').beteNoire = Alpine.store('quiz').getBeteNoire();
      Alpine.store('quiz').checkLevelProgression(Alpine.store('quiz').latestGrade);
      this.speak(`Terminé. Note : ${Alpine.store('quiz').latestGrade}`);
      if (Alpine.store('quiz').shouldSaveResult) {
        Alpine.store('quiz').saveResultData({
          pairs: Alpine.store('quiz').pairs,
          quizProperties: {
            date: new Date().toLocaleString(),
            grade: Alpine.store('quiz').latestGrade,
            modeApprentissage: Alpine.store('quiz').modeApprentissage,
            operationType: Alpine.store('quiz').operationType,
            chronoMode: Alpine.store('quiz').chronoMode,
            secondsChrono: Alpine.store('quiz').secondsChrono,
            numOfQuestions: Alpine.store('quiz').numOfQuestions,
            timeUsed: totalTime / 1000,
            id: Date.now()
          }
        });
      }
    },

    resetQuiz() {
      this.isStarted = false;
      this.isFinished = false;
      Alpine.store('quiz').modeApprentissage = false;
      this.selectedStartMode = 'choose';
    },

    acceptLevelUp() { Alpine.store('quiz').acceptLevelUp(); this.resetQuiz(); }
  }));

  Alpine.data('historyComponent', () => ({
    openAccordions: [], chart: null,
    init() { Alpine.store('quiz').loadResults(); this.$nextTick(() => this.renderChart()); },
    renderChart() {
      const ctx = document.getElementById("progressionChart");
      if (!ctx || Alpine.store('quiz').quizResults.length === 0) return;
      if (this.chart) this.chart.destroy();
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: Alpine.store('quiz').quizResults.map(r => r.quizProperties.date.split(" ")[0]),
          datasets: [{
            label: "Score %",
            data: Alpine.store('quiz').quizResults.map(r => Math.round((r.pairs.filter(p => p.isCorrect).length / r.pairs.length) * 100)),
            borderColor: "#2563eb",
            fill: false
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    },
    toggleAccordion(index) {
      const idx = this.openAccordions.indexOf(index);
      if (idx > -1) this.openAccordions.splice(idx, 1);
      else this.openAccordions.push(index);
    },
    getTotalCorrect() { return Alpine.store('quiz').quizResults.reduce((sum, r) => sum + r.pairs.filter(p => p.isCorrect).length, 0); },
    getTotalIncorrect() { return Alpine.store('quiz').quizResults.reduce((sum, r) => sum + r.pairs.filter(p => !p.isCorrect).length, 0); },
    getGlobalScore() {
      const total = this.getTotalCorrect() + this.getTotalIncorrect();
      return total === 0 ? 0 : Math.round((this.getTotalCorrect() / total) * 100);
    },
    getScoreClass(result) {
      const score = Math.round((result.pairs.filter(p => p.isCorrect).length / result.pairs.length) * 100);
      if (score >= 80) return "text-green-600";
      if (score >= 60) return "text-yellow-600";
      return "text-red-600";
    },
    deleteResult(index) {
      Alpine.store('quiz').quizResults.splice(index, 1);
      localStorage.setItem("quizResults", JSON.stringify(Alpine.store('quiz').quizResults));
      this.openAccordions = [];
    },
    clearHistory() {
      Alpine.store('quiz').quizResults = [];
      localStorage.setItem("quizResults", JSON.stringify([]));
      this.openAccordions = [];
    }
  }));

  Alpine.store('quiz').init();
});
