class Player {
    /**
     * @param {string} name 
     * @param {string} colour
     */
    constructor(name, colour) {
        this.name = name
        this.colour = colour
        
        /** @type {string|null} */
        this.leftKey = null
        /** @type {string|null} */
        this.rightKey = null

        /** @type {Boolean} */
        this.isLeftPressed = false
        /** @type {Boolean} */
        this.isRightPressed = false

        const playerConfig = Config.gameplay.player

        /** @type {[number, number]} */
        this.position = [0.5, 0.5]
        /** @type {number} */
        this.velocity = playerConfig.velocity
        /** @type {number} */
        this.angularVelocity = playerConfig.angularVelocity
        /** @type {number} */
        this.currentAngle = 0
        /** @type {number} */
        this.width = playerConfig.width

        /** @type {boolean} */
        this.isAlive = true

        /** @type {number} */
        this.score = 0

        /** @type {Obstacle|null} */
        this.currentObstacle = null

        /** @type {number} */
        this.invincibilityTicks = 0

        /** @type {number} */
        this.keyDirections = 1
    }

    move() {
        if (!this.isAlive) return
        
        const direction = (this.isRightPressed ? 1 : 0) - (this.isLeftPressed ? 1 : 0)
        const angleChange = this.angularVelocity*direction*this.keyDirections
        const normalAngle = this.currentAngle + angleChange/2 + Math.PI/2
        if (this.currentObstacle) this.currentObstacle.addPoint(
            [...this.position], [Math.cos(normalAngle), Math.sin(normalAngle)])

        this.currentAngle += angleChange
        this.position[0] += this.velocity*Math.cos(this.currentAngle)
        this.position[1] += this.velocity*Math.sin(this.currentAngle)

        if (this.invincibilityTicks > 0) this.invincibilityTicks--
    }
}

