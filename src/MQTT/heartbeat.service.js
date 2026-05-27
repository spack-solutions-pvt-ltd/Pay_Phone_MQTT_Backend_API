const { Terminal } = require("../models");

const heartbeatHandler = async (incomingMessage, client) => {
    try {
        if (!incomingMessage || typeof incomingMessage !== "object") {
            console.error("[HEARTBEAT] Invalid incoming message");
            return;
        }

        const data = incomingMessage;

        if (!data) {
            console.error("[HEARTBEAT] Missing data object");
            return;
        }

        const { tid, sim, imei, status, firmwareVersion } = data;

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
            console.warn(`SIM number mismatch for terminal ${tid}. Expected: ${terminal.simNo}, Received: ${sim}`);
            return
        }

        if (imei && terminal.imeiNo !== imei) {
            updates.imeiNo = imei;
        }
        if (firmwareVersion && terminal.firmwareVersion !== firmwareVersion) {
            updates.firmwareVersion = firmwareVersion;
        }

        updates.lastPingAt = new Date();
        await terminal.update(updates);


        const response = {
            type: "PACK",
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