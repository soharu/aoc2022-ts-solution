import run from 'aocrunner'
import _ from 'lodash'

const firstColumn = ['A', 'B', 'C'] as const
const secondColumn = ['X', 'Y', 'Z'] as const

type FirstColumn = typeof firstColumn[number]
type SecondColumn = typeof secondColumn[number]
type Pair = [FirstColumn, SecondColumn]

enum Shape {
    Rock = 1,
    Paper = 2,
    Scissors = 3,
}

enum Outcome {
    LOSE = 0,
    DRAW = 3,
    WIN = 6,
}

const shape: { [key in FirstColumn | SecondColumn]: Shape } = {
    ['A']: Shape.Rock,
    ['B']: Shape.Paper,
    ['C']: Shape.Scissors,
    ['X']: Shape.Rock,
    ['Y']: Shape.Paper,
    ['Z']: Shape.Scissors,
}

const outcome: { [key in SecondColumn]: Outcome } = {
    ['X']: Outcome.LOSE,
    ['Y']: Outcome.DRAW,
    ['Z']: Outcome.WIN,
} as const

const myOutcomeLookup: { [key in Shape]: { [key in Shape]: Outcome } } = {
    [Shape.Rock]: {
        [Shape.Rock]: Outcome.DRAW,
        [Shape.Paper]: Outcome.WIN,
        [Shape.Scissors]: Outcome.LOSE,
    },
    [Shape.Paper]: {
        [Shape.Rock]: Outcome.LOSE,
        [Shape.Paper]: Outcome.DRAW,
        [Shape.Scissors]: Outcome.WIN,
    },
    [Shape.Scissors]: {
        [Shape.Rock]: Outcome.WIN,
        [Shape.Paper]: Outcome.LOSE,
        [Shape.Scissors]: Outcome.DRAW,
    },
}

const myShapeLookup: { [key in Shape]: { [key in Outcome]: Shape } } = {
    [Shape.Rock]: {
        [Outcome.WIN]: Shape.Paper,
        [Outcome.DRAW]: Shape.Rock,
        [Outcome.LOSE]: Shape.Scissors,
    },
    [Shape.Paper]: {
        [Outcome.WIN]: Shape.Scissors,
        [Outcome.DRAW]: Shape.Paper,
        [Outcome.LOSE]: Shape.Rock,
    },
    [Shape.Scissors]: {
        [Outcome.WIN]: Shape.Rock,
        [Outcome.DRAW]: Shape.Scissors,
        [Outcome.LOSE]: Shape.Paper,
    },
}

function totalScore<T, U>(
    pairs: Array<Pair>,
    convert: (pair: Pair) => [T, U],
    score: (values: [T, U]) => number,
): number {
    return _.sum(pairs.map(convert).map(score))
}

const parseInput = (rawInput: string): Array<Pair> => {
    return rawInput
        .split('\n')
        .map((line) => line.split(' '))
        .map(([a, b]) => [a, b] as Pair)
}

const part1 = (rawInput: string) => {
    const pairs = parseInput(rawInput)
    return totalScore(
        pairs,
        ([a, b]) => [shape[a], shape[b]],
        ([theirs, ours]) => ours + myOutcomeLookup[theirs][ours],
    )
}

const part2 = (rawInput: string) => {
    const pairs = parseInput(rawInput)
    return totalScore(
        pairs,
        ([a, b]) => [shape[a], outcome[b]],
        ([theirs, outcome]) => myShapeLookup[theirs][outcome] + outcome,
    )
}

run({
    part1: {
        tests: [
            {
                input: `
                    A Y
                    B X
                    C Z
                `,
                expected: 15,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
                    A Y
                    B X
                    C Z
                `,
                expected: 12,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
})
