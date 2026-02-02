export class CountdownTimer {
    constructor(duration, onTick, onComplete, className) {
        Object.assign(this, {
            duration,
            onTick,
            onComplete,
            intervalId: null,
            isCompleted: false,
            remainingDuration: duration,
            className,
            element: document.querySelector(`.${className}`)
        });
    }
    start = () => {
        this.isCompleted = false;
        this.tick();
        this.intervalId = setInterval(this.tick, 1000);
    
        if (this.className && this.element) {
            this.resetAnimation();
        }
    }
    stop = () => {
        clearInterval(this.intervalId);
        this.remainingDuration = this.duration;

        if (this.element) {
            this.element.style.animation = "none";
        }
    }
    tick = () => {
        if (this.remainingDuration <= 0) {
            this.stop();
            if (!this.isCompleted && typeof this.onComplete === 'function') {
                this.isCompleted = true;
                this.onComplete();
            }
        } else {
            this.remainingDuration--;
            if (this.onTick) {
                this.onTick(this.remainingDuration);
            }
        }
    }
    resetAnimation = () => {
        const duration = this.duration + 2;

        this.element.style.animation = "none";
        this.element.style.animationDuration = `${duration}s`;

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                this.element.style.animation = `circle ${duration}s forwards`;
            });
        });
    }
}
