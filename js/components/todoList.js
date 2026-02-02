import { cloneTemplate, createElement } from "../functions/dom.js";
import { updateProgressBar } from './progressBar.js';
import { getOperatorSymbols, getTextSymbols } from './operatorSymbols.js';
/**
 * @typedef{object} todo
 * @property{number} id
 * @property{string} title
 * @property{boolean} completed
 */
export class TodoList {
    /** @type{todo[]} */
    #todos = []
    /** @type{HTMLULElement */
    #listElement = []
    #element
    /**
     * 
     * @param {todo[]} todos 
     */
    constructor(todos) {
        this.#todos = todos
    }
    /**
     * @param {HTMLElement} element 
     */
    appendTo(element) {
        /*<!-- Bouton pour ouvrir la modal -->
        <button id="btnSupprimerSauvegardes" class="btn btn-danger" data-toggle="modal"
            data-target="#modalSuppression">Supprimer les sauvegardes</button>*/
        this.#element = element;
        const fullList = true;
        const btnConfirmDelete = createElement('button', {
            id: 'btnSupprimerSauvegardes',
            class: 'btn btn-danger',
            'data-toggle': 'modal',
            'data-target': '#modalSuppression',
        });
        btnConfirmDelete.textContent = "Supprimer les sauvegardes"
        element.append(
            cloneTemplate('todolist-accordion')
        );
        this.#listElement = element.querySelector('.list-group');
        if (this.#todos.length === 0) {
            this.noTodolistElement();
        } else {
            for (let todo of this.#todos) {
                const t = new todoListItem(todo, fullList);
                this.#listElement.append(t.result.element);
                this.#element.append(btnConfirmDelete);
            }
        }
        btnConfirmDelete.addEventListener('click', () => {
            localStorage.removeItem('quizResults');
            this.#listElement.remove();
            btnConfirmDelete.remove();
            this.noTodolistElement();
        });
        this.#listElement.addEventListener('delete', ({ detail: todo }) => {
            this.#todos = this.#todos.filter(t => t !== todo);
            this.#onUpdate();
        })
    }
    #onUpdate() {
        localStorage.setItem('quizResults', JSON.stringify(this.#todos));
        this.#ifVide();
    }
    noTodolistElement(){
        this.#element.append(
            cloneTemplate('no-todolist')
        );
    }
    #ifVide() {
        if (this.#todos.length === 0) {
            const btnConfirmDelete = this.#element.querySelector('#btnSupprimerSauvegardes');
            this.noTodolistElement();
            btnConfirmDelete.remove();
        }
    }
}
export class todoListItem {
    /**
     * @param {todo} todo 
     */
    #element
    #todo
    constructor(todo, fullList) {
        this.#todo = todo;
        const pairs = todo.pairs;
        const quizProperties = todo.quizProperties;
        const { operatorSymbolString, operatorSymbol } = getOperatorSymbols(quizProperties.operationType);
        this.operatorSymbolString = operatorSymbolString;
        this.operatorSymbol = operatorSymbol;

        this.numCorrectAnswers = 0;
        this.numIncorrectAnswers = 0;
        const card = cloneTemplate('todolist-layout').firstElementChild;
        const cardBody = card.querySelector('.card-body');
        this.#element = card
        const chronoSpan = cardBody.querySelector(".chrono");
        const modeSpan = cardBody.querySelector(".mode")
        const fullModeElement = cardBody.querySelector(".full-quiz-ok");
        const listGroupResult = cardBody.querySelector(".list-group-result");
        this.hasAnswerProp = pairs.some(result => 'answer' in result);
        // afficher les résultats
        if (this.hasAnswerProp) {
            for (let pair of pairs) {
                const t = this.listeItem(pair);
                listGroupResult.append(t);
            }
            //met à jour la progressbar
            const successBar = this.#element.querySelector(".pb-result.bg-success");
            const dangerBar = this.#element.querySelector(".pb-result.bg-danger");
            updateProgressBar(successBar, dangerBar, this.numCorrectAnswers, this.numIncorrectAnswers);
            if (fullList) {
                const cardHearder = cloneTemplate('card-header');
                const button = cardHearder.querySelector('button');
                const calpase = this.#element.querySelector('.collapse');
                if (quizProperties.date && quizProperties.id) {
                    const exerciceType = button.querySelector(".exercice-type");
                    exerciceType.textContent = getTextSymbols(quizProperties.operationType);
                    const exerciceDate = button.querySelector(".exercice-date");
                    exerciceDate.textContent = `du ${quizProperties.date}`
                    calpase.setAttribute('id', `exo-${quizProperties.id}`);
                    button.setAttribute('data-target', `#exo-${quizProperties.id}`);
                }
                const cardHearderClass = cardHearder.querySelector('.card-header');
                if(quizProperties.countdownMode === "all"){
                    if (this.numCorrectAnswers + this.numIncorrectAnswers === quizProperties.numOfQuestions) {
                        cardHearderClass.classList.add('bg-success');
                    } else {
                        cardHearderClass.classList.add('bg-danger');
                    }
                } else {
                    if (this.numCorrectAnswers >= this.numIncorrectAnswers) {
                        cardHearderClass.classList.add('bg-success');
                    } else {
                        cardHearderClass.classList.add('bg-danger');
                    }
                }
               
                const suprrim = createElement('button', {
                    class: 'todo list-group-item list-group-item-action list-group-item-primary'
                });
                suprrim.innerText = `Supprimer`;
                cardBody.append(suprrim);
                suprrim.addEventListener('click', e => this.remove(e));
                card.prepend(cardHearder);
            }
        } else {
            this.#element.querySelector(".progress").classList.add('d-none');
            this.#element.append(
                cloneTemplate("no-todoitem")
            );
        }
        // met à jour les span
        chronoSpan.textContent = quizProperties.secondsChrono;
        if (quizProperties.countdownMode === 'single') {
            modeSpan.textContent = "Une question";
        } else {
            modeSpan.textContent = "Toutes les questions";
            fullModeElement.classList.remove("d-none");
            if (this.numCorrectAnswers + this.numIncorrectAnswers === quizProperties.numOfQuestions) {
                fullModeElement.classList.add("list-group-item-success")
            } else {
                fullModeElement.classList.add("list-group-item-danger")
            }
            fullModeElement.textContent = `Question répondu : ${this.numCorrectAnswers + this.numIncorrectAnswers} / ${quizProperties.numOfQuestions}`
        }
    }
    listeItem(pair) {
        const [a, b] = pair.factors;
        const result = eval(`${a} ${this.operatorSymbol} ${b}`);

        let li;
        if (result === pair.answer) {
            this.numCorrectAnswers++;
            li = cloneTemplate("todolist-li-true");
            li.querySelector(".result").textContent = `${a} ${this.operatorSymbolString} ${b} = ${result}`;
        } else {
            this.numIncorrectAnswers++;
            li = cloneTemplate("todolist-li-false");
            li.querySelector(".fw-bold").textContent = `${a} ${this.operatorSymbolString} ${b} = ${result}`;
            li.querySelector(".answer-result").textContent = pair.answer;
        }
        return li;
    }
    /**
     * @return {HTMLElement} element 
     */
    get result() {
        return {
            element: this.#element,
            hasAnswerProp: this.hasAnswerProp
        };
    }
    /**
     * @param {PointEvent} e
     */
    remove(e) {
        e.preventDefault();
        const event = new CustomEvent('delete', {
            detail: this.#todo,
            bubbles: true,
            cancelable: true
        });
        this.#element.dispatchEvent(event);
        this.#element.remove();
    }

}