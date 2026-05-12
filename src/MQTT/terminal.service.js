const { Terminal } = require('../models')

const blockTerminalHandler = async (incomingMessage) => {
    try {
        const { tid } = incomingMessage.data

        const terminal = await Terminal.findOne({
            where: { terminalId: tid },
            attributes: ["id", "operatorId", "terminalId", "status"]
        });

        if (!terminal) {
            console.warn(`Terminal not found : ${tid}`);
            return;
        }

        terminal.status = "Blocked"
        await terminal.save()

    } catch (error) {
        console.log(error)
    }
}

const unblockTerminalHandler = async (incomingMessage) => {
    try {
        const { tid } = incomingMessage.data

        const terminal = await Terminal.findOne({
            where: { terminalId: tid },
            attributes: ["id", "operatorId", "terminalId", "status"]
        });

        if (!terminal) {
            console.warn(`Terminal not found : ${tid}`);
            return;
        }

        terminal.status = "InActive"
        await terminal.save()

    } catch (error) {
        console.log(error)
    }
}

module.exports = { blockTerminalHandler, unblockTerminalHandler }