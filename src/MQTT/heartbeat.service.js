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

        const { tid, sim, imei, status, firmwareVersion, sstr } = data;

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

        if (terminal.status == "Blocked") {
            console.warn(`Terminal is blocked : ${tid}`);

            const request = {
                type: "PINGACK",
                allowed: false
            }

            return client.publish(`${terminal.terminalId}`, JSON.stringify(request), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            },);
        }

        if (terminal.status !== "Active") {
            updates.status = "Active";
        }

        if (sim && terminal.simNo !== sim) {
            console.warn(`SIM number mismatch for terminal ${tid}. Expected: ${terminal.simNo}, Received: ${sim}`);

            const request = {
                type: "TCMD",
                tid: terminal.terminalId,
                allowed: false
            }

            return client.publish(`${terminal.terminalId}`, JSON.stringify(request), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            },);
        }

        if (imei && terminal.imeiNo !== imei) {
            updates.imeiNo = imei;
        }
        if (firmwareVersion && terminal.firmwareVersion !== firmwareVersion) {
            updates.firmwareVersion = firmwareVersion;
        }
        if (sstr && terminal.sstr !== sstr) {
            updates.sstr = sstr;
        }

        updates.lastPingAt = new Date();
        await terminal.update(updates);


        const response = {
            type: "PINGACK",
            allowed: true
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