import run from 'aocrunner'

const parseInput = (rawInput: string) => {
    return rawInput.split('\n')
        .map((line) => line.split(''))
}

const part1 = (rawInput: string) => {
    const heightmap = parseInput(rawInput)

    return -1
}

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput)

    return -1
}

run({
    part1: {
        tests: [
            {
                input: `
                    Sabqponm
                    abcryxxl
                    accszExk
                    acctuvwj
                    abdefghi
                `,
                expected: 31,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            // {
            //   input: ``,
            //   expected: "",
            // },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
})
