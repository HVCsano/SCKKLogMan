import fs from 'node:fs'
import readline from 'node:readline'

let akezdet = new Date().setHours(15, 0, 0, 0)
let avege = new Date().setHours(18, 30, 0, 0)

interface ember {
    műszak: number
    összesen: number
}

interface emberjson {
    [key: string]: ember
}

let egyperces: number[] = []
let lemondott: number[] = []
let elfogadott: { elfogadó: string; szám: number }[] = []
let fo: {
    emberek: emberjson
    lemondott: number
    egyperces: number
} = {
    emberek: {},
    lemondott: 0,
    egyperces: 0,
}

let logs: string[] = []

async function startUp() {
    if (!fs.existsSync('./logs')) return console.log('Nincs logs mappa')
    if (1 > fs.readdirSync('./logs', { encoding: 'utf-8' }).length)
        return console.log('Üres a logs mappa')
    const files = fs.readdirSync('./logs', { encoding: 'utf-8' })
    for (const val of files) {
        const fileStream = fs.createReadStream('./logs/' + val)
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        })
        for await (const line of rl) {
            logs.push(line)
        }
    }
    for (let i = 1; i < 1000; i++) {
        elfogadott.push({
            elfogadó: 'senki',
            szám: i,
        })
        const index = logs.findLastIndex((element) =>
            new RegExp(`elfogadta a következő hívást: ${i}$`).test(element)
        )

        if (index !== -1) {
            let most = new Date().setHours(
                Number(
                    logs[index].split(' ')[1].slice(undefined, -1).split(':')[0]
                ),
                Number(
                    logs[index].split(' ')[1].slice(undefined, -1).split(':')[1]
                ),
                Number(
                    logs[index].split(' ')[1].slice(undefined, -1).split(':')[2]
                ),
                0
            )
            let cuccman = logs[index].split(':')[4].split('/')[0].slice(1, -1)
            if (cuccman !== 'senki') {
                if (fo.emberek[cuccman]) {
                    if (akezdet < most && most < avege) {
                        fo.emberek[cuccman].összesen++
                        fo.emberek[cuccman].műszak++
                    } else {
                        fo.emberek[cuccman].összesen++
                    }
                } else {
                    if (akezdet < most && most < avege) {
                        fo.emberek[cuccman] = { műszak: 1, összesen: 1 }
                    } else {
                        fo.emberek[cuccman] = { műszak: 0, összesen: 1 }
                    }
                }
            }
        }
        const lemondott = logs.findLastIndex((element) =>
            element.includes(
                'Törlődött a következő hívás: ' + i + ' (lemondta a játékos)'
            )
        )
        const lemondott2 = logs.findLastIndex((element) =>
            element.endsWith('TAXI elfogadta a következő hívást: ' + i)
        )
        if (lemondott !== -1 && lemondott2 == -1) {
            let most = new Date().setHours(
                Number(
                    logs[lemondott]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[0]
                ),
                Number(
                    logs[lemondott]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[1]
                ),
                Number(
                    logs[lemondott]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[2]
                ),
                0
            )
            if (akezdet < most && most < avege) {
                fo.lemondott++
            }
        }
        const lemondva = logs.findLastIndex(
            (element) =>
                element.includes('Törlődött a következő hívás: ' + i) &&
                element.endsWith('TAXI törölte)')
        )
        if (lemondva !== -1) {
            let most = new Date().setHours(
                Number(
                    logs[lemondva]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[0]
                ),
                Number(
                    logs[lemondva]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[1]
                ),
                Number(
                    logs[lemondva]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[2]
                ),
                0
            )
            const elfogadva = logs.findLastIndex((element) =>
                element.endsWith('TAXI elfogadta a következő hívást: ' + i)
            )
            if (elfogadva !== -1) {
                let elf = new Date().setHours(
                    Number(
                        logs[elfogadva]
                            .split(' ')[1]
                            .slice(undefined, -1)
                            .split(':')[0]
                    ),
                    Number(
                        logs[elfogadva]
                            .split(' ')[1]
                            .slice(undefined, -1)
                            .split(':')[1]
                    ),
                    Number(
                        logs[elfogadva]
                            .split(' ')[1]
                            .slice(undefined, -1)
                            .split(':')[2]
                    ),
                    0
                )
                if (most - elf <= 60000) {
                    fo.egyperces++
                }
            }
        }
    }
    console.log(fo)
}

startUp()
