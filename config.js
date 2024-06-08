const UPS = 60
const second = UPS
const minute = 60*second
const hour = 60*minute


// [X] generating players @ Game.constructor (UI/players)
// [X] powerup function @ Game.#powerupFunction (powerups/generation)
// [X] border rendering @ Game.renderBorder (powerups/effects/border/indicator)
// [X] obstacle gradient cycle @ Obstacle.render (UI/obstacle_gradient_cycle)
// [X] player positioning at round start @ Player.roundReset (gameplay/round/positioning)
// [X] player movement values @ Player.roundReset (gameplay/movement)
// [X] player invincibility hole @ Player.render (powerups/effects/invincibility/indicator)
// [X] powerup durations @ <powerup class> (powerups/effects/<powerup>/durations)
// [X] powerup width (gameplay/powerup_width)
// [X] powerup weights @ PoweupManaget.update (powerups/generation)
// [X] speed powerup multiplier @ BaseSpeedPowerup (TODO: powerups/effects/speed/multiplier)
// [X] end game scoring @ EndRound.constructor (gameplay/round/scoring)
// [X] continue game key @ <state class> (UI/controls)
// [X] text font/colour @ <state class>.render (UI/text)
// [X] trail on/off ticks @ InRound.mainloop (gameplay/obstacle)
// [X] border width @ InRound.mainloop (gameplay/border)
// [X] obstacle fraction @ InRound.#startTrailForPlayer, PreRound.constructor (gameplay/obstacle)
// [X] start invincibility ticks and "pre updates" @ PreRound.constructor (gameplay/round/start_effects)

// UI
// - text
//   - font
//   - colour
// - controls
//   - continue game key
// - players
//   - display
//     - names
//     - patterns
//   - default controls
// - obstacle gradient cycle
// powerups
// - generation
//   - function
//   - weights
// - effects
//   - <powerup>
//     - duration
//     - other effects
//     - indicator
// gameplay
// - movement
//   - default values
// - obstacle
//   - width fraction
//   - obstacle on/off
// - round
//   - positioning
//   - scoring
//   - start effects
// - border
// - powerup_width

const CONFIG = Object.freeze({
    UI: {
        text: {
            colour: "white",
            font: {
                huge: "0.1px sans-serif",
                large: "0.065px sans-serif",
                medium: "0.05px sans-serif",
                small: "0.035px sans-serif",
            },
        },
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
            onTicks: 80,
            offTicks: 20,
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

// const Config = Object.freeze({
//     continueGameKey: "Enter",

//     gameplay: {
//         trailOnTicks: 80,
//         trailOffTicks: 20,

//         border: {
//             width: 0.005,
//             colour: "yellow",
//             inactiveColour: "blue",
//             inactiveFlashPeriod: 1*second,
//             endInactiveIndicatorStart: 2*second,
//         },

//         player: {
//             velocity: 0.09/second,
//             angularVelocity: Math.PI*2/360*(80/second),
//             width: 0.0075,
//             obstacleFraction: 0.65,
//         },

//         start: {
//             generationRange: 0.8,
//             invincibility: second, // TODO: extend invincibility
//             preUpdates: 0.25*UPS,
//         },
        
//         endGameFactor: 5,
//         // TODO: enable tie-breaker

//         powerups: {
//             /** @type {{powerupType: Function, weight: number}[]} */
//             weights: [ // TODO: rework weights
//                 {powerupType: SelfSpeedBoost, weight: 0.5},
//                 {powerupType: OtherSpeedBoost, weight: 0.5},
//                 {powerupType: SelfSpeedDeboost, weight: 0.5},
//                 {powerupType: OtherSpeedDeboost, weight: 0.5},
                
//                 // {powerupType: SelfWidthBoost, weight: 0.5},
//                 // {powerupType: OtherWidthBoost, weight: 0.5},
//                 // {powerupType: SelfWidthDeboost, weight: 0.5},
//                 // {powerupType: OtherWidthDeboost, weight: 0.5},

//                 {powerupType: BorderPowerup, weight: 1},
//                 {powerupType: InvincibilityPowerup, weight: 1},
//                 {powerupType: KeyChangePowerup, weight: 1},
//                 {powerupType: ClearBoardPowerup, weight: 0.5},
//             ],
//             function: {
//                 minExpectedTime: 0.5*second,
//                 maxExpectedTime: 6*second,
//                 period: 2*minute,
//                 phase: 15*second,
//             },
//             width: 0.015,

//             // TODO: add spawn range (no powerups in the walls)

//             speedPowerupDuration: 3*second,
//             widthPowerupDuration: 3*second,
//             borderPowerupDuration: 6*second,
//             invincibilityPowerupDuration: 3*second,
//             keyChangePowerupDuration: 6*second,

//             maxInvincibilityHoleTicks: 1*second,
//             maxInvincibilityHoleFraction: 0.5,
//         }
//     },

//     text: {
//         colour: "white",
//         font: {
//             huge: "0.1px sans-serif",
//             large: "0.065px sans-serif",
//             medium: "0.05px sans-serif",
//             small: "0.035px sans-serif",
//         }
//     },
    
//     defaultPlayers: {
//         /** @type {{name: string, pattern: Pattern, invertedPattern: Pattern}[]} */
//         settings: [
//             {
//                 name: "Rudolph", 
//                 pattern: new Pattern(new Colour(0, 100, 50)),
//                 invertedPattern: new Pattern(new Colour(60, 40, 50)),
//             },
//             {
//                 name: "Rosemary", 
//                 pattern: new Pattern(new Colour(120, 100, 25.1)),
//                 invertedPattern: new Pattern(new Colour(200, 40, 40)),
//             },
//             {
//                 name: "Bluey", 
//                 pattern: new Pattern(new Colour(240, 100, 50)),
//                 invertedPattern: new Pattern(new Colour(300, 35, 50)),
//             },
//             {
//                 name: "Xi", 
//                 pattern: new Pattern(new Colour(60, 100, 50), new Colour(0, 100, 50)),
//                 invertedPattern: new Pattern(new Colour(160, 45, 50), new Colour(60, 40, 50)),
//             },
//             {
//                 name: "Coral", 
//                 pattern: new Pattern(new Colour(300, 100, 50), new Colour(270, 50, 40), new Colour(0, 81, 70)),
//                 invertedPattern: new Pattern(new Colour(30, 80, 50), new Colour(330, 60, 50), new Colour(60, 81, 60)),
//             },
//             {
//                 name: "Ocean", 
//                 pattern: new Pattern(new Colour(180, 100, 50), new Colour(240, 100, 40), new Colour(207, 44, 49)), 
//                 invertedPattern: new Pattern(new Colour(270, 50, 50), new Colour(330, 50, 40), new Colour(297, 60, 49)),
//             },
//             {
//                 name: "Pinky", 
//                 pattern: new Pattern(new Colour(327.57, 100, 53.92)),
//                 invertedPattern: new Pattern(new Colour(87.57, 50, 53.92)),
//             },
//             {
//                 name: "Yoda", 
//                 pattern: new Pattern(new Colour(120, 100, 74.9)),
//                 invertedPattern: new Pattern(new Colour(180, 50, 54.9)),
//             },
//             {
//                 name: "Usnavi", 
//                 pattern: new Pattern(new Colour(240, 100, 25.1)),
//                 invertedPattern: new Pattern(new Colour(0, 60, 50)),
//             },
//             {
//                 name: "Salmonella", 
//                 pattern: new Pattern(new Colour(6.18, 100, 71.37)),
//                 invertedPattern: new Pattern(new Colour(96.18, 70, 65)),
//             },
//         ],

//         /** @type {{left: string, right: string}[]} */
//         keys: [
//             {left: "ArrowLeft", right: "ArrowRight"},
//             {left: "KeyA", right: "KeyS"},
//             {left: "Numpad6", right: "Numpad9"},
//         ],

//         gradientCycleTicks: second,
//     },
// })
