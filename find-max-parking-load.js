const fs = require('fs');

/**
 * Находит минимальное время пребываения автомобиля на парковке.
 * Требуется для выбора проверямого промежутка времени.
 * 
 * @param {Array<{start: Date, end: Date}>} log Журнал посещения парковки
 * @returns {{start: Date, end: Date}}
 */
function findMinRange(log) {
    return Math.min(...log.map(({ start, end }) => end.getTime() - start.getTime()));
}

/**
 * Находит максимальное количество автомобилей на парковке за определенный период
 * 
 * @param {Array<{start: Date, end: Date}>} log Журнал пребывания на парковке
 * @returns {Array<{start: Date, end: Date}>} Срез максимального количества автомобилей из журнала парковки
 */
function findMaxCarInSameTime(log) {
    const step = findMinRange(log);
    const endDate = log[log.length - 1].end.getTime();
    let carsSlice = [];
    let startDate = log[0].start.getTime();
    let toDate = startDate + step;

    do {
        let carsInRange = [];
        log.forEach(function ({ start, end }) {
            if (
                (start.getTime() <= toDate && toDate < end.getTime()) ||
                (end.getTime() > startDate&& startDate >= start.getTime())
            ) {
                carsInRange.push({ start, end });
            }
        });
        startDate = toDate;
        toDate = toDate + step;

        if (carsInRange.length > carsSlice.length) {
            carsSlice = carsInRange.slice();
        }
    } while (toDate < endDate);

    return carsSlice;
}

function main() {
    const log = JSON.parse(fs.readFileSync(process.argv[2]).toString()).map(({ start, end }) => ({
        start: new Date(start),
        end: new Date(end)
    }));
    const logSlice = findMaxCarInSameTime(log);
    fs.writeFileSync('./log-slice.json', JSON.stringify(logSlice, null, '    '));
    process.stdout.write(`Максимум на парковке было ${logSlice.length} единиц(ы) техники, записи из журнала, попавшие в выборку, сохранены в ./log-slice.json\n`);
    process.exit(0);
}

main();
