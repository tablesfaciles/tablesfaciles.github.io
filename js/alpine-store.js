// Alpine.js Global Store for Multiplication App
document.addEventListener('alpine:init', () => {
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

    // Table de Pythagore
    pythagoreValues: {},
    highlightMode: null,

    // Initialiser les résultats depuis localStorage
    init() {
      this.loadResults();
      this.loadQuizPreferences();
      this.initPythagoreValues();
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

  // Initialiser les stores
  Alpine.store('quiz').init();
});