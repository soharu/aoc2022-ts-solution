import run from 'aocrunner'
import _ from 'lodash'

interface RegisterBank {
    x: number
}

interface Instruction {
    opcode: string
    operand?: string
}

const parseInput = (rawInput: string): Array<Instruction> => {
    return rawInput.split('\n')
        .map((line) => line.split(' '))
        .map(([opcode, operand]) => ({ opcode, operand }))
}

const executeProgram = (instructions: Array<Instruction>): {
    xs: Array<number>
    register: RegisterBank
} => {
    const xs: Array<number> = []
    const register: RegisterBank = { x: 1 }

    instructions.forEach(({ opcode, operand }) => {
        const { x } = register

        if (opcode === 'addx') {
            xs.push(x)
            xs.push(x)
            register.x = x + parseInt(operand!, 10)
        } else { // code === 'noop'
            xs.push(x)
        }
    })

    return { xs, register }
}


const part1 = (rawInput: string) => {
    const instructions = parseInput(rawInput)
    const { xs } = executeProgram(instructions)

    const signalStrengths = (cycle: number, x: number) => cycle * x
    const result = _.range(20, 260, 40).map((cycle) => signalStrengths(cycle, xs[cycle - 1]))

    return _.sum(result)
}

const part2 = (rawInput: string) => {
    const instructions = parseInput(rawInput)
    const { xs } = executeProgram(instructions)

    const width = 40
    const height = 6

    const generateSprite = (position: number) => {
        return _.range(0, width)
            .map((x) => Math.abs(x - position) > 1 ? '.' : '#')
            .join('')
    }

    const pixels = _.range(0, height).map((row) => {
        return _.range(0, width).map((col) => {
            const cycle = row * width + col
            const sprite = generateSprite(xs[cycle])
            return sprite[col]
        }).join('')
    })

    return pixels.join('\n')
}

run({
    part1: {
        tests: [
            {
                input: `
                    addx 15
                    addx -11
                    addx 6
                    addx -3
                    addx 5
                    addx -1
                    addx -8
                    addx 13
                    addx 4
                    noop
                    addx -1
                    addx 5
                    addx -1
                    addx 5
                    addx -1
                    addx 5
                    addx -1
                    addx 5
                    addx -1
                    addx -35
                    addx 1
                    addx 24
                    addx -19
                    addx 1
                    addx 16
                    addx -11
                    noop
                    noop
                    addx 21
                    addx -15
                    noop
                    noop
                    addx -3
                    addx 9
                    addx 1
                    addx -3
                    addx 8
                    addx 1
                    addx 5
                    noop
                    noop
                    noop
                    noop
                    noop
                    addx -36
                    noop
                    addx 1
                    addx 7
                    noop
                    noop
                    noop
                    addx 2
                    addx 6
                    noop
                    noop
                    noop
                    noop
                    noop
                    addx 1
                    noop
                    noop
                    addx 7
                    addx 1
                    noop
                    addx -13
                    addx 13
                    addx 7
                    noop
                    addx 1
                    addx -33
                    noop
                    noop
                    noop
                    addx 2
                    noop
                    noop
                    noop
                    addx 8
                    noop
                    addx -1
                    addx 2
                    addx 1
                    noop
                    addx 17
                    addx -9
                    addx 1
                    addx 1
                    addx -3
                    addx 11
                    noop
                    noop
                    addx 1
                    noop
                    addx 1
                    noop
                    noop
                    addx -13
                    addx -19
                    addx 1
                    addx 3
                    addx 26
                    addx -30
                    addx 12
                    addx -1
                    addx 3
                    addx 1
                    noop
                    noop
                    noop
                    addx -9
                    addx 18
                    addx 1
                    addx 2
                    noop
                    noop
                    addx 9
                    noop
                    noop
                    noop
                    addx -1
                    addx 2
                    addx -37
                    addx 1
                    addx 3
                    noop
                    addx 15
                    addx -21
                    addx 22
                    addx -6
                    addx 1
                    noop
                    addx 2
                    addx 1
                    noop
                    addx -10
                    noop
                    noop
                    addx 20
                    addx 1
                    addx 2
                    addx 2
                    addx -6
                    addx -11
                    noop
                    noop
                    noop
                `,
                expected: 13140,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
                    addx 15
                    addx -11
                    addx 6
                    addx -3
                    addx 5
                    addx -1
                    addx -8
                    addx 13
                    addx 4
                    noop
                    addx -1
                    addx 5
                    addx -1
                    addx 5
                    addx -1
                    addx 5
                    addx -1
                    addx 5
                    addx -1
                    addx -35
                    addx 1
                    addx 24
                    addx -19
                    addx 1
                    addx 16
                    addx -11
                    noop
                    noop
                    addx 21
                    addx -15
                    noop
                    noop
                    addx -3
                    addx 9
                    addx 1
                    addx -3
                    addx 8
                    addx 1
                    addx 5
                    noop
                    noop
                    noop
                    noop
                    noop
                    addx -36
                    noop
                    addx 1
                    addx 7
                    noop
                    noop
                    noop
                    addx 2
                    addx 6
                    noop
                    noop
                    noop
                    noop
                    noop
                    addx 1
                    noop
                    noop
                    addx 7
                    addx 1
                    noop
                    addx -13
                    addx 13
                    addx 7
                    noop
                    addx 1
                    addx -33
                    noop
                    noop
                    noop
                    addx 2
                    noop
                    noop
                    noop
                    addx 8
                    noop
                    addx -1
                    addx 2
                    addx 1
                    noop
                    addx 17
                    addx -9
                    addx 1
                    addx 1
                    addx -3
                    addx 11
                    noop
                    noop
                    addx 1
                    noop
                    addx 1
                    noop
                    noop
                    addx -13
                    addx -19
                    addx 1
                    addx 3
                    addx 26
                    addx -30
                    addx 12
                    addx -1
                    addx 3
                    addx 1
                    noop
                    noop
                    noop
                    addx -9
                    addx 18
                    addx 1
                    addx 2
                    noop
                    noop
                    addx 9
                    noop
                    noop
                    noop
                    addx -1
                    addx 2
                    addx -37
                    addx 1
                    addx 3
                    noop
                    addx 15
                    addx -21
                    addx 22
                    addx -6
                    addx 1
                    noop
                    addx 2
                    addx 1
                    noop
                    addx -10
                    noop
                    noop
                    addx 20
                    addx 1
                    addx 2
                    addx 2
                    addx -6
                    addx -11
                    noop
                    noop
                    noop
                `,
                expected: [
                    '##..##..##..##..##..##..##..##..##..##..',
                    '###...###...###...###...###...###...###.',
                    '####....####....####....####....####....',
                    '#####.....#####.....#####.....#####.....',
                    '######......######......######......####',
                    '#######.......#######.......#######.....',
                ].join('\n'),
            },
        ],
        solution: part2,
        /*
            What eight capital letters appear on your CRT?
            BPJAZGAP

            ###..###....##..##..####..##...##..###..
            #..#.#..#....#.#..#....#.#..#.#..#.#..#.
            ###..#..#....#.#..#...#..#....#..#.#..#.
            #..#.###.....#.####..#...#.##.####.###..
            #..#.#....#..#.#..#.#....#..#.#..#.#....
            ###..#.....##..#..#.####..###.#..#.#....
        */
    },
    trimTestInputs: true,
    onlyTests: true,
})
