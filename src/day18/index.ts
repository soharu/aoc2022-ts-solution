import run from 'aocrunner'
import _ from 'lodash'

interface Cube {
    x: number
    y: number
    z: number
}

enum Side {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
    TOP = 'TOP',
    FRONT = 'FRONT',
    BACK = 'BACK',
}

const allSide = Object.values(Side) as Array<Side>

type NeighborCount = { [key in Side]: number }

const cubeToStr = ({x, y, z}: Cube): string => {
    return `${x}_${y}_${z}`
}

const adjacentCube = ({x, y, z}: Cube, side: Side): Cube => {
    switch (side) {
        case Side.LEFT:
            return { x: x - 1, y, z }
        case Side.RIGHT:
            return { x: x + 1, y, z }
        case Side.BOTTOM:
            return { x, y: y - 1, z }
        case Side.TOP:
            return { x, y: y + 1, z }
        case Side.FRONT:
            return { x, y, z: z - 1 }
        case Side.BACK:
            return { x, y, z: z + 1 }
    }
}

const allAdjacentCubes = (cube: Cube): Array<Cube> => {
    return allSide.map((side) => adjacentCube(cube, side))
}

const neighborCubeCount = (target: Cube, allCubes: Array<Cube>, side: Side): number => {
    switch (side) {
        case Side.LEFT:
            return allCubes.filter((c) => (
                    c.x < target.x &&
                    c.y === target.y &&
                    c.z === target.z
                )).length

        case Side.RIGHT:
            return allCubes.filter((c) => (
                    c.x > target.x &&
                    c.y === target.y &&
                    c.z === target.z
                )).length

        case Side.BOTTOM:
            return allCubes.filter((c) => (
                    c.x === target.x &&
                    c.y < target.y &&
                    c.z === target.z
                )).length

        case Side.TOP:
            return allCubes.filter((c) => (
                    c.x === target.x &&
                    c.y > target.y &&
                    c.z === target.z
                )).length

        case Side.FRONT:
            return allCubes.filter((c) => (
                    c.x === target.x &&
                    c.y === target.y &&
                    c.z < target.z
                )).length

        case Side.BACK:
            return allCubes.filter((c) => (
                    c.x === target.x &&
                    c.y === target.y &&
                    c.z > target.z
                )).length
    }
}

const generateCubeSet = (cubes: Array<Cube>): Set<string> => {
    const result = new Set<string>()
    cubes.map(cubeToStr).forEach((v) => { result.add(v) })
    return result
}

const surfaceAreaOfScannedLavaDroplet = (cubes: Array<Cube>): number => {
    const cubeSet = generateCubeSet(cubes)

    return cubes.reduce((acc, target) => {
        const adjacented = generateCubeSet(allAdjacentCubes(target))
        const difference = new Set([...adjacented].filter(x => !cubeSet.has(x)))
        return acc + difference.size
    }, 0)
}

const allNeighborCount = (target: Cube, allCubes: Array<Cube>): NeighborCount => {
    return _.fromPairs(
        allSide.map((side): [Side, number] => [side, neighborCubeCount(target, allCubes, side)])
    ) as NeighborCount
}

const hasExteriorSide = (count: NeighborCount) => {
    return _.some(Object.values(count), (n) => n === 0)
}

const getExteriorSurfaceCount = (
    target: Cube,
    cubes: Array<Cube>,
    cubeSet: Set<string>
): number => {
    const neighborCount = allNeighborCount(target, cubes)

    const isSideExterior = (side: Side) => {
        if (neighborCount[side] === 0) {
            return true
        }

        const sidedCube = adjacentCube(target, side)

        if (cubeSet.has(cubeToStr(sidedCube))) {
            return false
        }

        let arr = [{ cube: sidedCube, side }]
        let subSide = [...allSide]
        while (arr.length > 0 && subSide.length > 0) {
            const [x, ...rest] = arr

            if (cubeSet.has(cubeToStr(x.cube))) {
                subSide = subSide.filter((s) => s !== x.side)
            } else {
                const count = allNeighborCount(x.cube, cubes)
                if (hasExteriorSide(count)) {
                    return true
                }
            }

            arr = [...rest, ...subSide.map((s) => ({ cube: adjacentCube(x.cube, s), side: s}))]
        }
        return false
    }

    return allSide.filter(isSideExterior).length
}

const exteriorSurfaceAreaOfScannedLavaDroplet = (cubes: Array<Cube>): number => {
    const cubeSet = generateCubeSet(cubes)
    return cubes.reduce((acc, target) => acc + getExteriorSurfaceCount(target, cubes, cubeSet), 0)
}

const parseInput = (rawInput: string): Array<Cube> => {
    return rawInput.split('\n')
        .map((line) => line.split(','))
        .map(([x, y, z]) => {
            return {
                x: parseInt(x, 10),
                y: parseInt(y, 10),
                z: parseInt(z, 10),
            }
        })
}

const part1 = (rawInput: string) => {
    const cubes = parseInput(rawInput)
    return surfaceAreaOfScannedLavaDroplet(cubes)
}

const part2 = (rawInput: string) => {
    const cubes = parseInput(rawInput)
    return exteriorSurfaceAreaOfScannedLavaDroplet(cubes)
}

run({
    part1: {
        tests: [
            {
                input: `
                    1,1,1
                    2,1,1
                `,
                expected: 10,
            },
            {
                input: `
                    2,2,2
                    1,2,2
                    3,2,2
                    2,1,2
                    2,3,2
                    2,2,1
                    2,2,3
                    2,2,4
                    2,2,6
                    1,2,5
                    3,2,5
                    2,1,5
                    2,3,5
                `,
                expected: 64,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
                    1,3,1
                    2,3,1
                    3,3,1
                    1,3,2
                    2,4,2
                    3,3,2
                    1,3,3
                    2,3,3
                    3,3,3
                `,
                expected: 38,
            },
            {
                input: `
                    1,1,1
                    2,1,1
                    3,1,1
                    1,1,2
                    2,1,2
                    3,1,2
                    1,1,3
                    2,1,3
                    3,1,3
                    1,3,1
                    2,3,1
                    3,3,1
                    1,3,2
                    2,4,2
                    3,3,2
                    1,3,3
                    2,3,3
                    3,3,3
                `,
                expected: 68,
            },
            {
                input: `
                    2,2,2
                    1,2,2
                    3,2,2
                    2,1,2
                    2,3,2
                    2,2,1
                    2,2,3
                    2,2,4
                    2,2,6
                    1,2,5
                    3,2,5
                    2,1,5
                    2,3,5
                `,
                expected: 58,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
})
