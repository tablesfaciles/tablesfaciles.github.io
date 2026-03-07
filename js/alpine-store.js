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
    {
      level: 1,
      name: "Mes premières tables : les gentilles (2, 5, 10)",
      currentLevelTables: [2, 5, 10],
      cumulativeTables: [2, 5, 10],
      description: "Bienvenue ! Commençons doucement avec les tables de 2, 5 et 10. Elles sont faciles et amusantes ! Concentre-toi bien pour les mémoriser.",
      links: { debutant: true, intermediaire: false, expert: false }
    },
    {
      level: 2,
      name: "Je deviens plus fort (2, 5, 10) !",
      currentLevelTables: [2, 5, 10],
      cumulativeTables: [2, 5, 10],
      description: "Super ! Tu commences à bien connaître ces tables. Entraîne-toi pour que tes réponses deviennent très rapides. La répétition est la clé !",
      links: { debutant: true, intermediaire: false, expert: false }
    },
    {
      level: 3,
      name: "Champion des bases (2, 5, 10) : Vitesse !",
      currentLevelTables: [2, 5, 10],
      cumulativeTables: [2, 5, 10],
      description: "Impressionnant ! Le but maintenant est d'être rapide comme l'éclair, sans faire d'erreurs. Sois le plus rapide pour devenir un vrai champion !",
      links: { debutant: true, intermediaire: false, expert: false }
    },
    {
      level: 4,
      name: "Les tables secrètes (3 et 4) et les anciennes amies",
      currentLevelTables: [3, 4],
      cumulativeTables: [2, 3, 4, 5, 10],
      description: "Nouveau défi ! Apprenons les tables de 3 et 4. Ne t'inquiète pas, nous allons aussi revoir un peu les tables faciles pour ne rien oublier.",
      links: { debutant: true, intermediaire: true, expert: false }
    },
    {
      level: 5,
      name: "Le magicien des nombres (3 et 4 + révisions)",
      currentLevelTables: [3, 4],
      cumulativeTables: [2, 3, 4, 5, 10],
      description: "Tu es un vrai magicien des nombres ! Tes tables de 3 et 4 s'améliorent, et les anciennes sont toujours là pour s'entraîner. Continue comme ça !",
      links: { debutant: true, intermediaire: true, expert: false }
    },
    {
      level: 6,
      name: "L'explorateur rapide (3, 4 et toutes les autres)",
      currentLevelTables: [3, 4],
      cumulativeTables: [2, 3, 4, 5, 10],
      description: "Prêt à explorer plus vite ? Montre-nous que tu maîtrises parfaitement les tables de 3 et 4, et que les bases sont toujours solides !",
      links: { debutant: true, intermediaire: true, expert: false }
    },
    {
      level: 7,
      name: "Les grands chiffres (6 et 7) : courage !",
      currentLevelTables: [6, 7],
      cumulativeTables: [2, 3, 4, 5, 6, 7, 10],
      description: "Attention, ça devient intéressant avec les tables de 6 et 7 ! Elles demandent un peu plus de concentration, mais tu es capable de les relever.",
      links: { debutant: false, intermediaire: true, expert: false }
    },
    {
      level: 8,
      name: "Les dernières (8 et 9) : la victoire approche !",
      currentLevelTables: [8, 9],
      cumulativeTables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      description: "C'est le dernier effort ! Les tables de 8 et 9 sont à portée de main. Avec de la pratique, elles deviendront aussi faciles que les autres.",
      links: { debutant: false, intermediaire: true, expert: true }
    },
    {
      level: 9,
      name: "Le défi ultime (toutes les difficiles) : Deviens un pro !",
      currentLevelTables: [6, 7, 8, 9],
      cumulativeTables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      description: "Félicitations ! Tu es presque un maître. Ce niveau est pour t'assurer que tu connais toutes les tables 'difficiles' sur le bout des doigts, très rapidement !",
      links: { debutant: false, intermediaire: true, expert: true }
    },
    {
      level: 10,
      name: "Le Grand Maître des multiplications !",
      currentLevelTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      cumulativeTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      description: "INCROYABLE ! Tu es maintenant le Grand Maître des multiplications ! Ce quiz est un test final pour prouver que tu es le meilleur. Bravo !",
      links: { debutant: true, intermediaire: true, expert: true }
    }
  ];

  // Paramètres évolutifs pour chaque niveau du parcours d'apprentissage
  const LEARNING_PATH_SETTINGS = [
    { numOfQuestions: 10, secondsChrono: 45, chronoMode: 'question', operationType: 'multiplication', revisionPercentage: 0 },
    { numOfQuestions: 12, secondsChrono: 40, chronoMode: 'question', operationType: 'multiplication', revisionPercentage: 0.10 },
    { numOfQuestions: 15, secondsChrono: 35, chronoMode: 'question', operationType: 'multiplication', revisionPercentage: 0.20 },
    { numOfQuestions: 12, secondsChrono: 40, chronoMode: 'question', operationType: 'multiplication', revisionPercentage: 0.30 },
    { numOfQuestions: 15, secondsChrono: 35, chronoMode: 'question', operationType: 'multiplication', revisionPercentage: 0.40 },
    { numOfQuestions: 18, secondsChrono: 30, chronoMode: 'question', operationType: 'multiplication', revisionPercentage: 0.50 },
    { numOfQuestions: 15, secondsChrono: 35, chronoMode: 'question', operationType: 'multiplication', revisionPercentage: 0.40 },
    { numOfQuestions: 20, secondsChrono: 30, chronoMode: 'question', operationType: 'multiplication', revisionPercentage: 0.50 },
    { numOfQuestions: 25, secondsChrono: 25, chronoMode: 'question', operationType: 'multiplication', revisionPercentage: 0.60 },
    { numOfQuestions: 20, secondsChrono: 20, chronoMode: 'question', operationType: 'multiplication', revisionPercentage: 0.70 }
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

    // Astuces
    tableTips: {
      1: "La table de 1, c'est facile ! Chaque nombre reste lui-même. C'est comme un miroir magique !",
      2: "Multiplier par 2, c'est faire le DOUBLE ! Imagine deux fois la même chose. 🍎+🍎 = 2🍎",
      3: "La table de 3 a un petit secret : si tu comptes 3 par 3, tu verras les résultats ! 3, 6, 9...",
      4: "Pour la table de 4, tu peux faire 'le double du double' ! C'est super rapide ! 😎",
      5: "La table de 5 est géniale : tous les résultats finissent par 0 ou 5. Regarde bien ! 🖐️",
      6: "Les résultats de la table de 6 finissent souvent par le même chiffre que le nombre que tu multiplies, si ce nombre est pair (ex: 6x2=12, 6x4=24) !",
      7: "La table de 7 est un petit défi ! Entraîne-toi souvent sur 7x6=42, 7x7=49 et 7x8=56. Tu es un champion !",
      8: "Pour la table de 8, tu peux faire 'le double, puis encore le double, puis encore le double' ! 🌟",
      9: "La table de 9 est magique ! Si tu multiplies 9 par un nombre, puis tu additionnes les chiffres du résultat, tu trouveras toujours 9 ! (ex: 9x2=18, 1+8=9)",
      10: "La table de 10 est la plus simple : il suffit d'ajouter un ZÉRO à la fin du nombre. Un tour de passe-passe ! 🪄"
    },

    // Initialisation
    init() {
      this.loadResults();
      this.loadQuizPreferences();
      this.initPythagoreValues();
      this.loadMasteryData();
      this.loadLevel();

      // Après avoir chargé toutes les données pertinentes, réévaluer la progression au niveau supérieur
      // Utiliser un grade par défaut si latestGrade n'est pas encore défini (par exemple, au tout premier chargement)
      const gradeForReevaluation = this.latestGrade || 'C'; // Utilisez 'C' comme grade par défaut si non trouvé
      this.checkLevelProgression(gradeForReevaluation, true);
    },

    loadLevel() {
      const stored = localStorage.getItem('quiz_current_level');
      this.currentLevel = stored ? parseInt(stored, 10) : 0;
    },

    getLevelTables() {
      return LEARNING_PATH[this.currentLevel]?.cumulativeTables || [];
    },

    getCurrentLevelFocusTables() {
      return LEARNING_PATH[this.currentLevel]?.currentLevelTables || [];
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

    updateStats(pair, isCorrect, time) {
      const pairKey = `${pair.factors[0]}x${pair.factors[1]}`;
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
          this.proposedNextLevel = typeof prefs.proposedNextLevel !== 'undefined' ? prefs.proposedNextLevel : false; // Charge l'état
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
        selectedValues: this.selectedValues,
        proposedNextLevel: this.proposedNextLevel
      };
      localStorage.setItem('quizPreferences', JSON.stringify(prefs));
    },

    saveResultData(quizData) {
      if (this.shouldSaveResult) {
        if (this.modeApprentissage) {
          quizData.quizProperties.level = this.currentLevel;
        }
        if (!this.quizResults) {
          this.quizResults = [];
        }
        this.quizResults.push(quizData);
        localStorage.setItem('quizResults', JSON.stringify(this.quizResults));
      }
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
      const currentLevelIndex = this.currentLevel;
      const levelSettings = LEARNING_PATH_SETTINGS[currentLevelIndex];
      const numToSelect = this.numOfQuestions;

      // 1. Déterminer les tables focales du niveau actuel
      const focusTables = this.getCurrentLevelFocusTables();
      let focusPairsPool = [];
      for (let t of focusTables) {
        for (let i = 1; i <= 10; i++) {
          focusPairsPool.push([t, i]);
        }
      }

      // 2. Déterminer les tables de révision
      const allPreviouslyLearnedTables = new Set();
      for (let i = 0; i < currentLevelIndex; i++) {
        LEARNING_PATH[i].currentLevelTables.forEach(table => allPreviouslyLearnedTables.add(table));
      }
      focusTables.forEach(table => allPreviouslyLearnedTables.delete(table));

      let revisionPairsPool = [];
      for (let t of Array.from(allPreviouslyLearnedTables)) {
        for (let i = 1; i <= 10; i++) {
          revisionPairsPool.push([t, i]);
        }
      }
      revisionPairsPool = revisionPairsPool.filter(p => !focusTables.includes(p[0]));

      // 3. Calculer le nombre de questions pour chaque catégorie
      const numRevisionQuestions = Math.round(numToSelect * levelSettings.revisionPercentage);
      const numFocusQuestions = numToSelect - numRevisionQuestions;

      const selectWeightedPairs = (pool, count) => {
        const result = [];
        let availablePool = [...pool];
        if (availablePool.length === 0) return [];
        if (availablePool.length < count) {
            for (let i = 0; i < count; i++) {
                result.push(availablePool[Math.floor(Math.random() * availablePool.length)]);
            }
            return result;
        }

        while (result.length < count && availablePool.length > 0) {
          let totalWeight = 0;
          const weightedOptions = availablePool.map(p => {
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
          let selectedPair = null;
          for (let entry of weightedOptions) {
            cumulativeWeight += entry.weight;
            if (r <= cumulativeWeight) {
              selectedPair = entry.pair;
              break;
            }
          }
          if (selectedPair) {
            result.push(selectedPair);
            availablePool = availablePool.filter(p => p !== selectedPair);
          } else {
            result.push(availablePool[Math.floor(Math.random() * availablePool.length)]);
            availablePool.splice(Math.floor(Math.random() * availablePool.length), 1);
          }
        }
        return result;
      };

      let focusQ = selectWeightedPairs(focusPairsPool, numFocusQuestions);
      let revisionQ = selectWeightedPairs(revisionPairsPool, numRevisionQuestions);
      let selectedQuestions = this.shuffle([...focusQ, ...revisionQ]);

      while (selectedQuestions.length < numToSelect) {
          const allPossibleFallback = [...focusPairsPool, ...revisionPairsPool];
          if (allPossibleFallback.length === 0) break;
          selectedQuestions.push(allPossibleFallback[Math.floor(Math.random() * allPossibleFallback.length)]);
      }
      return selectedQuestions.slice(0, numToSelect);
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
      let worstAvgTime = 0;
      let pairsToConsider = [];

      if (this.modeApprentissage) {
        const currentTables = this.getLevelTables();
        for (let table of currentTables) {
          for (let i = 1; i <= 10; i++) {
            pairsToConsider.push([table, i]);
          }
        }
      } else {
        pairsToConsider = this.pairs.map(p => p.factors);
      }

      for (let pair of pairsToConsider) {
        const key = `${pair[0]}x${pair[1]}`;
        const stats = this.masteryData[key];
        if (stats && (stats.success > 0 || stats.failure > 0)) {
          const ratio = stats.failure / (stats.success + stats.failure);
          if (ratio > maxFailRatio) {
            maxFailRatio = ratio;
            worst = pair;
            worstAvgTime = stats.avgTime;
          } else if (ratio === maxFailRatio && stats.avgTime > worstAvgTime) {
            worst = pair;
            worstAvgTime = stats.avgTime;
          }
        }
      }
      return worst;
    },

    checkLevelProgression(grade, isInit = false) {
      if (this.modeApprentissage && (grade === 'A' || grade === 'A+')) {
        if (this.currentLevel < LEARNING_PATH.length - 1) {
          this.proposedNextLevel = true;
        } else {
          this.proposedNextLevel = false;
          console.log("Tous les niveaux d'apprentissage terminés !");
        }
      } else if (!isInit) {
        // IMPORTANT : Si le quiz ne propose pas de passer au niveau supérieur, s'assurer que le flag est à false
        // Mais ne pas réinitialiser si on est en phase d'initialisation du store (persistance)
        this.proposedNextLevel = false;
      }
      // Sauvegarder l'état mis à jour
      this.saveQuizPreferences();
    },

    acceptLevelUp() {
      this.currentLevel++;
      localStorage.setItem('quiz_current_level', this.currentLevel);
      this.proposedNextLevel = false;
      this.saveQuizPreferences();
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
        alert("Félicitations ! Vous avez terminé tous les niveaux d'apprentissage. Continuez à pratiquer en mode libre !");
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
      this.isProcessing = false;
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
        if (this.$refs.answerInput) this.$refs.answerInput.focus();
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
            Alpine.store('quiz').updateStats(pair, false, Date.now() - this.questionStartTime);
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
      Alpine.store('quiz').updateStats(pair, this.isLastAnswerCorrect, respTime);
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
          if (this.$refs.answerInput) this.$refs.answerInput.focus();
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
      this.isProcessing = false;
      if (Alpine.store('quiz').modeApprentissage) {
        this.selectedStartMode = 'learning';
        Alpine.store('quiz').modeApprentissage = false;
      } else {
        this.selectedStartMode = 'free';
      }
    },

    acceptLevelUp() {
      Alpine.store('quiz').acceptLevelUp();
      this.isStarted = false;
      this.isFinished = false;
      this.isProcessing = false;
      this.selectedStartMode = 'learning';
    }
  }));

  Alpine.data('historyComponent', () => ({
    openAccordions: [],
    chart: null,
    activeTab: 'parcours',

    init() {
      Alpine.store('quiz').loadResults();
      this.$nextTick(() => this.renderChart());
    },

    setTab(tabName) {
      this.activeTab = tabName;
      this.openAccordions = [];
      this.$nextTick(() => this.renderChart());
    },

    get filteredAndSortedResults() {
      let results = [...Alpine.store('quiz').quizResults];

      if (this.activeTab === 'parcours') {
        results = results.filter(r => r.quizProperties.modeApprentissage === true);
      } else if (this.activeTab === 'libre') {
        results = results.filter(r => r.quizProperties.modeApprentissage === false);
      }

      return results.sort((a, b) => {
        // Parse "DD/MM/YYYY, HH:MM:SS" to a sortable format
        const parseDate = (dateStr) => {
          const [date, time] = dateStr.split(', ');
          const [day, month, year] = date.split('/');
          return new Date(`${year}-${month}-${day}T${time || '00:00:00'}`);
        };
        return parseDate(b.quizProperties.date) - parseDate(a.quizProperties.date);
      });
    },

    renderChart() {
      const ctx = document.getElementById("progressionChart");
      const resultsToChart = [...this.filteredAndSortedResults].reverse();

      if (!ctx || resultsToChart.length === 0) {
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }
        return;
      }

      if (this.chart) this.chart.destroy();
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: resultsToChart.map(r => r.quizProperties.date.split(" ")[0]),
          datasets: [{
            label: "Score %",
            data: resultsToChart.map(r => Math.round((r.pairs.filter(p => p.isCorrect).length / r.pairs.length) * 100)),
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

    getTotalCorrect() { return this.filteredAndSortedResults.reduce((sum, r) => sum + r.pairs.filter(p => p.isCorrect).length, 0); },
    getTotalIncorrect() { return this.filteredAndSortedResults.reduce((sum, r) => sum + r.pairs.filter(p => !p.isCorrect).length, 0); },
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
      const originalIndex = Alpine.store('quiz').quizResults.findIndex(
        r => r.quizProperties.id === this.filteredAndSortedResults[index].quizProperties.id
      );

      if (originalIndex > -1) {
        Alpine.store('quiz').quizResults.splice(originalIndex, 1);
        localStorage.setItem("quizResults", JSON.stringify(Alpine.store('quiz').quizResults));
        this.openAccordions = [];
        this.$nextTick(() => this.renderChart());
      }
    },

    clearHistory() {
      Alpine.store('quiz').quizResults = [];
      localStorage.setItem("quizResults", JSON.stringify([]));
      this.openAccordions = [];
      this.$nextTick(() => this.renderChart());
    }
  }));

  Alpine.store('quiz').init();
});
