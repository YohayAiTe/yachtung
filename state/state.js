class State {
    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        this.game = game
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
