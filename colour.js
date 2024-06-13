class Colour {
    /**
     * 
     * @param {number} hue the hue , in degree
     * @param {number} saturation the saturation, in percents
     * @param {number} lightness the lightness, in percents
     */
    constructor(hue, saturation, lightness) {
        this.hue = hue
        this.saturation = saturation
        this.lightness = lightness
    }

    string() {
        return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`
    }

    /**
     * 
     * @param {Colour} c1 
     * @param {Colour} c2 
     * @param {number} t the mix of the colours, 0 is entirely c1 and 1 is entirely c2
     */
    static mix(c1, c2, t) {
        const a1 = c1.hue*Math.PI/180, a2 = c2.hue*Math.PI/180
        const x = Math.cos(a1)*(1-t) + Math.cos(a2)*t, y = Math.sin(a1)*(1-t) + Math.sin(a2)*t
        const aMix = Math.atan2(y, x)
        const hueMix = aMix*180/Math.PI
        return `hsl(${hueMix}, ${c1.saturation*(1-t)+c2.saturation*t}%, ${c1.lightness*(1-t)+c2.lightness*t}%)`
    }
}


class Pattern {
    /**
     * 
     * @param {...Colour} colours 
     */
    constructor(...colours) {
        /** @type {Colour[]} */
        this.colours = colours
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x0 
     * @param {number} y0 
     * @param {number} x1 
     * @param {number} y1 
     * @returns {CanvasGradient|string}
     */
    linearGradient(ctx, x0, y0, x1, y1) {
        if (this.colours.length === 1) return this.colours[0].string()

        const grad = ctx.createLinearGradient(x0, y0, x1, y1)
        for (const [idx, colour] of this.colours.entries()) {
            grad.addColorStop(idx/(this.colours.length-1), colour.string())
        }
        return grad
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x
     * @param {number} y
     * @param {number} r
     * @returns {CanvasGradient|string}
     */
    radialGradient(ctx, x, y, r) {
        if (this.colours.length === 1) return this.colours[0].string()

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        for (const [idx, colour] of this.colours.entries()) {
            grad.addColorStop(idx/(this.colours.length-1), colour.string())
        }
        return grad
    }

    /**
     * 
     * @param {Boolean} [reversed=false]
     * @returns {string}
     */
    cssGradient(reversed=false) {
        if (this.colours.length === 1) {
            const colour = this.colours[0].string()
            return `linear-gradient(${colour}, ${colour})`
        }
        
        let result = "linear-gradient(0.25turn"
        if (reversed) {
            for (const colour of this.colours.slice().reverse()) result += ", " + colour.string()
        } else {
            for (const colour of this.colours) result += ", " + colour.string()
        }
        
        return result + ")"
    }

    /**
     * 
     * @param {number} t
     * @returns {string}
     */
    colourAt(t) {
        t = t - Math.floor(t)

        const wholePart = Math.floor(t*this.colours.length), fractionalPart = (t*this.colours.length) % 1
        return Colour.mix(this.colours[wholePart], this.colours[(wholePart+1)%this.colours.length], fractionalPart)
    }
}
