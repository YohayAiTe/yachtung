class Player {

    /** @type {string|null} */
    leftKey = null
    /** @type {string|null} */
    rightKey = null

    /** @type {Boolean} */
    isLeftPressed = false
    /** @type {Boolean} */
    isRightPressed = false

    /** @type {[number, number]} */
    position
    /** @type {number} */
    velocity
    /** @type {number} */
    angularVelocity
    /** @type {number} */
    currentAngle
    /** @type {number} */
    width

    /** @type {boolean} */
    isAlive = true
    /** @type {number} */
    currentObstacleTicks = 0
    /** @type {Obstacle|null} */
    currentObstacle = null

    /** @type {number} */
    score = 0


    /** @type {number} */
    invincibilityTicks
    /** @type {number} */
    keyDirections

    /**
     * @param {string} name 
     * @param {Pattern} pattern
     * @param {Pattern} invertedPattern 
     */
    constructor(name, pattern, invertedPattern) {
        this.name = name
        this.pattern = pattern
        this.invertedPattern = invertedPattern

        this.gameReset()
    }

    roundReset() {
        this.isLeftPressed = false
        this.isRightPressed = false

        const cgfRange = CONFIG.gameplay.round.generationRange
        const startOffset = (1-cgfRange) / 2
        this.position = [Math.random()*cgfRange + startOffset, Math.random()*cgfRange + startOffset]

        const cfgMovement = CONFIG.gameplay.movement
        this.velocity = cfgMovement.velocity
        this.angularVelocity = cfgMovement.angularVelocity
        this.currentAngle = Math.random()*2*Math.PI
        this.width = cfgMovement.width

        this.isAlive = true
        this.currentObstacleTicks = 0
        this.currentObstacle = null

        this.invincibilityTicks = 0
        this.keyDirections = 1
    }

    gameReset() {
        this.roundReset()

        this.score = 0
    }

    move() {
        if (!this.isAlive) return
        
        const direction = (this.isRightPressed ? 1 : 0) - (this.isLeftPressed ? 1 : 0)
        const angleChange = this.angularVelocity*direction*this.keyDirections
        const normalAngle = this.currentAngle + Math.PI/2
        if (this.currentObstacle) this.currentObstacle.addPoint(
            [...this.position], [Math.cos(normalAngle), Math.sin(normalAngle)])

        this.currentAngle += angleChange
        this.position[0] += this.velocity*Math.cos(this.currentAngle)
        this.position[1] += this.velocity*Math.sin(this.currentAngle)

        if (this.invincibilityTicks > 0) this.invincibilityTicks--
    }

    /**
     * 
     * @param {number} mean 
     * @param {number} stddev 
     * @param {number} min 
     * @returns {number}
     */
    #normalRandom(mean, stddev, min) {
        const u = 1 - Math.random()
        const v = Math.random()
        const z = Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v)
        return Math.max(Math.round(z*stddev + mean), min)
    }

    /**
     * 
     * @returns {Obstacle|null}
     */
    recreateObstacle() {
        if (!this.currentObstacle) return null
        this.currentObstacle = new Obstacle(this.width * CONFIG.gameplay.obstacle.widthFraction, this)
        return this.currentObstacle
    }

    /**
     * 
     * @returns {Obstacle|null}
     */
    updateObstacle() {
        this.currentObstacleTicks--
        if (this.currentObstacleTicks > 0) return null

        const cfgObstacle = CONFIG.gameplay.obstacle

        if (this.currentObstacle) {
            this.currentObstacle = null
            this.currentObstacleTicks = this.#normalRandom(cfgObstacle.meanOffTicks, cfgObstacle.stddevOffTicks, cfgObstacle.minOffticks)
            return null
        }
        this.currentObstacleTicks = this.#normalRandom(cfgObstacle.meanOnTicks, cfgObstacle.stddevOnTicks, cfgObstacle.minOnTicks)
        this.currentObstacle = new Obstacle(this.width * cfgObstacle.widthFraction, this)
        return this.currentObstacle
    }

    /**
     * 
     * @returns {Pattern}
     */
    get #activePattern() {
        return this.keyDirections === 1 ? this.pattern : this.invertedPattern
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        ctx.fillStyle = this.#activePattern.radialGradient(ctx, ...this.position, this.width)

        ctx.beginPath()
        ctx.arc(this.position[0], this.position[1], this.width, 0, 2*Math.PI, true)
        ctx.closePath()

        const cfgInvincibilityIndicator = CONFIG.powerups.effects.invincibility.indicator
        if (this.invincibilityTicks > 0) {
            const invincibilityHoleTicks = Math.min(this.invincibilityTicks, cfgInvincibilityIndicator.maxHoleTicks)
            const invincibilityHoleFraction = invincibilityHoleTicks / cfgInvincibilityIndicator.maxHoleTicks * 
                cfgInvincibilityIndicator.holeFraction
        
            ctx.arc(this.position[0], this.position[1], this.width * invincibilityHoleFraction, 0, 2*Math.PI, false)
            ctx.closePath()
        }
        ctx.fill()
    }
}

