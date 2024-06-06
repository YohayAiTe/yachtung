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

        for (const player of this.game.players) {
            player.isAlive = true
            player.position = [Math.random()*0.8+0.1, Math.random()*0.8+0.1]
            player.currentAngle = Math.random()*2*Math.PI

            player.velocity = Config.gameplay.player.velocity
            player.angularVelocity = Config.gameplay.player.angularVelocity
            player.width = Config.gameplay.player.width
        }
        this.game.scoreboard.updateScores(this.game.players, 0)
        this.game.scoreboard.showScoreboard()

        this.game.borderUnactiveCount = 0
        for (const player of this.game.players) {
            player.invincibilityCount = 0
            player.keyDirections = 1
            player.isLeftPressed = false
            player.isRightPressed = false
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
        this.game.renderBorder(1)
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
