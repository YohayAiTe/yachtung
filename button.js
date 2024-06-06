
class Button {

    /** @type {string} */
    #text
    /** @type {number} */
    #x
    /** @type {number} */
    #y
    /** @type {string | CanvasGradient | CanvasPattern} */
    #colour
    /** @type {string} */
    #font
    /** @type {CanvasTextAlign} */
    #textAlign
    /** @type {CanvasTextBaseline} */
    #textBaseline

    /** @type {CanvasRenderingContext2D} */
    #ctx

    /** @type {number} */
    #minX
    /** @type {number} */
    #maxX
    /** @type {number} */
    #minY
    /** @type {number} */
    #maxY
    /** @type {Function} */
    #cb

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} text 
     * @param {number} x 
     * @param {number} y 
     * @param {string | CanvasGradient | CanvasPattern} colour 
     * @param {string} font 
     * @param {CanvasTextAlign} textAlign 
     * @param {CanvasTextBaseline} textBaseline 
     * @param {Function} cb
     */
    constructor(ctx, text, x, y, colour, font, textAlign, textBaseline, cb) {
        this.#text = text
        this.#x = x
        this.#y = y
        this.#colour = colour
        this.#font = font
        this.#textAlign = textAlign
        this.#textBaseline = textBaseline
        this.#cb = cb

        this.#ctx = ctx
        ctx.font = font
        ctx.textAlign = textAlign
        ctx.textBaseline = textBaseline
        const metrics = ctx.measureText(this.text)

        switch (textAlign) {
            case "center":
                this.#minX = x - metrics.actualBoundingBoxLeft
                this.#maxX = x + metrics.actualBoundingBoxLeft
                break
            case "left":
                this.#minX = x
                this.#maxX = x + metrics.width
                break
            case "right":
                this.#minX = x - metrics.width
                this.#maxX = x
                break
            case "end":
            case "start":
                console.error("button cannot deal with textAlign \"end\" or \"start\"")
                break
        }
        this.#minY = y - metrics.fontBoundingBoxAscent - metrics.alphabeticBaseline
        this.#maxY = y + metrics.fontBoundingBoxDescent
    }

    render() {
        this.#ctx.fillStyle = this.#colour
        this.#ctx.font = this.#font
        this.#ctx.textAlign = this.#textAlign
        this.#ctx.textBaseline = this.#textBaseline
        this.#ctx.fillText(this.#text, this.#x, this.#y)

        // this.#ctx.strokeStyle = this.#colour
        // this.#ctx.lineWidth = 0.002
        // this.#ctx.strokeRect(this.#minX, this.#y, this.#maxX-this.#minX, 0)
        // this.#ctx.strokeRect(this.#x, this.#minY, 0, this.#maxY-this.#minY)
        // this.#ctx.strokeRect(this.#minX, this.#minY, this.#maxX-this.#minX, this.#maxY-this.#minY)
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    testClick(x, y) {
        // console.log(`(${this.#minX} <= ${x}) && (${x} <= ${this.#maxX}) && (${this.#minY} <= ${y}) && (${y} <= ${this.#maxY})`)
        if ((this.#minX <= x) && (x <= this.#maxX) && (this.#minY <= y) && (y <= this.#maxY)) {
            this.#cb()
        }
    }

    /** @returns {string} */
    get text() {
        return this.#text
    }
}
