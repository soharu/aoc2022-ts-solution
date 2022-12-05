import run from 'aocrunner'
import _ from 'lodash'

interface Move {
    count: number
    from: number
    to: number
}

class Stack {
    values: Array<string>

    constructor(initialValues: Array<string>) {
        this.values = initialValues
    }
    
    top() {
        return _.last(this.values)
    }

    push(values: Array<string>) {
        values.forEach((x) => this.values.push(x))
    }

    pop(count: number = 1) {
        const result = _.takeRight(this.values, count)
        _.times(count).forEach(() => { this.values.pop() })
        return result
    }
}

interface Input {
    stacks: Array<Stack>
    moves: Array<Move>
}

const parseMove = (s: string): Move => {
    const parts = s.split(' ')
    return {
        count: parseInt(parts[1], 10),
        from: parseInt(parts[3], 10) - 1,
        to: parseInt(parts[5], 10) - 1,
    }
}

const parseStack = (input: Array<string>): Array<Stack> => {
    const lastOffset = input.length - 1
    const offsets = _.range(1, input[lastOffset].length, 4)
    const rows = _.range(lastOffset)
    const stacks = offsets.map((col) => {
        const initialValues = rows.reduce(
            (acc, row) => input[row][col] === ' ' ? acc : [input[row][col], ...acc],
            Array<string>()
        )
        return new Stack(initialValues)
    })
    return stacks
}

const parseInput = (rawInput: string): Input => {
    const lines = rawInput.split('\n').filter((line) => line.length > 0)
    const partitions = _.partition(lines, (line) => !line.startsWith('move'))
    const stacks = parseStack(partitions[0])
    const moves = partitions[1].map(parseMove)
    return { stacks, moves }
}

const stackTops = (
    { moves, stacks }: Input,
    rearrange: (move: Move, stacks: Array<Stack>) => void
) => {
    moves.forEach((move) => { rearrange(move, stacks) })
    return stacks.map((s) => s.top()).join('')
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput)
    return stackTops(input, (move: Move, stacks: Array<Stack>) => {
        const {count, from, to} = move
        for (let i = 0; i < count; ++i) {
            const items = stacks[from].pop()
            stacks[to].push(items)
        }
    })
}

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput)
    return stackTops(input, (move: Move, stacks: Array<Stack>) => {
        const {count, from, to} = move
        const items = stacks[from].pop(count)
        stacks[to].push(items)
    })
}

run({
    part1: {
        tests: [
            {
                input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
                expected: 'CMZ',
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
                expected: 'MCD',
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
})
