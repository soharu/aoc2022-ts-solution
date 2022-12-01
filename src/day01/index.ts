import run from 'aocrunner'

const parseInput = (rawInput: string) => `${rawInput}\n`.split('\n')

const sumOfMaxCalories = (lines: Array<string>, count: number): number => {
    const [calories] = lines.reduce(
        ([arr, sum], line) => {
            const n = parseInt(line)
            return isNaN(n) ? [[...arr, sum], 0] : [arr, sum + n]
        },
        [Array<number>(), 0],
    )

    calories.sort((a, b) => b - a)

    return calories.slice(0, count).reduce((acc, n) => acc + n, 0)
}

const part1 = (rawInput: string) => {
    return sumOfMaxCalories(parseInput(rawInput), 1)
}

const part2 = (rawInput: string) => {
    return sumOfMaxCalories(parseInput(rawInput), 3)
}

run({
    part1: {
        tests: [
            {
                input: `
                    1000
                    2000
                    3000

                    4000

                    5000
                    6000

                    7000
                    8000
                    9000

                    10000
                `,
                expected: 24000,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
                    1000
                    2000
                    3000

                    4000

                    5000
                    6000

                    7000
                    8000
                    9000

                    10000
                `,
                expected: 45000,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
})
