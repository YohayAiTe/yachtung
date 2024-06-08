/**
 * 
 * @extends State
 */
class PreRound extends State {

    /** @type {number} */
    countdown

    constructor(game) {
        super(game)

        if (this.game.players.length < 2) return new StartScreen(game)

        this.countdown = 3+1
        this.reduceCountdown()

        const startConfig = Config.gameplay.start

        this.game.obstacles = []
        this.game.powerupManager.cleanEffects()

        for (const player of this.game.players) player.roundReset()
        this.game.scoreboard.updateScores(this.game.players, 0)
        this.game.scoreboard.showScoreboard()

        this.game.borderInactiveTicks = 0
        for (const player of this.game.players) {
            player.invincibilityTicks = startConfig.invincibility + startConfig.preUpdates
            
            player.currentObstacle = new Obstacle(Config.gameplay.player.obstacleFraction * player.width, player)
            this.game.obstacles.push(player.currentObstacle)
            for (let i = 0; i < startConfig.preUpdates; i++) player.move()
            player.currentObstacle.activatePoints()
        }
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

        this.ctx.font = Config.text.font.huge
        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.fillStyle = Config.text.colour
        this.ctx.fillText(this.countdown.toString(), 0.5, 0.5)
    }

    reduceCountdown() {
        if (this.countdown > 1) {
            setTimeout(this.reduceCountdown.bind(this), 1000)
            this.countdown--
        } else {
            this.game.setState(InRound)
        }
    }
}
