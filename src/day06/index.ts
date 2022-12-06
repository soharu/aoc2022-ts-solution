import run from 'aocrunner'
import _ from 'lodash'

const PACKET_MARKER_LENGTH = 4
const MESSAGE_MARKER_LENGTH = 14

const parseInput = (rawInput: string) => rawInput

const countProcessedChars = (data: string, markerLength: number): number => {
    for (let i = 0; i < data.length - markerLength; ++i) {
        const uniqueChars = _.uniq([...data.substring(i, i + markerLength)])
        if (uniqueChars.length === markerLength) {
            return i + markerLength
        }
    }
    return data.length
}

const part1 = (rawInput: string) => {
    const data = parseInput(rawInput)
    return countProcessedChars(data, PACKET_MARKER_LENGTH)
}

const part2 = (rawInput: string) => {
    const data = parseInput(rawInput)
    return countProcessedChars(data, MESSAGE_MARKER_LENGTH)
}

run({
    part1: {
        tests: [
            {
                input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
                expected: 7,
            },
            {
                input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
                expected: 5,
            },
            {
                input: `nppdvjthqldpwncqszvftbrmjlhg`,
                expected: 6,
            },
            {
                input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
                expected: 10,
            },
            {
                input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
                expected: 11,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
                expected: 19,
            },
            {
                input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
                expected: 23,
            },
            {
                input: `nppdvjthqldpwncqszvftbrmjlhg`,
                expected: 23,
            },
            {
                input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
                expected: 29,
            },
            {
                input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
                expected: 26,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
})
