const { TerminalLog } = require("../models");

const terminalLogQueue = [];

// Add log to queue
const logTerminalEvent = (terminalId, from, type, message) => {
    terminalLogQueue.push({
        terminalId,
        from,
        type,
        message: JSON.stringify(message),
        createdAt: new Date(),
        updatedAt: new Date(),
    });
};

// Bulk insert every 5 seconds
setInterval(async () => {
    if (!terminalLogQueue.length) return;

    const logs = terminalLogQueue.splice(0, 500);

    try {
        await TerminalLog.bulkCreate(logs);
        console.log(`Inserted ${logs.length} terminal logs`);
    } catch (error) {
        console.error("Terminal Log Bulk Insert Error:", error);
    }
}, 5000);

module.exports = {
    logTerminalEvent,
};