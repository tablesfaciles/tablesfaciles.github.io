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

  Alpine.store('quiz', {
    // État global du quiz
    numOfQuestions: 10,
    secondsChrono: 30,
    chronoMode: 'question', // 'question' ou 'quiz'
    countdownMode: 'all',
    selectedValues: [2, 3, 4, 5, 6, 7, 8, 9],
    operationType: 'multiplication',
    shouldSaveResult: true,

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
    quizModeUsed: 'question', // mode utilisé pour ce quiz
    totalSecondsAllocated: 0, // temps total alloué pour le quiz

    // Opérateurs
    operatorSymbols: {
      multiplication: { string: '×', symbol: '*' },
      division: { string: '÷', symbol: '/' },
      addition: { string: '+', symbol: '+' },
      soustraction: { string: '−', symbol: '-' }
    },

    // Historique
    quizResults: [],

    // Mastery Tracking
    masteryData: {},

    // Table de Pythagore
    pythagoreValues: {},
    highlightMode: null,

    // Initialiser les résultats depuis localStorage
    init() {
      this.loadResults();
      this.loadQuizPreferences();
      this.initPythagoreValues();
      this.loadMasteryData();
    },

    // Charger les données de maîtrise depuis localStorage
    loadMasteryData() {
      const stored = localStorage.getItem('mastery_data');
      if (stored) {
        try {
          this.masteryData = JSON.parse(stored);
        } catch (e) {
          console.error('Erreur chargement mastery_data:', e);
          this.masteryData = {};
        }
      } else {
        this.masteryData = {};
      }
    },

    // Mettre à jour les statistiques de maîtrise pour une paire
    updateStats(pair, isCorrect, time) {
      if (!this.masteryData[pair]) {
        this.masteryData[pair] = {
          success: 0,
          failure: 0,
          avgTime: 0
        };
      }

      const stats = this.masteryData[pair];
      const totalAttempts = stats.success + stats.failure;

      // Calculer la nouvelle moyenne du temps de réponse
      stats.avgTime = (stats.avgTime * totalAttempts + time) / (totalAttempts + 1);

      if (isCorrect) {
        stats.success++;
      } else {
        stats.failure++;
      }

      localStorage.setItem('mastery_data', JSON.stringify(this.masteryData));
    },

    // Charger les résultats depuis localStorage
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

    // Charger les préférences du quiz depuis localStorage
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

    // Sauvegarder les préférences du quiz
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

    // Sauvegarder un résultat
    saveResultData(quizData) {
      if (!this.quizResults) {
        this.quizResults = [];
      }
      this.quizResults.push(quizData);
      localStorage.setItem('quizResults', JSON.stringify(this.quizResults));
    },

    // Formatage du temps
    formatTime(seconds) {
      // Sécurité : si seconds est null, undefined ou NaN, on affiche 0s
      const totalSeconds = parseFloat(seconds) || 0;
      if (totalSeconds <= 0) return '0s';

      const mins = Math.floor(totalSeconds / 60);
      const secs = Math.floor(totalSeconds % 60);

      let result = '';
      if (mins > 0) result += `${mins}min `;
      if (secs > 0 || mins === 0) result += `${secs}s`;
      return result.trim();
    },

    // Générer les paires aléatoires
    generatePairs() {
      const pairs = [];
      const allPossible = this.getAllPossiblePairs();
      const selected = this.selectRandomPairs(allPossible, this.numOfQuestions);

      return selected.map(pair => ({
        factors: pair,
        answer: null,
        isCorrect: null
      }));
    },

    getAllPossiblePairs() {
      const pairs = [];

      // Si des tables spécifiques sont sélectionnées
      if (this.selectedValues.length > 0) {
        for (let table of this.selectedValues) {
          // Générer les 10 paires pour chaque table (de 1 à 10)
          for (let j = 1; j <= 10; j++) {
            let a, b;

            if (this.operationType === 'multiplication') {
              a = table;
              b = j;
            } else if (this.operationType === 'division') {
              // Pour la division : table × j ÷ table = j
              a = table * j;
              b = table;
            } else if (this.operationType === 'addition') {
              a = table;
              b = j;
            } else if (this.operationType === 'soustraction') {
              // Pour la soustraction : table + j - table = j
              a = table + j;
              b = table;
            }

            pairs.push([a, b]);
          }
        }
      } else {
        // Si aucune table n'est sélectionnée, générer toutes les combinaisons possibles
        for (let i = 2; i <= 9; i++) {
          for (let j = 2; j <= 9; j++) {
            // Soustraction : éviter les résultats négatifs
            if (this.operationType === 'soustraction' && i < j) continue;

            // Division : éviter les décimales (i doit être divisible par j)
            if (this.operationType === 'division') {
              if (i % j !== 0) continue;
            }

            pairs.push([i, j]);
          }
        }
      }

      return pairs;
    },

    selectRandomPairs(allPairs, count) {
      const selected = [];
      const available = [...allPairs];

      // Si on n'a pas assez de paires uniques, on va permettre les doublons
      if (available.length < count) {
        // Générer avec doublons possibles
        for (let i = 0; i < count; i++) {
          const index = Math.floor(Math.random() * allPairs.length);
          selected.push([...allPairs[index]]); // Copie pour éviter les références
        }
      } else {
        // Sélection sans doublons (comportement original)
        for (let i = 0; i < count; i++) {
          if (available.length === 0) break;
          const index = Math.floor(Math.random() * available.length);
          selected.push(available[index]);
          available.splice(index, 1);
        }
      }

      return selected;
    },

    // Calculer la réponse correcte
    getCorrectAnswer(a, b) {
      switch (this.operationType) {
        case 'multiplication': return a * b;
        case 'division': return a / b;
        case 'addition': return a + b;
        case 'soustraction': return a - b;
        default: return 0;
      }
    },

    // Vérifier la réponse
    checkAnswer(userAnswer) {
      if (!this.currentPair) return false;

      const [a, b] = this.currentPair.factors;
      const correct = this.getCorrectAnswer(a, b);
      const userAnswerNum = userAnswer === '' ? null : parseInt(userAnswer, 10);
      const isCorrect = userAnswerNum === correct;

      if (isCorrect) {
        this.numCorrectAnswers++;
      } else {
        this.numIncorrectAnswers++;
      }

      this.currentPair.answer = userAnswer;
      this.currentPair.isCorrect = isCorrect;

      return isCorrect;
    },

    // Initialiser la table de Pythagore
    initPythagoreValues() {
      for (let i = 2; i < 10; i++) {
        for (let j = 2; j < 10; j++) {
          const value = i * j;
          this.pythagoreValues[value] = (this.pythagoreValues[value] || 0) + 1;
        }
      }
    },

    // Générer les lignes de la table aléatoire
    generateRandomTableRows() {
      const rows = [];
      for (let a = 2; a < 10; a++) {
        const items = [];
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.shuffle(numbers);

        for (let i of numbers) {
          items.push({ num: i, result: a * i });
        }

        rows.push({ table: a, items });
      }
      return rows;
    },

    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  });

  // Composant pour les débutants (tables 1-5)
  Alpine.data('debutantComponent', () => ({
    selectedTable: 1,
    revealedCells: [],

    selectTable(num) {
      this.selectedTable = num;
      this.revealedCells = [];
    },

    toggleCellReveal(index) {
      if (this.revealedCells.includes(index)) {
        this.revealedCells = this.revealedCells.filter((i) => i !== index);
      } else {
        this.revealedCells.push(index);
      }
    },

    revealAll() {
      this.revealedCells = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    },

    hideAll() {
      this.revealedCells = [];
    }
  }));

  // Composant pour le niveau intermédiaire (tables 6-8)
  Alpine.data('niveauComponent', () => ({
    selectedTable: 6,
    revealedCells: [],

    selectTable(num) {
      this.selectedTable = num;
      this.revealedCells = [];
    },

    toggleCellReveal(index) {
      if (this.revealedCells.includes(index)) {
        this.revealedCells = this.revealedCells.filter((i) => i !== index);
      } else {
        this.revealedCells.push(index);
      }
    },

    revealAll() {
      this.revealedCells = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    },

    hideAll() {
      this.revealedCells = [];
    },

    aleaTable() {
      const tables = [6, 7, 8];
      this.selectedTable = tables[Math.floor(Math.random() * tables.length)];
      this.revealedCells = [];
    }
  }));

  // Composant pour le niveau expert (tables 9+)
  Alpine.data('expertComponent', () => ({
    selectedTable: 9,
    revealedCells: [],

    selectTable(num) {
      this.selectedTable = num;
      this.revealedCells = [];
    },

    toggleCellReveal(index) {
      if (this.revealedCells.includes(index)) {
        this.revealedCells = this.revealedCells.filter((i) => i !== index);
      } else {
        this.revealedCells.push(index);
      }
    },

    revealAll() {
      this.revealedCells = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    },

    hideAll() {
      this.revealedCells = [];
    },

    aleaTable() {
      const tables = [9, 10, 11, 12];
      this.selectedTable = tables[Math.floor(Math.random() * tables.length)];
      this.revealedCells = [];
    }
  }));

  // Composant pour les tables aléatoires
  Alpine.data('randomTablesComponent', () => ({
    tables: [],
    showScrollTop: false,
    operationType: "multiplication",
    selectedTables: [2, 3, 4, 5, 6, 7, 8, 9],

    init() {
      // Charger les préférences depuis localStorage
      this.loadPreferences();

      // Watchers pour sauvegarder automatiquement
      this.$watch("operationType", () => {
        this.generateTables();
        this.savePreferences();
      });
      this.$watch(
        "selectedTables",
        () => {
          this.generateTables();
          this.savePreferences();
        },
        { deep: true },
      );

      this.generateTables();
    },

    loadPreferences() {
      const saved = localStorage.getItem("randomTablesPreferences");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.operationType = data.operationType || "multiplication";
          this.selectedTables = data.selectedTables || [2, 3, 4, 5, 6, 7, 8, 9];
        } catch (e) {
          console.error("Erreur chargement préférences:", e);
        }
      }
    },

    savePreferences() {
      const data = {
        operationType: this.operationType,
        selectedTables: this.selectedTables,
      };
      localStorage.setItem("randomTablesPreferences", JSON.stringify(data));
    },

    setOperationType(type) {
      this.operationType = type;
    },

    getOperationLabel(plural = false) {
      const labels = {
        multiplication: plural ? "multiplications" : "multiplications",
        division: plural ? "divisions" : "divisions",
        addition: plural ? "additions" : "additions",
        soustraction: plural ? "soustractions" : "soustractions",
      };
      return labels[this.operationType] || "multiplications";
    },

    getOperatorSymbol() {
      const symbols = {
        multiplication: "×",
        division: "÷",
        addition: "+",
        soustraction: "−",
      };
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

    getPossibleNumbers(tableNum) {
      const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      if (this.operationType === "division") {
        return allNumbers.filter((b) => tableNum % b === 0);
      } else if (this.operationType === "soustraction") {
        return allNumbers.filter((b) => tableNum >= b);
      }

      return allNumbers;
    },

    generateTables() {
      this.tables = [];
      for (let a of this.selectedTables) {
        const numbers = this.getPossibleNumbers(a);
        const items = [];
        const numbersCopy = [...numbers];
        this.shuffle(numbersCopy);

        for (let num of numbersCopy) {
          items.push({ num, result: this.calculateResult(a, num) });
        }

        this.tables.push({ num: a, items });
      }
    },

    toggleTable(num) {
      const index = this.selectedTables.indexOf(num);
      if (index > -1) {
        this.selectedTables.splice(index, 1);
      } else {
        this.selectedTables.push(num);
        this.selectedTables.sort((a, b) => a - b);
      }
    },

    selectAllTables() {
      this.selectedTables = [2, 3, 4, 5, 6, 7, 8, 9];
    },

    deselectAllTables() {
      this.selectedTables = [];
    },

    remixTable(tableNum) {
      const tableIndex = this.tables.findIndex((t) => t.num === tableNum);
      if (tableIndex !== -1) {
        const table = this.tables[tableIndex];
        this.shuffle(table.items);
        this.$nextTick(() => {
          this.tables[tableIndex] = { ...table };
        });
      }
    },

    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }));

  // Composant pour la table de Pythagore
  Alpine.data('pythagoreComponent', () => ({
    mode: "complete", // 'complete' ou 'discover'
    showDuplicates: true,
    highlightMode: null,
    selectedRow: null,
    selectedCol: null,
    cellValues: {}, // Stocke les positions des valeurs
    discoveredCells: [], // Cellules découvertes en mode découvrir
    selectedTablesDiscover: [2, 3, 4, 5, 6, 7, 8, 9], // Tables à pratiquer en mode découvrir

    init() {
      // Initialiser les valeurs des cellules et compter les occurrences
      for (let row = 2; row <= 9; row++) {
        for (let col = 2; col <= 9; col++) {
          const value = row * col;
          if (!this.cellValues[value]) {
            this.cellValues[value] = [];
          }
          this.cellValues[value].push({ row, col });
        }
      }
      // Charger les découvertes et préférences depuis localStorage
      this.loadDiscovered();
      this.loadTablePreferences();
      this.loadDuplicatesPreference();
      this.loadModePreference();
    },

    loadDiscovered() {
      const saved = localStorage.getItem("pythagoreDiscovered");
      if (saved) {
        this.discoveredCells = JSON.parse(saved);
      }
    },

    saveDiscovered() {
      localStorage.setItem("pythagoreDiscovered", JSON.stringify(this.discoveredCells));
    },

    loadTablePreferences() {
      const saved = localStorage.getItem("pythagoreTablePreferences");
      if (saved) {
        try {
          this.selectedTablesDiscover = JSON.parse(saved);
        } catch (e) {
          this.selectedTablesDiscover = [2, 3, 4, 5, 6, 7, 8, 9];
        }
      }
    },

    saveTablePreferences() {
      localStorage.setItem("pythagoreTablePreferences", JSON.stringify(this.selectedTablesDiscover));
    },

    loadDuplicatesPreference() {
      const saved = localStorage.getItem("pythagoreDuplicates");
      if (saved !== null) {
        this.showDuplicates = JSON.parse(saved);
      }
    },

    saveDuplicatesPreference() {
      localStorage.setItem("pythagoreDuplicates", JSON.stringify(this.showDuplicates));
    },

    setMode(newMode) {
      this.mode = newMode;
      this.highlightMode = null;
      this.selectedRow = null;
      this.selectedCol = null;
      this.saveModePreference();
    },

    saveModePreference() {
      localStorage.setItem("pythagoreMode", this.mode);
    },

    loadModePreference() {
      const saved = localStorage.getItem("pythagoreMode");
      if (saved) {
        this.mode = saved;
      }
    },

    resetDiscovery() {
      this.discoveredCells = [];
      localStorage.removeItem("pythagoreDiscovered");
      this.highlightMode = null;
    },

    toggleDuplicates() {
      this.showDuplicates = !this.showDuplicates;
      this.saveDuplicatesPreference();
    },

    toggleSelectedTable(num) {
      const index = this.selectedTablesDiscover.indexOf(num);
      if (index > -1) {
        this.selectedTablesDiscover.splice(index, 1);
      } else {
        this.selectedTablesDiscover.push(num);
        this.selectedTablesDiscover.sort((a, b) => a - b);
      }
      this.saveTablePreferences();
    },

    selectAllTableDiscover() {
      this.selectedTablesDiscover = [2, 3, 4, 5, 6, 7, 8, 9];
      this.saveTablePreferences();
    },

    deselectAllTableDiscover() {
      this.selectedTablesDiscover = [];
      this.saveTablePreferences();
    },

    getTotalCellsToDiscover() {
      if (this.selectedTablesDiscover.length === 0) {
        return 0;
      }
      let count = 0;
      for (let row = 2; row <= 9; row++) {
        for (let col = 2; col <= 9; col++) {
          if (
            this.selectedTablesDiscover.includes(row) ||
            this.selectedTablesDiscover.includes(col)
          ) {
            count++;
          }
        }
      }
      return count;
    },

    getProgressPercentage() {
      const total = this.getTotalCellsToDiscover();
      if (total === 0) return 0;

      let discovered = 0;
      for (const cell of this.discoveredCells) {
        if (
          this.selectedTablesDiscover.includes(cell.row) ||
          this.selectedTablesDiscover.includes(cell.col)
        ) {
          discovered++;
        }
      }
      return (discovered / total) * 100;
    },

    isCellDiscovered(row, col) {
      return this.discoveredCells.some(
        (cell) => cell.row === row && cell.col === col,
      );
    },

    addDiscoveredCell(row, col) {
      if (!this.isCellDiscovered(row, col)) {
        this.discoveredCells.push({ row, col });
        this.saveDiscovered();
      }
    },

    isDuplicate(value) {
      const occurrences = this.cellValues[value]?.length || 0;
      return occurrences >= 3;
    },

    isHeaderRowHighlighted(row) {
      return this.highlightMode === "rowcol" && this.selectedRow === row;
    },

    isHeaderColHighlighted(col) {
      return this.highlightMode === "rowcol" && this.selectedCol === col;
    },

    getCellClass(row, col) {
      const value = row * col;

      // Mode Découvrir
      if (this.mode === "discover") {
        // Déterminer si cette cellule fait partie des tables à pratiquer
        const inSelectedTable =
          this.selectedTablesDiscover.length === 0 ||
          this.selectedTablesDiscover.includes(row) ||
          this.selectedTablesDiscover.includes(col);

        if (this.isCellDiscovered(row, col)) {
          // Cellule découverte
          if (this.showDuplicates && this.isDuplicate(value)) {
            const occ = this.cellValues[value].length;
            return occ === 3
              ? "bg-orange-500 text-white font-bold scale-105"
              : "bg-red-500 text-white font-bold scale-105";
          }
          return "bg-blue-500 text-white font-bold scale-105";
        }

        // Cellule non découverte
        if (inSelectedTable) {
          // Cellule à découvrir - mise en surbrillance jaune
          return "bg-yellow-200 dark:bg-yellow-900/40 text-gray-900 dark:text-gray-200 cursor-pointer hover:bg-yellow-300 dark:hover:bg-yellow-900/60 font-semibold";
        }
        // Cellule hors des tables sélectionnées
        return "bg-gray-200 dark:bg-gray-700 text-transparent cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600";
      }

      // Mode Complète
      // Surligner seulement la cellule cliquée (pas la ligne/colonne entière)
      if (this.highlightMode === "rowcol") {
        if (row === this.selectedRow && col === this.selectedCol) {
          return "bg-blue-700 text-white font-bold scale-105";
        }
        // Pas de surligne du reste, retourner normal
        if (this.showDuplicates && this.isDuplicate(value)) {
          const occ = this.cellValues[value].length;
          return occ === 3
            ? "bg-orange-500 text-white font-bold"
            : "bg-red-500 text-white font-bold";
        }
        return "hover:bg-gray-100 dark:hover:bg-gray-700";
      }

      // Pas de surbrillance active
      if (this.showDuplicates && this.isDuplicate(value)) {
        const occ = this.cellValues[value].length;
        return occ === 3
          ? "bg-orange-500 text-white font-bold"
          : "bg-red-500 text-white font-bold";
      }

      return "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer";
    },

    highlightRowColumn(row, col) {
      // Mode Découvrir
      if (this.mode === "discover") {
        this.addDiscoveredCell(row, col);
        return;
      }

      // Mode Complète - Surligner seulement la cellule cliquée
      if (
        this.highlightMode === "rowcol" &&
        this.selectedRow === row &&
        this.selectedCol === col
      ) {
        this.highlightMode = null;
      } else {
        this.highlightMode = "rowcol";
        this.selectedRow = row;
        this.selectedCol = col;
      }
    }
  }));

  // Composant pour le Quiz
  Alpine.data('quizComponent', () => ({
    isStarted: false,
    isFinished: false,
    userAnswer: "",
    remainingTime: 0,
    showFeedback: false,
    isLastAnswerCorrect: false,
    timerInterval: null,
    isProcessing: false,
    timePerQuestion: [],
    audioCtx: null,
    feedbackType: "",
    isMobileModal: false,
    isFeedbackModalVisible: false,
    questionStartTime: 0,

    getPairKey(a, b, op) {
      const symbols = {
        multiplication: 'x',
        division: '/',
        addition: '+',
        soustraction: '-'
      };
      return `${a}${symbols[op] || 'x'}${b}`;
    },

    get timeRatio() {
      const total =
        Alpine.store('quiz').chronoMode === "question"
          ? Alpine.store('quiz').secondsChrono
          : Alpine.store('quiz').totalSecondsAllocated;
      return this.remainingTime / total;
    },

    shouldShowFeedbackModal() {
      return this.isMobileModal;
    },

    getVisibleHeight() {
      if (window.visualViewport) {
        return window.visualViewport.height;
      }
      return window.innerHeight;
    },

    init() {
      this.isMobileModal = this.getVisibleHeight() < 600;

      window.addEventListener("resize", () => {
        this.isMobileModal = this.getVisibleHeight() < 600;
      });
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => {
          this.isMobileModal = this.getVisibleHeight() < 600;
        });
      }
      if (
        !Alpine.store('quiz').secondsChrono ||
        Alpine.store('quiz').secondsChrono === 0
      ) {
        if (Alpine.store('quiz').chronoMode === "question") {
          Alpine.store('quiz').secondsChrono = 30;
        } else {
          Alpine.store('quiz').secondsChrono = 300;
        }
      }
      this.remainingTime = Alpine.store('quiz').secondsChrono;

      this.$watch("Alpine.store('quiz').operationType", () => {
        Alpine.store('quiz').saveQuizPreferences();
      });
      this.$watch("Alpine.store('quiz').secondsChrono", () => {
        Alpine.store('quiz').saveQuizPreferences();
      });
      this.$watch("Alpine.store('quiz').chronoMode", (newMode) => {
        if (newMode === "question") {
          Alpine.store('quiz').secondsChrono = 30;
        } else {
          Alpine.store('quiz').secondsChrono = 300;
        }
        Alpine.store('quiz').saveQuizPreferences();
        this.remainingTime = Alpine.store('quiz').secondsChrono;
      });
      this.$watch("Alpine.store('quiz').numOfQuestions", () => {
        Alpine.store('quiz').saveQuizPreferences();
      });
      this.$watch(
        "Alpine.store('quiz').selectedValues",
        () => {
          Alpine.store('quiz').saveQuizPreferences();
        },
        { deep: true },
      );
    },

    // Fonction de synthèse vocale
    speak(text) {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    },

    // Gestion de la sélection des tables
    toggleTable(num) {
      const index = Alpine.store('quiz').selectedValues.indexOf(num);
      if (index > -1) {
        Alpine.store('quiz').selectedValues.splice(index, 1);
      } else {
        Alpine.store('quiz').selectedValues.push(num);
      }
    },

    selectAllTables() {
      Alpine.store('quiz').selectedValues = [2, 3, 4, 5, 6, 7, 8, 9];
    },

    deselectAllTables() {
      Alpine.store('quiz').selectedValues = [];
    },

    // Défilement automatique vers le quiz
    scrollToQuiz(delay = 100, behavior = "smooth") {
      setTimeout(() => {
        const quizSection =
          this.$refs.quizSection ||
          document.querySelector('[x-ref="quizSection"]');

        if (quizSection && quizSection.offsetParent !== null) {
          const rect = quizSection.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = scrollTop + rect.top;

          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: behavior,
          });
        }
      }, delay);
    },

    // Focus sur le champ de réponse
    focusAnswerInput() {
      const inputElement =
        document.querySelector('input[inputmode="numeric"]') ||
        document.querySelector('input[type="text"]');
      if (inputElement) {
        inputElement.focus();

        if (window.visualViewport) {
          const handleKeyboardOpen = () => {
            setTimeout(() => {
              this.scrollToQuiz(0, "auto");
            }, 300);
          };
          window.visualViewport.addEventListener(
            "resize",
            handleKeyboardOpen,
            { once: true },
          );
        }
      }
    },

    startQuiz() {
      if (!this.audioCtx) {
        this.audioCtx = new (
          window.AudioContext || window.webkitAudioContext
        )();
      }
      this.audioCtx.resume();

      if (Alpine.store('quiz').selectedValues.length === 0) {
        alert("Veuillez sélectionner au moins une table");
        return;
      }

      Alpine.store('quiz').pairs = Alpine.store('quiz').generatePairs();
      Alpine.store('quiz').currentQuestionIndex = 0;
      Alpine.store('quiz').numCorrectAnswers = 0;
      Alpine.store('quiz').numIncorrectAnswers = 0;
      Alpine.store('quiz').currentPair = Alpine.store('quiz').pairs[0];

      this.isStarted = true;
      this.isFinished = false;
      this.timePerQuestion = [];
      this.questionStartTime = Date.now();
      this.userAnswer = "";
      this.isProcessing = false;
      this.showFeedback = false;
      this.isFeedbackModalVisible = false;

      Alpine.store('quiz').quizModeUsed = Alpine.store('quiz').chronoMode;
      const baseTime = Alpine.store('quiz').secondsChrono;

      if (Alpine.store('quiz').chronoMode === "quiz") {
        this.remainingTime = baseTime;
        Alpine.store('quiz').totalSecondsAllocated = baseTime;
      } else {
        this.remainingTime = baseTime;
        Alpine.store('quiz').totalSecondsAllocated =
          baseTime * Alpine.store('quiz').numOfQuestions;
      }

      // Utiliser $nextTick pour s'assurer que le template x-if est rendu AVANT de démarrer le timer
      this.$nextTick(() => {
        // 1. Démarrer le timer juste après l'affichage du template
        this.startTimer();

        // 2. Puis l'énoncé vocal
        if (
          Alpine.store('quiz').currentPair &&
          Alpine.store('quiz').currentPair.factors
        ) {
          this.speak(
            `${Alpine.store('quiz').currentPair.factors[0]} fois ${Alpine.store('quiz').currentPair.factors[1]}`,
          );
        }

        // 3. Focus l'input et scroll
        this.focusAnswerInput();
        this.scrollToQuiz(100);
      });
    },

    startTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      this.timerInterval = setInterval(() => {
        this.remainingTime--;

        // Bip à chaque seconde pour les 5 dernières secondes
        if (this.remainingTime <= 5 && this.remainingTime > 0) {
          this.playTickSound();
        }

        if (this.remainingTime <= 0) {
          clearInterval(this.timerInterval);
          if (this.userAnswer !== "") {
            this.submitAnswer();
          } else {
            Alpine.store('quiz').checkAnswer("");
            this.isLastAnswerCorrect = false;

            // Mise à jour des statistiques pour l'absence de réponse (échec)
            const timeUsed = (Date.now() - this.questionStartTime) / 1000;
            const [a, b] = Alpine.store('quiz').currentPair.factors;
            const op = Alpine.store('quiz').operationType;
            const pairKey = this.getPairKey(a, b, op);
            Alpine.store('quiz').updateStats(pairKey, false, timeUsed);

            this.feedbackType = "noAnswer";
            this.showFeedback = true;
            this.isFeedbackModalVisible = this.isMobileModal;

            if (
              Alpine.store('quiz').currentPair &&
              Alpine.store('quiz').currentPair.factors
            ) {
              const result = Alpine.store('quiz').getCorrectAnswer(
                Alpine.store('quiz').currentPair.factors[0],
                Alpine.store('quiz').currentPair.factors[1],
              );
              this.speak(`Temps écoulé, le résultat était ${result}`);
              // Son d'erreur après la voix
              setTimeout(() => {
                this.playErrorSound();
              }, 100);
            }

            setTimeout(() => {
              this.nextQuestion();
            }, 3000);
          }
        }
      }, 1000);
    },

    playAlertSound() {
      if (!this.audioCtx) {
        this.audioCtx = new (
          window.AudioContext || window.webkitAudioContext
        )();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioCtx.currentTime + 0.5,
      );
      oscillator.start();
      oscillator.stop(this.audioCtx.currentTime + 0.5);
    },

    playTickSound() {
      if (!this.audioCtx) {
        this.audioCtx = new (
          window.AudioContext || window.webkitAudioContext
        )();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      // Vibration courte
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }

      // Bip court
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioCtx.currentTime + 0.1,
      );
      oscillator.start();
      oscillator.stop(this.audioCtx.currentTime + 0.1);
    },

    playErrorSound() {
      if (!this.audioCtx) {
        this.audioCtx = new (
          window.AudioContext || window.webkitAudioContext
        )();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      // Double vibration pour l'erreur
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 100, 100]);
      }

      // Son d'erreur (deux bips descendants)
      const oscillator1 = this.audioCtx.createOscillator();
      const gainNode1 = this.audioCtx.createGain();
      oscillator1.connect(gainNode1);
      gainNode1.connect(this.audioCtx.destination);
      oscillator1.frequency.value = 400;
      gainNode1.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioCtx.currentTime + 0.15,
      );
      oscillator1.start();
      oscillator1.stop(this.audioCtx.currentTime + 0.15);

      const oscillator2 = this.audioCtx.createOscillator();
      const gainNode2 = this.audioCtx.createGain();
      oscillator2.connect(gainNode2);
      gainNode2.connect(this.audioCtx.destination);
      oscillator2.frequency.value = 300;
      gainNode2.gain.setValueAtTime(0.3, this.audioCtx.currentTime + 0.2);
      gainNode2.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioCtx.currentTime + 0.4,
      );
      oscillator2.start(this.audioCtx.currentTime + 0.2);
      oscillator2.stop(this.audioCtx.currentTime + 0.4);
    },

    nextQuestion() {
      if (Alpine.store('quiz').chronoMode === "question") {
        const timeUsedForThisQuestion =
          Alpine.store('quiz').secondsChrono - this.remainingTime;
        this.timePerQuestion.push(timeUsedForThisQuestion);
      }

      Alpine.store('quiz').currentQuestionIndex++;
      if (
        Alpine.store('quiz').currentQuestionIndex >=
        Alpine.store('quiz').numOfQuestions
      ) {
        clearInterval(this.timerInterval);
        this.finishQuiz();
      } else {
        Alpine.store('quiz').currentPair =
          Alpine.store('quiz').pairs[Alpine.store('quiz').currentQuestionIndex];
        this.userAnswer = "";
        this.showFeedback = false;
        this.isFeedbackModalVisible = false;
        if (Alpine.store('quiz').chronoMode === "question") {
          this.remainingTime = Alpine.store('quiz').secondsChrono;
        }
        this.isProcessing = false;
        this.questionStartTime = Date.now();

        this.$nextTick(() => {
          // 1. Démarrer le timer juste après l'affichage du nouveau template
          this.startTimer();

          // 2. Annonce la nouvelle question
          if (
            Alpine.store('quiz').currentPair &&
            Alpine.store('quiz').currentPair.factors
          ) {
            this.speak(
              `${Alpine.store('quiz').currentPair.factors[0]} fois ${Alpine.store('quiz').currentPair.factors[1]}`,
            );
          }

          // 3. Focus l'input et scroll
          this.focusAnswerInput();
          this.scrollToQuiz(50);
        });
      }
    },

    submitAnswer() {
      if (this.userAnswer === "" || this.isProcessing || this.isFinished)
        return;

      this.isProcessing = true;

      // 1ère action : arrêter le chrono immédiatement
      clearInterval(this.timerInterval);

      // 2ème action : vérifier la réponse
      this.isLastAnswerCorrect = Alpine.store('quiz').checkAnswer(
        this.userAnswer,
      );

      // Mise à jour des statistiques de maîtrise
      const timeUsed = (Date.now() - this.questionStartTime) / 1000;
      const [a, b] = Alpine.store('quiz').currentPair.factors;
      const op = Alpine.store('quiz').operationType;
      const pairKey = this.getPairKey(a, b, op);
      Alpine.store('quiz').updateStats(pairKey, this.isLastAnswerCorrect, timeUsed);

      this.feedbackType = this.isLastAnswerCorrect
        ? "correct"
        : "incorrect";
      this.showFeedback = true;
      this.isFeedbackModalVisible = this.isMobileModal;

      // 3ème action : afficher et annoncer le résultat
      if (
        Alpine.store('quiz').currentPair &&
        Alpine.store('quiz').currentPair.factors
      ) {
        const result = Alpine.store('quiz').getCorrectAnswer(
          Alpine.store('quiz').currentPair.factors[0],
          Alpine.store('quiz').currentPair.factors[1],
        );
        if (this.isLastAnswerCorrect) {
          this.speak(`Bravo, ${result}`);
        } else {
          this.speak(`Faux, ${result}`);
          setTimeout(() => {
            this.playErrorSound();
          }, 100);
        }
      }

      setTimeout(() => {
        this.nextQuestion();
      }, 3000);
    },

    finishQuiz() {
      if (this.isFinished) return;
      clearInterval(this.timerInterval);
      this.isFinished = true;
      this.speak(
        `Quiz terminé. Score final : ${Alpine.store('quiz').numCorrectAnswers} sur ${Alpine.store('quiz').numOfQuestions}`,
      );
      this.isFeedbackModalVisible = false; // Fermer la modal JS à la fin du quiz

      if (
        Alpine.store('quiz').shouldSaveResult &&
        Alpine.store('quiz').numCorrectAnswers +
          Alpine.store('quiz').numIncorrectAnswers >
          0
      ) {
        let timeUsed =
          Alpine.store('quiz').quizModeUsed === "quiz"
            ? Alpine.store('quiz').totalSecondsAllocated - this.remainingTime
            : this.timePerQuestion.reduce((sum, time) => sum + time, 0);

        const quizData = {
          pairs: Alpine.store('quiz').pairs.filter((p) => p.answer !== null),
          quizProperties: {
            operationType: Alpine.store('quiz').operationType,
            countdownMode: "all",
            secondsChrono: Alpine.store('quiz').secondsChrono,
            numOfQuestions: Alpine.store('quiz').numOfQuestions,
            chronoMode: Alpine.store('quiz').quizModeUsed,
            totalSecondsAllocated: Alpine.store('quiz').totalSecondsAllocated,
            timeUsed: timeUsed,
            date: new Date().toLocaleString(),
            id: Date.now(),
          },
        };
        Alpine.store('quiz').saveResultData(quizData);
      }
    },

    resetQuiz() {
      this.isStarted = false;
      this.isFinished = false;
      this.userAnswer = "";
      this.showFeedback = false;
      this.isFeedbackModalVisible = false;
      this.isProcessing = false;
      Alpine.store('quiz').currentQuestionIndex = 0;
    }
  }));

  // Composant pour l'Historique
  Alpine.data('historyComponent', () => ({
    openAccordions: [],
    chart: null,
    init() {
      Alpine.store('quiz').loadResults();
      this.$nextTick(() => {
        this.renderChart();
      });
    },
    renderChart() {
      const ctx = document.getElementById("progressionChart");
      if (!ctx || Alpine.store('quiz').quizResults.length === 0) return;

      const data = [...Alpine.store('quiz').quizResults];
      const labels = data.map((r) => r.quizProperties.date.split(" ")[0]);
      const scores = data.map((r) =>
        Math.round(
          (r.pairs.filter((p) => p.isCorrect).length / r.pairs.length) *
            100,
        ),
      );

      if (this.chart) this.chart.destroy();

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Score %",
              data: scores,
              borderColor: "#2563eb",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              fill: true,
              tension: 0.2,
              pointRadius: 3, // Points bien visibles
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: { top: 20, right: 20, left: 10, bottom: 10 },
          },
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 100,
              ticks: {
                stepSize: 25,
                callback: (value) => value + "%",
              },
            },
          },
          plugins: {
            legend: { display: false },
          },
        },
      });
    },
    toggleAccordion(index) {
      const idx = this.openAccordions.indexOf(index);
      if (idx > -1) {
        this.openAccordions.splice(idx, 1);
      } else {
        this.openAccordions.push(index);
      }
    },

    getTotalCorrect() {
      return Alpine.store('quiz').quizResults.reduce((sum, result) => {
        return sum + result.pairs.filter((p) => p.isCorrect).length;
      }, 0);
    },

    getTotalIncorrect() {
      return Alpine.store('quiz').quizResults.reduce((sum, result) => {
        return sum + result.pairs.filter((p) => !p.isCorrect).length;
      }, 0);
    },

    getGlobalScore() {
      const total = this.getTotalCorrect() + this.getTotalIncorrect();
      if (total === 0) return 0;
      return Math.round((this.getTotalCorrect() / total) * 100);
    },

    getScoreClass(result) {
      const score = Math.round(
        (result.pairs.filter((p) => p.isCorrect).length /
          result.pairs.length) *
          100,
      );
      if (score >= 80) return "text-green-600";
      if (score >= 60) return "text-yellow-600";
      return "text-red-600";
    },

    deleteResult(index) {
      Alpine.store('quiz').quizResults.splice(index, 1);
      localStorage.setItem(
        "quizResults",
        JSON.stringify(Alpine.store('quiz').quizResults),
      );
      this.openAccordions = [];
    },

    clearHistory() {
      Alpine.store('quiz').quizResults = [];
      localStorage.setItem("quizResults", JSON.stringify([]));
      this.openAccordions = [];
    }
  }));

  // Initialiser les stores
  Alpine.store('quiz').init();
});
