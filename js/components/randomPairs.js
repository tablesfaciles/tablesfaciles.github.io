export class RandomPairs {
    constructor(numOfQuestions, selectedValues, operationType) {
        this.allPairs = [];
        this.allPairsPossible = [];
        this.pairs = [];
        this.operationType = operationType;
        for (let i = 2; i <= 9; i++) {
            for (let j = 2; j <= 9; j++) {
                if (operationType === "soustraction" && j < i) {
                    // pour la soustraction, on vérifie que le premier nombre est plus grand que le deuxième
                    continue;
                } else if (operationType === "division" && (j * i) % i !== 0) {
                    // pour la division, on vérifie que le résultat est un nombre entier
                    continue;
                } else if (operationType === "division" && j < i) {
                    // pour la division, on vérifie que le dividende est supérieur ou égal au diviseur
                    continue;
                } else {
                    this.allPairsPossible.push([i, j]);
                }
            }
        }
        if (selectedValues.length > 0) {
            this.allPairsPossible = this.allPairsPossible.filter(pair => selectedValues.includes(pair[0]));
        }
        this.createPairs(numOfQuestions);
    }

    createPairs(numOfQuestions) {
        for (let i = 0; i < numOfQuestions; i++) {
            if (this.allPairs.length === 0) {
                this.allPairs = this.allPairsPossible.slice();
            }
            const index = Math.floor(Math.random() * this.allPairs.length);
            const pair = this.allPairs[index];
            this.allPairs.splice(index, 1);
            this.pairs.push(pair);
        }
    }
}
