const fs = require('fs');
/**
 * Генерирует лог посещения парковки
 * 
 * @param {Date} fromDate Начальная дата ведения лога посещения парковки
 * @param {Date} toDate Финальная дата ведения лога посещения парковки
 * @returns {Array<{start: Date, end: Date}>}
 */
 function createLog(fromDate, toDate) {
    const log = [];
    let start = fromDate.getTime();

    while (start < toDate.getTime()) {
        let end = start + Math.random() * 3600000 * 8;
        log.push({ start: new Date(start), end: new Date(end) });
        start += Math.random() * 3600000;
    }

    return log;
 }

const log = createLog(
    new Date(process.argv[2] || '2021-06-01T00:00:00'),
    new Date(process.argv[3] || '2021-06-01T23:59:59')
);

process.stdout.write(JSON.stringify(log, null, '     '));