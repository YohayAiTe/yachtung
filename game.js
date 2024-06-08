class Game {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Scoreboard} scoreboard
     */
    constructor(ctx, scoreboard) {
        this.ctx = ctx
        this.scoreboard = scoreboard
        this.powerupManager = new PowerupManager(this, this.#powerupFunction)

        /** @type {Player[]} */
        this.players = []
        for (let i = 0; i < Config.defaultPlayers.keys.length; i++) {
            const settings = Config.defaultPlayers.settings[i];
            const keys = Config.defaultPlayers.keys[i];
            const player = new Player(settings.name, settings.pattern, settings.invertedPattern)
            player.leftKey = keys.left
            player.rightKey = keys.right
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
        const funcConfig = Config.gameplay.powerups.function
        const baseValue = (Math.cos(2*Math.PI*(t/funcConfig.period + funcConfig.phase))+1)/2
        return baseValue * (funcConfig.maxExpectedTime-funcConfig.minExpectedTime) + funcConfig.minExpectedTime
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
        const borderConfig = Config.gameplay.border
        const w = borderConfig.width

        if (this.borderInactiveTicks === 0) {
            this.ctx.fillStyle = borderConfig.colour
            this.ctx.fillRect(0, 0, 1, w)
            this.ctx.fillRect(0, 1-w, 1, w)
            this.ctx.fillRect(0, w, w, 1-2*w)
            this.ctx.fillRect(1-w, w, w, 1-2*w)
            return
        }
        const prevOpacity = this.ctx.globalAlpha
        this.ctx.globalAlpha = (1+Math.cos(2*Math.PI*this.borderInactiveTicks/Config.gameplay.border.inactiveFlashPeriod)) / 2

        const endInactiveIndicatorTicks = Math.min(borderConfig.endInactiveIndicatorStart, this.borderInactiveTicks)
        const f = endInactiveIndicatorTicks / borderConfig.endInactiveIndicatorStart

        this.ctx.fillStyle = borderConfig.colour
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

        this.ctx.fillStyle = borderConfig.inactiveColour
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
}
