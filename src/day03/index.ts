import run from 'aocrunner'
import _ from 'lodash'

const parseInput = (rawInput: string) => {
    return rawInput.split('\n')
}

const splitCompartments = (rucksack: string) => {
    const mid = rucksack.length / 2
    return [
        rucksack.slice(0, mid),
        rucksack.slice(mid),
    ]
}

const priority = (() => {
    const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
    const LOOKUP = `_${LOWERCASE}${_.upperCase(LOWERCASE)}`
    return (c: string) => LOOKUP.indexOf(c)
})()

const findCommonItemType = (group: Array<string>): string => {
    const [initial, ...rest] = group.map((line) => line.split(''))
    const commons = rest.reduce((acc, x) => _.intersection(acc, x), initial)
    return commons[0]!
}

const sumOfPriorities = (groups: Array<Array<string>>): number => {
    return _.sum(
        groups
            .map(findCommonItemType)
            .map(priority)
    )
}

const part1 = (rawInput: string) => {
    const rucksacks = parseInput(rawInput)
    return sumOfPriorities(rucksacks.map(splitCompartments))
}

const part2 = (rawInput: string) => {
    const rucksacks = parseInput(rawInput)
    return sumOfPriorities(_.chunk(rucksacks, 3))
}

run({
    part1: {
        tests: [
            {
                input: `
                    vJrwpWtwJgWrhcsFMMfFFhFp
                    jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
                    PmmdzqPrVvPwwTWBwg
                    wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
                    ttgJtRGJQctTZtZT
                    CrZsJsPPZsGzwwsLwLmpwMDw
                `,
                expected: 157,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
                    vJrwpWtwJgWrhcsFMMfFFhFp
                    jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
                    PmmdzqPrVvPwwTWBwg
                    wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
                    ttgJtRGJQctTZtZT
                    CrZsJsPPZsGzwwsLwLmpwMDw
                `,
                expected: 70,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
})
