const { Terminal } = require('../models')

const TerminalHandler = async (incomingMessage) => {
    try {
        const { tid, allowed } = incomingMessage

        const terminal = await Terminal.findOne({
            where: { terminalId: tid },
            attributes: ["id", "operatorId", "terminalId", "status"]
        });

        if (!terminal) {
            console.warn(`Terminal not found : ${tid}`);
            return;
        }

        if (allowed === true) {
            terminal.status = "Active"
            await terminal.save()
        }
        if (allowed === false) {
            terminal.status = "Blocked"
            await terminal.save()
        }

    } catch (error) {
        console.log(error)
    }
}


module.exports = { TerminalHandler, }