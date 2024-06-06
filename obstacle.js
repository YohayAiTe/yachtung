class Obstacle {
    /** @type {[number, number][]} */
    #points = []
    /** @type {[number, number][]} */
    #normals = []
    /** @type {number} */
    #activePoints = 0

    /**
     * 
     * @param {number} width 
     * @param {Player} player
     */
    constructor(width, player) {
        this.width = width
        this.colour = player.colour
        this.player = player
    }

    /**
     * 
     * @param {[number, number]} point 
     * @param {[number, number]} normal 
     */
    addPoint(point, normal) {
        this.#points.push(point)
        this.#normals.push(normal)
    }
    
    /**
     * 
     * @returns {number}
     */
    get length() {
        return this.#activePoints
    }

    /**
     * 
     * @param {number} index 
     * @param {1|-1} direction 
     */
    getPoint(index, direction) {
        return [
            this.#points[index][0] + this.#normals[index][0]*this.width*direction,
            this.#points[index][1] + this.#normals[index][1]*this.width*direction,
        ]
    }

    /**
     * 
     * @param {Player} player
     * @param {[number, number]} points
     * @returns {boolean}
     */
    static #isPointInPlayer(player, point) {
        const dx = point[0]-player.position[0]
        const dy = point[1]-player.position[1]
        return dx*dx + dy*dy <= player.width*player.width
    }

    /**
     * 
     * @param {Player} player
     * @param {[[number, number], [number, number], [number, number]]} points
     * @returns {boolean}
     */
    static #doesPlayerCollideTriangle(player, points) {
        for (const point of points) {
            if (Obstacle.#isPointInPlayer(player, point)) return true
        }
        return false
    }

    activatePoints() {
        for (const point of this.#points.slice(this.#activePoints)) {
            if (Obstacle.#isPointInPlayer(this.player, point)) break
            this.#activePoints++
        }
    }

    /**
     * 
     * @param {Player} player
     * @returns {boolean}
     */
    doesPlayerCollide(player) {
        // TODO: better detection
        for (const point of this.#points.slice(0, this.#activePoints)) {
            if (Obstacle.#isPointInPlayer(player, point)) return true
        }
        return false
    }
}