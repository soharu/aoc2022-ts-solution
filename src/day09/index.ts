import run from 'aocrunner'
import _ from 'lodash'

type Pair = [number, number]

const isSamePair = (a: Pair, b: Pair): boolean => {
    return a[0] === b[0] && a[1] === b[1]
}

const applyVector = ([x, y]: Pair, [vx, vy]: Pair): Pair => {
    return [ x + vx, y + vy ]
}

interface Rope {
    head: Pair
    tails: Array<Pair>
}

type Direction = 'R' | 'L' | 'U' | 'D'

interface Motion {
    direction: Direction
    numberOfSteps: number
}

const directionVector: { [key in Direction]: Pair } = {
    'R': [  1,  0 ],
    'L': [ -1,  0 ],
    'U': [  0,  1 ],
    'D': [  0, -1 ],
}

const parseInput = (rawInput: string): Array<Motion> => {
    return rawInput.split('\n')
        .map((line) => line.split(' '))
        .map(([direction, n]) => ({
            direction: direction as Direction,
            numberOfSteps: parseInt(n, 0)
        }))
}

const tailVector = (head: Pair, tail: Pair): Pair => {
    const dx = head[0] - tail[0]
    const dy = head[1] - tail[1]
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 2) {
        return [ dx < 0 ? -1 : 1, dy < 0 ? -1 : 1]
    } else if (distance > 1) {
        if (Math.abs(dx) === 2) {
            return [ dx < 0 ? -1 : 1, 0]
        } else if (Math.abs(dy) === 2) {
            return [ 0, dy < 0 ? -1 : 1]
        } else {
            return [0, 0]
        }
    } else {
        return [0, 0]
    }
}

const applyMotion = (
    { head, tails }: Rope,
    { direction }: Motion,
): Rope => {
    const newHead = applyVector(head, directionVector[direction])
    const newTails: Array<Pair> = []

    for (let i = 0; i < tails.length; ++i) {
        const h = i === 0 ? newHead : newTails[i - 1]
        const t = tails[i]
        newTails.push(applyVector(t, tailVector(h, t)))
    }
    
    return {
        head: newHead,
        tails: newTails,
    }
}

const countPositionsVisitedByTail = (
    rope: Rope,
    motions: Array<Motion>
) => {
    const visited: Array<Pair> = []

    motions.forEach((motion) => {
        for (let i = 0; i < motion.numberOfSteps; ++i) {
            rope = applyMotion(rope, motion)
            visited.push(_.last(rope.tails)!)
        }
    })

    return _.uniqWith(visited, isSamePair).length
}

const part1 = (rawInput: string) => {
    const motions = parseInput(rawInput)
    let rope: Rope = {
        head: [0, 0],
        tails: [[0, 0]],
    }
    return countPositionsVisitedByTail(rope, motions)
}

const part2 = (rawInput: string) => {
    const motions = parseInput(rawInput)
    let rope: Rope = {
        head: [0, 0],
        tails: _.fill(Array(9), [0, 0])
    }
    return countPositionsVisitedByTail(rope, motions)
}

run({
    part1: {
        tests: [
            {
                input: `
                    R 4
                    U 4
                    L 3
                    D 1
                    R 4
                    D 1
                    L 5
                    R 2
                `,
                expected: 13,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
                    R 4
                    U 4
                    L 3
                    D 1
                    R 4
                    D 1
                    L 5
                    R 2
                `,
                expected: 1,
            },
            {
                input: `
                    R 5
                    U 8
                    L 8
                    D 3
                    R 17
                    D 10
                    L 25
                    U 20
                `,
                expected: 36,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
})
