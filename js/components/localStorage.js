export class QuizLocalStorage {
    static saveResult(result) {
      if (localStorage.getItem('exoTabs')) {
        localStorage.removeItem('exoTabs');
      }
      const results = JSON.parse(localStorage.getItem('quizResults')) || [];
      results.push(result);
      localStorage.setItem('quizResults', JSON.stringify(results));
    }
  }