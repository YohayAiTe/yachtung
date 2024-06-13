class Game {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLDivElement} overlay 
     * @param {Scoreboard} scoreboard
     */
    constructor(ctx, overlay, scoreboard) {
        this.ctx = ctx
        this.overlay = overlay
        this.scoreboard = scoreboard
        this.powerupManager = new PowerupManager(this, this.#powerupFunction)

        const cfgPlayers = CONFIG.UI.players

        /** @type {Player[]} */
        this.players = []
        for (const [idx, controls] of cfgPlayers.defaultControls.entries()) {
            const display = cfgPlayers.display[idx]
            const player = new Player(display.name, display.pattern, display.invertedPattern)
            player.leftKey = controls.left
            player.rightKey = controls.right
            this.players.push(player)
        }

        /** @type {Obstacle[]} */
        this.obstacles = []

        /** @type {State} */
        this.state = null
        this.setState(StartScreen)

        /** @type {number} */
        this.borderInactiveTicks = 0
    }

    /**
     * 
     * @param {number} t 
     */
    #powerupFunction(t) {
        const cfgFuncParams = CONFIG.powerups.generation.funcParams
        const baseValue = (Math.cos(2*Math.PI*(t/cfgFuncParams.period + cfgFuncParams.phase))+1)/2
        return baseValue * (cfgFuncParams.maxExpectedTime-cfgFuncParams.minExpectedTime) + cfgFuncParams.minExpectedTime
    }

    /**
     * 
     * @param {(game: Game) => State} newState 
     */
    setState(newState) {
        this.state = new newState(this)
    }

    /**
     * @param {KeyboardEvent} event 
     */
    keyHandler(event) {
        this.state.keyHandler(event)
    }

    /**
     * @param {KeyboardEvent} event 
     * @returns {Boolean}
     */
    isContinueKeyEvent(event) {
        return CONFIG.UI.controls.continueGameKeys.includes(event.code) && event.type === "keyup"
    }

    /**
     * @param {MouseEvent} event 
     */
    mouseHandler(event) {
        if (event.repeat) return
        const transform = this.ctx.getTransform()
        this.state.mouseHandler(event, event.pageX/transform.a, event.pageY/transform.d)
    }

    resizeHandler() { this.state.render(this) }

    render() {
        this.ctx.clearRect(0, 0, 1, 1)
        this.state.render()
    }

    renderBorder() {
        const w = CONFIG.gameplay.borderWidth
        const cfgBorderIndicator = CONFIG.powerups.effects.border.indicator

        if (this.borderInactiveTicks === 0) {
            this.ctx.fillStyle = cfgBorderIndicator.colour
            this.ctx.fillRect(0, 0, 1, w)
            this.ctx.fillRect(0, 1-w, 1, w)
            this.ctx.fillRect(0, w, w, 1-2*w)
            this.ctx.fillRect(1-w, w, w, 1-2*w)
            return
        }

        const prevOpacity = this.ctx.globalAlpha
        this.ctx.globalAlpha = (1+Math.cos(2*Math.PI*this.borderInactiveTicks/cfgBorderIndicator.inactiveFlashPeriod)) / 2

        const endInactiveIndicatorTicks = Math.min(cfgBorderIndicator.endInactiveIndicatorStart, this.borderInactiveTicks)
        const f = endInactiveIndicatorTicks / cfgBorderIndicator.endInactiveIndicatorStart

        this.ctx.fillStyle = cfgBorderIndicator.colour
        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        this.ctx.lineTo(1, 0)
        this.ctx.lineTo(1, 1)
        this.ctx.lineTo(0, 1)
        this.ctx.moveTo(w*(1-f), w*(1-f))
        this.ctx.lineTo(w*(1-f), 1 - w*(1-f))
        this.ctx.lineTo(1 - w*(1-f), 1 - w*(1-f))
        this.ctx.lineTo(1 - w*(1-f), w*(1-f))
        this.ctx.fill()

        this.ctx.fillStyle = cfgBorderIndicator.inactiveColour
        this.ctx.beginPath()
        this.ctx.moveTo(w*(1-f), w*(1-f))
        this.ctx.lineTo(1 - w*(1-f), w*(1-f))
        this.ctx.lineTo(1 - w*(1-f), 1 - w*(1-f))
        this.ctx.lineTo(w*(1-f), 1 - w*(1-f))
        this.ctx.moveTo(w, w)
        this.ctx.lineTo(w, 1 - w)
        this.ctx.lineTo(1 - w, 1 - w)
        this.ctx.lineTo(1 - w, w)
        this.ctx.fill()
        
        this.ctx.globalAlpha = prevOpacity
    }

    renderPlayers() {
        for (const player of this.players) player.render(this.ctx)
    }

    renderObstacles() {
        for (const obstacle of this.obstacles) obstacle.render(this.ctx)
    }

    /**
     * 
     * @param {Player} player 
     */
    updatePlayer(player) {
        player.move()
        const obstacle = player.updateObstacle()
        if (obstacle) this.obstacles.push(obstacle)
    }

    /**
     * 
     * @param {Player} player 
     */
    recreatePlayerObstacle(player) {
        const obstacle = player.recreateObstacle()
        if (obstacle) this.obstacles.push(obstacle)
    }
}
