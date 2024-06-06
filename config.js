const UPS = 60
const second = UPS
const minute = 60*second
const hour = 60*minute


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
            invincibility: second,
            preUpdates: 0.25*UPS,
        },
        
        endGameFactor: 5,
        // TODO: enable tie-breaker

        powerups: {
            /** @type {{powerupType: Function, weight: number}[]} */
            weights: [
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
        /** @type {{name: string, colour: string}[]} */
        settings: [
            {name: "Rudolph", colour: "red"},
            {name: "Rosemary", colour: "green"},
            {name: "Bluey", colour: "blue"},
            {name: "Xi", colour: "yellow"},
            {name: "Coral", colour: "magenta"},
            {name: "Ocean", colour: "cyan"},
            {name: "Pinky", colour: "pink"},
            {name: "Yoda", colour: "lightgreen"},
            {name: "Usnavi", colour: "navy"},
            {name: "Salmonella", colour: "salmon"},
        ],
        /** @type {{left: string, right: string}[]} */
        keys: [
            {left: "ArrowLeft", right: "ArrowRight"},
            {left: "KeyA", right: "KeyS"},
            {left: "Numpad6", right: "Numpad9"},
        ]
    },
})
