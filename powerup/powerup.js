class Powerup {
    /** @type {Game} */
    game
    /** @type {Player} */
    player

    /**
     * 
     * @param {Game} game
     * @param {Player} player
     */
    constructor(game, player) {
        this.game = game
        this.player = player
    }

    endEffect() {
        console.error("calling endEffect without override")
    }

    static get width() { return Config.gameplay.powerups.width }

    static get duration() { return 0 }

    static get baseColor() { return "blue"}

    /**
     * @typedef {(ctx: CanvasRenderingContext2D, x: number, y: number) => void} PowerupRenderFunc
     * @type {PowerupRenderFunc}
     */
    static render(ctx, x, y) {
        ctx.fillStyle = this.baseColor
        ctx.beginPath()
        ctx.arc(x, y, this.width, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
    }
}


class PowerupManager {

    /** @type {Game} */
    #game

    /** @type {(_: number) => number} */
    #generationFunc
    /** @type {number} */
    #currentTime
    /** @type {number} */
    #nextPowerupTime
    /** @type {{x: Number, y: Powerup, powerupType: Function}[]} */
    #boardPowerups = []
    /** @type {{remaining: Number, powerup: Powerup}[]} */
    #activePowerups = []
    
    /**
     * 
     * @param {Game} game 
     * @param {(_: number) => number} generationFunc - a function that takes the current time (in ticks), 
     * and outputs the mean time to add a new powerup
     */
    constructor(game, generationFunc)  {
        this.#game = game
        this.#currentTime = 0
        this.#generationFunc = generationFunc
        this.#setNextPowerupTime()
    }

    cleanEffects() {
        for (const activePowerup of this.#activePowerups) {
            activePowerup.powerup.endEffect()
        }
        this.#boardPowerups = []
        this.#activePowerups = []
        this.#currentTime = 0
    }

    #setNextPowerupTime() {
        // see: https://help.qresearchsoftware.com/hc/en-us/articles/4417233713935-How-to-Generate-Random-Numbers-Poisson-Distribution
        const mean = this.#generationFunc(this.#currentTime)
        const L = Math.exp(-mean)
        let p = 1.
        let k = 0
        do {
            k++;
            p *= Math.random()
        } while (p > L)

        this.#nextPowerupTime = k
    }

    update() {
        // deal with timings
        this.#currentTime++
        this.#nextPowerupTime--
        for (let i = 0; i < this.#activePowerups.length; i++) {
            this.#activePowerups[i].remaining--
            if (this.#activePowerups[i].remaining <= 0) {
                this.#activePowerups[i].powerup.endEffect()
                this.#activePowerups.splice(i, 1)
            }
        }

        // detect collisions
        this.#boardPowerups = this.#boardPowerups.filter((boardPowerup, _) => {
            for (const player of this.#game.players) {
                const dx = boardPowerup.x - player.position[0]
                const dy = boardPowerup.y - player.position[1]
                const r = player.width + boardPowerup.powerupType.width
                if (dx*dx + dy*dy <= r*r) {
                    this.#activePowerups.push({
                        remaining: boardPowerup.powerupType.duration,
                        powerup: new boardPowerup.powerupType(this.#game, player),
                    })
                    return false
                }
            }
            return true
        })

        // generate powerup
        if (this.#nextPowerupTime <= 0){
            const powerupWeights = Config.gameplay.powerups.weights
            let powerupNumber = Math.random()
            const powerupTotalWeights = powerupWeights.map(p => p.weight).reduce((s, a) => s+a, 0)
            /** @type {Function|null} */
            let powerupType = null
            for (const powerup of powerupWeights) {
                powerupNumber -= powerup.weight / powerupTotalWeights
                if (powerupNumber < 0) {
                    powerupType = powerup.powerupType
                    break
                }
            }
            if (powerupType === null) {
                console.error("Chose a null powerupType! How?")
                return
            }
            this.#boardPowerups.push({
                x: Math.random(),
                y: Math.random(),
                powerupType: powerupType
            })

            this.#setNextPowerupTime()
        }
    }

    render() {
        for (const boardPowerup of this.#boardPowerups) boardPowerup.powerupType.render(this.#game.ctx, boardPowerup.x, boardPowerup.y)
    }
}


// TODO: Powerups:
//  - Size change: do not kill
//  - Right angles
//  - Change angular velocity
//  - Random walls
//  - Player swap
//  - No obstacles
