import run from 'aocrunner'
import _ from 'lodash'

interface File {
    name: string
    size: number
}

interface Directory {
    name: string
    totalFileSize: number
    totalDirectorySize?: number
    files: Array<File>
    subDirectories: Array<Directory>
}

const isChangeDirectoryCommand = (tokens: Array<string>) => {
    return tokens[0] === '$' && tokens[1] === 'cd'
}

const isListCommand = (tokens: Array<string>) => {
    return tokens[0] === '$' && tokens[1] === 'ls'
}

const updateCurrentDirectory = (currentDirectory: Array<string>, toDir: string) => {
    switch (toDir) {
        case '..':
            currentDirectory.pop()
            break
        case '/':
            currentDirectory.splice(1)
            break
        default:
            currentDirectory.push(toDir)
            break
    }
}

const buildDirectory = (name: string, items: Array<string>): Directory => {
    const parseFile = (value: string): File => {
        const [size, name] = value.split(' ')
        return { name, size: parseInt(size, 10) }
    }

    const [, fileParts] = _.partition(items, (item) => item.startsWith('dir'))
    const files = fileParts.map(parseFile)

    return {
        name,
        totalFileSize: _.sumBy(files, 'size'),
        files,
        subDirectories: []
    }
}

const addDirectory = (root: Directory, parentDirectory: Array<string>, newDir: Directory) => {
    let cur = root
    for (let i = 1; i < parentDirectory.length; ++i) {
        cur = cur.subDirectories.find(({name}) => name === parentDirectory[i])!
    }
    cur.subDirectories.push(newDir)
}

const parseInput = (rawInput: string): Directory => {
    const lines = rawInput.split('\n')

    const root: Directory = {
        name: '/',
        totalFileSize: 0,
        files: [],
        subDirectories: []
    }
    const currentDirectory = ['/']

    let index = 0
    while (index < lines.length) {
        const tokens = lines[index++].split(' ')

        if (isChangeDirectoryCommand(tokens)) {
            updateCurrentDirectory(currentDirectory, tokens[2]!)
        } else if (isListCommand(tokens)) {
            let nextCommandIndex = _.findIndex(lines, (line) => line.startsWith('$'), index)
            nextCommandIndex = nextCommandIndex !== -1 ? nextCommandIndex : lines.length

            const dir = buildDirectory(_.last(currentDirectory)!, lines.slice(index, nextCommandIndex))
            if (dir.name === '/') {
                root.totalFileSize = dir.totalFileSize
                root.files = dir.files
                root.subDirectories = dir.subDirectories
            } else {
                addDirectory(root, currentDirectory.slice(0, currentDirectory.length - 1), dir)
            }
            index = nextCommandIndex
        }
    }

    return root
}

const totalSizeOfDirectory = (dir: Directory): number => {
    if (dir.totalDirectorySize !== undefined) {
        return dir.totalDirectorySize
    }

    const totalSize = dir.totalFileSize + _.sumBy(dir.subDirectories, (dir) => totalSizeOfDirectory(dir))
    dir.totalDirectorySize = totalSize

    return totalSize
}

const findDirectories = (
    root: Directory, 
    predicate: (dir: Directory) => boolean,
    acc: Array<Directory> = []
): Array<Directory> => {
    if (predicate(root)) {
        acc.push(root)
    }

    if (root.subDirectories.length === 0) {
        return acc
    }

    root.subDirectories.forEach((dir) => {
        findDirectories(dir, predicate, acc)
    })

    return acc
}

const part1 = (rawInput: string) => {
    const root = parseInput(rawInput)
    const dirs = findDirectories(
        root, 
        (dir) => totalSizeOfDirectory(dir) < 100_000,
    )
    return _.sum(dirs.map(totalSizeOfDirectory))
}

const part2 = (rawInput: string) => {
    const root = parseInput(rawInput)

    const DISK_SPACE = 70_000_000
    const REQUIRED_SPACE = 30_000_000
    const targetSize = REQUIRED_SPACE - (DISK_SPACE - totalSizeOfDirectory(root))

    const dirs = findDirectories(
        root, 
        (dir) => totalSizeOfDirectory(dir) >= targetSize,
    )
    dirs.sort((a, b) => totalSizeOfDirectory(a) - totalSizeOfDirectory(b))

    return totalSizeOfDirectory(dirs[0])
}

run({
    part1: {
        tests: [
            {
                input: `
                    $ cd /
                    $ ls
                    dir a
                    14848514 b.txt
                    8504156 c.dat
                    dir d
                    $ cd a
                    $ ls
                    dir e
                    29116 f
                    2557 g
                    62596 h.lst
                    $ cd e
                    $ ls
                    584 i
                    $ cd ..
                    $ cd ..
                    $ cd d
                    $ ls
                    4060174 j
                    8033020 d.log
                    5626152 d.ext
                    7214296 k
                `,
                expected: 95437,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
                    $ cd /
                    $ ls
                    dir a
                    14848514 b.txt
                    8504156 c.dat
                    dir d
                    $ cd a
                    $ ls
                    dir e
                    29116 f
                    2557 g
                    62596 h.lst
                    $ cd e
                    $ ls
                    584 i
                    $ cd ..
                    $ cd ..
                    $ cd d
                    $ ls
                    4060174 j
                    8033020 d.log
                    5626152 d.ext
                    7214296 k
                `,
                expected: 24933642,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
})
