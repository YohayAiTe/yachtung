
/**
 * 
 * @extends State
 */
class InRound extends State {
    /** @type {number|null} */
    interval = null
    /** @type {number} */
    trailTicks = 0

    constructor(game) {
        super(game)

        this.interval = setInterval(() => this.mainloop(game), 1000/UPS)
        this.trailTicks = 0
    }

    /** @type {KeyHandler} */
    keyHandler(event) {
        const isPress = event.type === "keydown"
        for (const player of this.game.players) {
            if (event.code == player.leftKey) player.isLeftPressed = isPress
            if (event.code == player.rightKey) player.isRightPressed = isPress
        }
    }

    /** @type {MouseHandler} */
    mouseHandler() {}

    render() {
        this.game.renderBorder()
        this.game.renderObstacles()
        this.game.renderPlayers()
        this.game.powerupManager.render()
    }

    mainloop() {
        for (const player of this.game.players) this.game.updatePlayer(player)

        const borderWidth = CONFIG.gameplay.borderWidth
        /** @type {number} */
        let justDied = 0
        for (const player of this.game.players) {
            if (!player.isAlive) continue
            if (this.game.borderInactiveTicks === 0) {
                if ((player.position[0] < player.width+borderWidth) || 
                    (1-player.position[0] < player.width+borderWidth) || 
                    (player.position[1] < player.width+borderWidth) || 
                    (1-player.position[1] < player.width+borderWidth)) {
                    
                    player.isAlive = false
                    justDied++
                    continue
                }
            } else {
                if (player.position[0] < 0) {
                    player.position[0] += 1
                    this.game.recreatePlayerObstacle(player)
                }
                if (player.position[0] > 1) {
                    player.position[0] -= 1
                    this.game.recreatePlayerObstacle(player)
                }
                if (player.position[1] < 0) {
                    player.position[1] += 1
                    this.game.recreatePlayerObstacle(player)
                }
                if (player.position[1] > 1) {
                    player.position[1] -= 1
                    this.game.recreatePlayerObstacle(player)
                }
            }
            if (player.invincibilityTicks <= 0) {
                for (const obstacle of this.game.obstacles) {
                    if (obstacle.doesPlayerCollide(player)) {
                        player.isAlive = false
                        justDied++
                        break
                    }
                }
            }
        }
        game.scoreboard.updateScores(this.game.players, justDied)

        for (const obstacle of this.game.obstacles) obstacle.activatePoints()

        let aliveCount = 0
        for (const player of this.game.players) if (player.isAlive) aliveCount++
        if (aliveCount <= 1) {
            if (this.interval) clearInterval(this.interval)
            this.game.setState(EndRound)
        }

        this.game.powerupManager.update()
        if (this.game.borderInactiveTicks > 0) this.game.borderInactiveTicks--
    }
}
