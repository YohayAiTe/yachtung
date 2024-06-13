/**
 * 
 * @extends State
 */
class PreRound extends State {

    /** @type {number} */
    countdown

    constructor(game) {
        super(game, "pre-round")

        if (this.game.players.length < 2) return new StartScreen(game)

        this.countdown = 3+1
        this.reduceCountdown()

        const cfgStartEffects = CONFIG.gameplay.round.startEffects

        this.game.obstacles = []
        this.game.powerupManager.cleanEffects()

        for (const player of this.game.players) player.roundReset()
        this.game.scoreboard.updateScores(this.game.players, 0)
        this.game.scoreboard.showScoreboard()

        this.game.borderInactiveTicks = 0
        for (const player of this.game.players) {
            player.invincibilityTicks = cfgStartEffects.invincibilityTicks + cfgStartEffects.trailUpdates
            
            for (let i = 0; i < cfgStartEffects.trailUpdates; i++) this.game.updatePlayer(player)
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

    render() {
        this.game.renderBorder()
        this.game.renderObstacles()
        this.game.renderPlayers()
    }

    reduceCountdown() {
        if (this.countdown > 1) {
            setTimeout(this.reduceCountdown.bind(this), 1000)
            this.countdown--
            this.game.overlay.innerText = this.countdown.toString()
        } else {
            this.game.setState(InRound)
        }
    }
}
