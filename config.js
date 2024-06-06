const Config = Object.freeze({
    continueGameKey: "Enter",

    gameplay: {
        UPS: 60,
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
                {powerupType: ClearBoardPowerup, weight: 1},
            ],
            width: 0.015,

            speedPowerupDuration: 60*3,
            widthPowerupDuration: 60*3,
            borderPowerupDuration: 60*6,
            invincibilityPowerupDuration: 60*3,
            keyChangePowerupDuration: 60*6,
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
