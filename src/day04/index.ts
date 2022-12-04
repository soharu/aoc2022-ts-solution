import run from 'aocrunner'
import _ from 'lodash'

interface Range {
    first: number
    last: number
}

type Pair<T> = [T, T]

const parseInput = (rawInput: string) => {
    return rawInput
        .split('\n')
        .map((line) => line.split(','))
        .map(([first, second]) => {
            const [x1, y1] = first.split('-').map((x) => parseInt(x))
            const [x2, y2] = second.split('-').map((x) => parseInt(x))
            return [
                { first: x1, last: y1 },
                { first: x2, last: y2 },
            ] as Pair<Range>
        })
}

const isFullyOverlapped = ([a, b]: Pair<Range>) => {
    return (
        a.first === b.first ||
        (a.first < b.first && b.last <= a.last) ||
        (b.first < a.first && a.last <= b.last)
    )
}

const isNumberInRange = (x: number, { first, last }: Range) => {
    return _.inRange(x, first, last + 1)
}

const isOverlapped = ([first, second]: Pair<Range>) => {
    return (
        isNumberInRange(first.first, second) ||
        isNumberInRange(first.last, second) ||
        isNumberInRange(second.first, first) ||
        isNumberInRange(second.last, first)
    )
}

const countPairs = (
    pairs: Array<Pair<Range>>,
    predicate: (pair: Pair<Range>) => boolean,
) => {
    return pairs.filter(predicate).length
}

const part1 = (rawInput: string) => {
    const pairs = parseInput(rawInput)
    return countPairs(pairs, isFullyOverlapped)
}

const part2 = (rawInput: string) => {
    const pairs = parseInput(rawInput)
    return countPairs(pairs, isOverlapped)
}

run({
    part1: {
        tests: [
            {
                input: `
                    2-4,6-8
                    2-3,4-5
                    5-7,7-9
                    2-8,3-7
                    6-6,4-6
                    2-6,4-8
                `,
                expected: 2,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
                    2-4,6-8
                    2-3,4-5
                    5-7,7-9
                    2-8,3-7
                    6-6,4-6
                    2-6,4-8
                `,
                expected: 4,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
})
