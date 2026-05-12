const { Terminal } = require("../models");

const heartbeatHandler = async (incomingMessage, client) => {
    try {
        if (!incomingMessage || typeof incomingMessage !== "object") {
            console.error("[HEARTBEAT] Invalid incoming message");
            return;
        }

        const { data } = incomingMessage;

        if (!data) {
            console.error("[HEARTBEAT] Missing data object");
            return;
        }

        const { tid, sim, imei, status } = data;

        if (!tid) {
            console.error("[HEARTBEAT] Missing terminal id");
            return;
        }

        const terminal = await Terminal.findOne({
            where: { terminalId: tid }
        });

        if (!terminal) {
            console.warn(`[HEARTBEAT] Terminal not found : ${tid}`);
            return;
        }
        const updates = {};

        if (terminal.status !== "Active") {
            updates.status = "Active";
        }

        if (sim && terminal.simNo !== sim) {
            updates.simNo = sim;
        }

        if (imei && terminal.imeiNo !== imei) {
            updates.imeiNo = imei;
        }

        updates.lastPingAt = new Date();
        await terminal.update(updates);


        const response = {
            type: "heartbeat_ack",
            time_stamp: Date.now(),
        }

        return client.publish(`${terminal.terminalId}`, JSON.stringify(response), (err) => {
            if (err) {
                console.error('Error message:', err);
            }
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = { heartbeatHandler }