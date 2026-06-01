// progressBar.js
export function updateProgressBar(successBar, dangerBar, numCorrectAnswers, numIncorrectAnswers) {
    const numAnswers = numCorrectAnswers + numIncorrectAnswers;
  
    const percentCorrect = Math.round(numCorrectAnswers / numAnswers * 100);
    const percentIncorrect = Math.round(numIncorrectAnswers / numAnswers * 100);
  
    successBar.style.width = percentCorrect + '%';
    successBar.setAttribute('aria-valuenow', percentCorrect);
    successBar.textContent = `${percentCorrect}% (${numCorrectAnswers})`;
  
    dangerBar.style.width = percentIncorrect + '%';
    dangerBar.setAttribute('aria-valuenow', percentIncorrect);
    dangerBar.textContent = `${percentIncorrect}% (${numIncorrectAnswers})`;
  }
  export function updateProgressBarPairs(nbRepondu, nbTotal) {
    const progressBar = document.querySelector('.pb-count-pairs');
    const pourcentage = Math.floor((nbRepondu / nbTotal) * 100);
    progressBar.style.width = `${pourcentage}%`;
    progressBar.setAttribute('aria-valuenow', pourcentage);
    progressBar.textContent = `${nbRepondu} / ${nbTotal}`;
  }
  