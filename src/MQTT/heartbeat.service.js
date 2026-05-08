const { Terminal } = require("../models");

const heartbeatHandler = async (incomingMessage, client) => {
    try {
        console.log("heartbeatService", incomingMessage);
        const incomingData = incomingMessage.data

        // const terminal = await Terminal.findOne({
        //     where: {
        //         terminalId: incomingData.tid
        //     }
        // })

        // if (terminal) {
        //     terminal.status = "Active"
        //     terminal.simNo = incomingData.sim
        //     terminal.imei = incomingData.imei
        //     await terminal.save()
        // }

        const response = {
            type: "heartbeat_ack",
            time_stamp: Date.now(),
            data: incomingData,
        }

        return client.publish("SSEE", JSON.stringify(response), (err) => {
            if (err) {
                console.error('Error message:', err);
            }
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = { heartbeatHandler }