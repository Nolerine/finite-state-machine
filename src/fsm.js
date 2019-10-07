class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config === undefined) throw new Error;
        this.stateConfig = config.states;
        this.stateInitial = config.initial;
        this.stateHistory = [];
        this.undoHistory = [];
        this.currentState = this.stateInitial;
        this.stateHistory.push(this.stateInitial);
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.stateConfig[state] == null) throw new Error;
        this.stateHistory.push(state);
        this.currentState = state;
        this.undoHistory = [];
        return this;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let availableTransitions = this.stateConfig[this.currentState].transitions;
        if (availableTransitions.hasOwnProperty(event)) {
            this.changeState(availableTransitions[event]);
            this.undoHistory = [];
        } else {
            throw new Error;
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.stateHistory.push(this.stateInitial);
        this.currentState = this.stateInitial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let arr = [];
        if (!event) {
            for (let state in this.stateConfig) {
                arr.push(state.toString());
            }
        } else {
            for (let state in this.stateConfig) {
                if (this.stateConfig[state].transitions[event]) {
                    arr.push(state.toString());
                }
            }
        }
        return arr;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.stateHistory.length <= 1) {
            return false;
        } else {
            this.undoHistory.push(this.currentState);
            this.currentState = this.stateHistory[this.stateHistory.length-2];
            this.stateHistory.pop();
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.undoHistory.length < 1) {
            return false;
        } else {
            this.currentState = this.undoHistory.pop();
            this.stateHistory.push(this.currentState);
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.stateHistory = [];
        this.stateHistory.push(this.currentState);
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
