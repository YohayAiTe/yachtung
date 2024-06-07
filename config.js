const UPS = 60
const second = UPS
const minute = 60*second
const hour = 60*minute


// TODO: make constants use UPS
const Config = Object.freeze({
    continueGameKey: "Enter",

    gameplay: {
        trailOnTicks: 80,
        trailOffTicks: 20,

        border: {
            width: 0.005,
            colour: "yellow",
        },

        player: {
            velocity: 0.0015,
            angularVelocity: Math.PI*2/360*1.35,
            width: 0.0075,
            obstacleFraction: 0.65,
        },

        start: {
            generationRange: 0.8,
            invincibility: second, // TODO: extend invincibility
            preUpdates: 0.25*UPS,
        },
        
        endGameFactor: 5,
        // TODO: enable tie-breaker

        powerups: {
            /** @type {{powerupType: Function, weight: number}[]} */
            weights: [ // TODO: rework weights
                {powerupType: SelfSpeedBoost, weight: 0.5},
                {powerupType: OtherSpeedBoost, weight: 0.5},
                {powerupType: SelfSpeedDeboost, weight: 0.5},
                {powerupType: OtherSpeedDeboost, weight: 0.5},
                
                // {powerupType: SelfWidthBoost, weight: 0.5},
                // {powerupType: OtherWidthBoost, weight: 0.5},
                // {powerupType: SelfWidthDeboost, weight: 0.5},
                // {powerupType: OtherWidthDeboost, weight: 0.5},

                {powerupType: BorderPowerup, weight: 1},
                {powerupType: InvincibilityPowerup, weight: 1},
                {powerupType: KeyChangePowerup, weight: 1},
                {powerupType: ClearBoardPowerup, weight: 0.5},
            ],
            function: {
                minExpectedTime: 0.5*second,
                maxExpectedTime: 6*second,
                period: 2*minute,
                phase: 15*second,
            },
            width: 0.015,

            // TODO: add spawn range (no powerups in the walls)

            speedPowerupDuration: 3*second,
            widthPowerupDuration: 3*second,
            borderPowerupDuration: 6*second,
            invincibilityPowerupDuration: 3*second,
            keyChangePowerupDuration: 6*second,
        }
    },

    text: {
        colour: "white",
        font: {
            huge: "0.1px sans-serif",
            large: "0.065px sans-serif",
            medium: "0.05px sans-serif",
            small: "0.035px sans-serif",
        }
    },
    
    defaultPlayers: {
        /** @type {{name: string, colour: string, invertedColour: string}[]} */
        settings: [
            {
                name: "Rudolph", 
                colour: "hsl(0, 100%, 50%)", 
                invertedColour: "hsl(60, 40%, 50%)"
            },
            {
                name: "Rosemary", 
                colour: "hsl(120, 100%, 25.1%)", 
                invertedColour: "hsl(200, 40%, 40%)"
            },
            {
                name: "Bluey", 
                colour: "hsl(240, 100%, 50%)", 
                invertedColour: "hsl(300, 35%, 50%)"
            },
            {
                name: "Xi", 
                colour: "hsl(60, 100%, 50%)", 
                invertedColour: "hsl(160, 45%, 50%)"
            },  // TODO: make gradient
            {
                name: "Coral", 
                colour: "hsl(300, 100%, 50%)", 
                invertedColour: "hsl(30, 80%, 50%)"
            },
            {
                name: "Ocean", 
                colour: "hsl(180, 100%, 50%)", 
                invertedColour: "hsl(270, 50%, 50%)"
            },
            {
                name: "Pinky", 
                colour: "hsl(327.57, 100%, 53.92%)", 
                invertedColour: "hsl(87.57, 50%, 53.92%)"
            },
            {
                name: "Yoda", 
                colour: "hsl(120, 100%, 74.9%)", 
                invertedColour: "hsl(180, 50%, 54.9%)"
            },
            {
                name: "Usnavi", 
                colour: "hsl(240, 100%, 25.1%)", 
                invertedColour: "hsl(0, 60%, 50%)"
            },
            {
                name: "Salmonella", 
                colour: "hsl(6.18, 100%, 71.37%)", 
                invertedColour: "hsl(96.18, 70%, 65%)"
            },
        ],
        /** @type {{left: string, right: string}[]} */
        keys: [
            {left: "ArrowLeft", right: "ArrowRight"},
            {left: "KeyA", right: "KeyS"},
            {left: "Numpad6", right: "Numpad9"},
        ]
    },
})
