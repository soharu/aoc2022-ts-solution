import run from 'aocrunner'
import _ from 'lodash'

class Monkey {
    itemLevels: Array<number>
    operation: (value: number) => number
    test: (value: number) => number
    testDivider: number
    inspectedItemCount: number

    constructor(
        itemLevels: Array<number>,
        operation: string,
        test: {
            divider: number
            valueIfTrue: number
            valueIfFalse: number
        }
    ) {
        this.itemLevels = itemLevels
        this.operation = eval(operation)
        this.test = (value: number) => {
            return value % test.divider === 0 ? test.valueIfTrue : test.valueIfFalse
        }
        this.testDivider = test.divider
        this.inspectedItemCount = 0
    }

    hasItem(): boolean {
        return this.itemLevels.length > 0
    }

    inspectAndThrow(adjustItemLevel: (value: number) => number): { target: number, itemLevel: number } {
        this.inspectedItemCount += 1

        const level = this.itemLevels.shift()!
        const newLevel = adjustItemLevel(this.operation(level))
        const target = this.test(newLevel)

        return { target, itemLevel: newLevel }
    }

    catch(itemLevel: number) {
        this.itemLevels.push(itemLevel)
    }
}

const MonkeyParser = (() => {
    const parseStartingitemLevels = (line: string): Array<number> => {
        const offset = line.indexOf(':')
        return _.map(
            line.substring(offset + 1).trim().split(' '),
            _.parseInt,
        )
    }

    const parseOperation = (line: string): string => {
        const offset = line.indexOf('old')
        const tokens = line.substring(offset).split(' ')
        return `(${tokens[0]}) => ${tokens.join(' ')}`
    }

    const parseTest = (lines: Array<string>): { divider: number, valueIfTrue: number, valueIfFalse: number } => {
        const divider = _.parseInt(_.last(lines[0].split(' '))!)
        const valueIfTrue = _.parseInt(_.last(lines[1].split(' '))!)
        const valueIfFalse = _.parseInt(_.last(lines[2].split(' '))!)
        return { divider, valueIfTrue, valueIfFalse }
    }

    const parse = (lines: Array<string>): Monkey => {
        const [, a, b, ...rest] = lines
        const itemLevels = parseStartingitemLevels(a)
        const operation = parseOperation(b)
        const test = parseTest(rest)
        return new Monkey(itemLevels, operation, test)
    }

    return Object.freeze({
        parse,
    })
})()

const MathUtil = (() => {
    // https://stackoverflow.com/a/49722579
    const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b
    const lcm = (a: number, b: number): number => a * b / gcd(a, b)

    return Object.freeze({
        gcd,
        lcm,
    })
})()

const parseInput = (rawInput: string): Array<Monkey> => {
    const chunks = _.chunk(_.compact(rawInput.split('\n')), 6)
    return _.map(chunks, MonkeyParser.parse)
}

const chaseMonkeys = (
    monkeys: Array<Monkey>,
    adjustItemLevel: (value: number) => number,
    maxRound: number,
) => {
    _.range(0, maxRound).forEach(() => {
        monkeys.map((monkey) => {
            while (monkey.hasItem()) {
                const { target, itemLevel } = monkey.inspectAndThrow(adjustItemLevel)
                monkeys[target].catch(itemLevel)
            }
        })
    })
}

const levelOfMonkeyBusiness = (monkeys: Array<Monkey>) => {
    const mostActiveMonkeys = _.takeRight(
        _.sortBy(monkeys, (monkey) => monkey.inspectedItemCount),
        2,
    )

    return _.reduce(
        mostActiveMonkeys,
        (acc, monkey) => acc * monkey.inspectedItemCount,
        1
    )
}

const part1 = (rawInput: string) => {
    const monkeys = parseInput(rawInput)
    const adjustItemLevel = (value: number) => Math.floor(value / 3)
    const maxRound = 20

    chaseMonkeys(monkeys, adjustItemLevel, maxRound)

    return levelOfMonkeyBusiness(monkeys)
}

const part2 = (rawInput: string) => {
    const monkeys = parseInput(rawInput)
    const adjustItemLevel = (() => {
        const lcm = monkeys.map(({testDivider}) => testDivider).reduce(MathUtil.lcm)
        return (value: number) => value % lcm
    })()
    const maxRound = 10_000

    chaseMonkeys(monkeys, adjustItemLevel, maxRound)

    return levelOfMonkeyBusiness(monkeys)
}

run({
    part1: {
        tests: [
            {
                input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
                expected: 10605,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
                expected: 2713310158,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
})
