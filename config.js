const UPS = 60
const second = UPS
const minute = 60*second
const hour = 60*minute


const CONFIG = Object.freeze({
    UI: {
        controls: {
            continueGameKeys: ["Enter", "Space"],
        },
        players: {
            display: [
                {
                    name: "Rudolph", 
                    pattern: new Pattern(new Colour(0, 100, 50)),
                    invertedPattern: new Pattern(new Colour(60, 40, 50)),
                },
                {
                    name: "Rosemary", 
                    pattern: new Pattern(new Colour(120, 100, 25.1)),
                    invertedPattern: new Pattern(new Colour(200, 40, 40)),
                },
                {
                    name: "Bluey", 
                    pattern: new Pattern(new Colour(240, 100, 50)),
                    invertedPattern: new Pattern(new Colour(300, 35, 50)),
                },
                {
                    name: "Xi", 
                    pattern: new Pattern(new Colour(60, 100, 50), new Colour(0, 100, 50)),
                    invertedPattern: new Pattern(new Colour(160, 45, 50), new Colour(60, 40, 50)),
                },
                {
                    name: "Coral", 
                    pattern: new Pattern(new Colour(300, 100, 50), new Colour(270, 50, 40), new Colour(0, 81, 70)),
                    invertedPattern: new Pattern(new Colour(30, 80, 50), new Colour(330, 60, 50), new Colour(60, 81, 60)),
                },
                {
                    name: "Ocean", 
                    pattern: new Pattern(new Colour(180, 100, 50), new Colour(240, 100, 40), new Colour(207, 44, 49)), 
                    invertedPattern: new Pattern(new Colour(270, 50, 50), new Colour(330, 50, 40), new Colour(297, 60, 49)),
                },
                {
                    name: "Pinky", 
                    pattern: new Pattern(new Colour(327.57, 100, 53.92)),
                    invertedPattern: new Pattern(new Colour(87.57, 50, 53.92)),
                },
                {
                    name: "Yoda", 
                    pattern: new Pattern(new Colour(120, 100, 74.9)),
                    invertedPattern: new Pattern(new Colour(180, 50, 54.9)),
                },
                {
                    name: "Usnavi", 
                    pattern: new Pattern(new Colour(240, 100, 25.1)),
                    invertedPattern: new Pattern(new Colour(0, 60, 50)),
                },
                {
                    name: "Salmonella", 
                    pattern: new Pattern(new Colour(6.18, 100, 71.37)),
                    invertedPattern: new Pattern(new Colour(96.18, 70, 65)),
                },
            ],
            defaultControls: [
                {left: "ArrowLeft", right: "ArrowRight"},
                {left: "KeyA", right: "KeyS"},
                {left: "Numpad6", right: "Numpad9"},
            ],
        },
        obstacle: {
            gradientCycleTicks: second,
        },
    },

    powerups: {
        generation: {
            funcParams: {
                minExpectedTime: 0.5*second,
                maxExpectedTime: 6*second,
                period: 2*minute,
                phase: 15*second,
            },
            weights: [
                {getPowerupType: () => SelfSpeedBoost, weight: 0.5},
                {getPowerupType: () => OtherSpeedBoost, weight: 0.5},
                {getPowerupType: () => SelfSpeedDeboost, weight: 0.5},
                {getPowerupType: () => OtherSpeedDeboost, weight: 0.5},
                // {powerupType: SelfWidthBoost, weight: 0.5},
                // {powerupType: OtherWidthBoost, weight: 0.5},
                // {powerupType: SelfWidthDeboost, weight: 0.5},
                // {powerupType: OtherWidthDeboost, weight: 0.5},
                {getPowerupType: () => BorderPowerup, weight: 1},
                {getPowerupType: () => InvincibilityPowerup, weight: 1},
                {getPowerupType: () => ClearBoardPowerup, weight: 0.5},
                {getPowerupType: () => KeyChangePowerup, weight: 1},
            ],
            range: 0.9,
        },
        effects: {
            speed: {
                duration: 3*second,
                multiplier: 2,
            },
            width: {
                duration: 3*second,
                multiplier: 2,
            },
            border: {
                duration: 6*second,
                indicator: {
                    colour: "yellow",
                    inactiveColour: "blue",
                    inactiveFlashPeriod: 1*second,
                    endInactiveIndicatorStart: 2*second,
                },
            },
            invincibility: {
                duration: 3*second,
                indicator: {
                    maxHoleTicks: 1*second,
                    holeFraction: 0.5,
                },
            },
            keyChange: {
                duration: 6*second,
            },
        },
    },

    gameplay: {
        movement: {
            velocity: 0.09/second,
            angularVelocity: Math.PI*2/360*(80/second),
            width: 0.0075,
        },
        obstacle: {
            widthFraction: 0.65,
            meanOnTicks: 80,
            stddevOnTicks: 8,
            minOnTicks: 40,
            meanOffTicks: 20,
            stddevOffTicks: 2,
            minOffticks: 10,
        },
        round: {
            generationRange: 0.8,
            scoring: {
                endGameFactor: 5,
                // TODO: enable tie-breaker
            },
            startEffects: {
                invincibilityTicks: second,
                trailUpdates: 0.25*second,
            },
        },
        borderWidth: 0.005,
        powerupWidth: 0.015,
    },
})
