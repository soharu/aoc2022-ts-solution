import run from 'aocrunner'
import _ from 'lodash'

interface Grid {
    width: number,
    height: number,
    values: Array<Array<number>>
}

const leftTrees = (row: number, col: number, {values}: Grid) => {
    return _.range(0, col).map((c) => values[row][c])
}

const rightTrees = (row: number, col: number, {width, values}: Grid) => {
    return _.range(col + 1, width).map((c) => values[row][c])
}

const topTrees = (row: number, col: number, {values}: Grid) => {
    return _.range(0, row).map((r) => values[r][col])
}

const bottomTrees = (row: number, col: number, {height, values}: Grid) => {
    return _.range(row + 1, height).map((r) => values[r][col])
}

const isVisibleTree = (row: number, col: number, grid: Grid) => {
    return _.some([
        leftTrees(row, col, grid),
        rightTrees(row, col, grid),
        topTrees(row, col, grid),
        bottomTrees(row, col, grid)
    ].map((trees) => _.every(trees, (v) => v < grid.values[row][col])))
}

const countVisibleTreesFromOutside = (grid: Grid) => {
    const countTreesOnEdge = ({width, height}: Grid) => {
        return (width + height) * 2 - 4
    }
    
    const countVisibleTreeInInterior = (grid: Grid) => {
        let count = 0
        const {width, height} = grid
        for (let r = 1; r < height - 1; ++r) {
            for (let c = 1; c < width - 1; ++c) {
                if (isVisibleTree(r, c, grid)) {
                    count += 1
                }
            }
        }
        return count
    }

    return countTreesOnEdge(grid) + countVisibleTreeInInterior(grid)
}

const calculateScenicScore = (row: number, col: number, grid: Grid) => {
    const viewingDistances = [
        _.reverse(leftTrees(row, col, grid)),
        rightTrees(row, col, grid),
        _.reverse(topTrees(row, col, grid)),
        bottomTrees(row, col, grid)
    ].map((xs) =>{
        const offset = _.findIndex(xs, (x) => x >= grid.values[row][col])
        return offset === -1 ? xs.length : offset + 1
    })

    return _.reduce(viewingDistances, (acc, c) => acc * c, 1)
}

const findHighestScenicScore = (grid: Grid) => {
    const scores = []

    const {width, height} = grid
    for (let r = 1; r < height - 1; ++r) {
        for (let c = 1; c < width - 1; ++c) {
            scores.push(calculateScenicScore(r, c, grid))
        }
    }

    return _.max(scores)
}

const parseInput = (rawInput: string): Grid => {
    const values = rawInput.split('\n').map((lines) => lines.split('').map((c) => parseInt(c, 10)))
    return {
        width: values[0].length,
        height: values.length,
        values,
    }
}

const part1 = (rawInput: string) => {
    const grid = parseInput(rawInput)
    return countVisibleTreesFromOutside(grid)
}

const part2 = (rawInput: string) => {
    const grid = parseInput(rawInput)
    return findHighestScenicScore(grid)
}

run({
    part1: {
        tests: [
            {
                input: `
                    30373
                    25512
                    65332
                    33549
                    35390
                `,
                expected: 21,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
                    30373
                    25512
                    65332
                    33549
                    35390
                `,
                expected: 8,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
})
