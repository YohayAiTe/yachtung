class State {
    /**
     * 
     * @param {Game} game 
     * @param {string} overlayClassSuffix
     */
    constructor(game, overlayClassSuffix) {
        this.game = game
        this.game.overlay.innerHTML = ""
        this.game.overlay.className = "state-"+overlayClassSuffix
    }

    get ctx() {
        return this.game.ctx
    }

    /**
     * @typedef {(event: KeyboardEvent) => void} KeyHandler
     * @type {KeyHandler}
     */
    keyHandler() { console.error("calling keyHandler without override") }

    /**
     * @typedef {(event: MouseEvent, x: number, y: number) => void} MouseHandler
     * @type {MouseHandler}
     */
    mouseHandler() { console.error("calling mouseHandler without override") }

    /**
     * 
     */
    render() { console.error("calling render without override") }
}
