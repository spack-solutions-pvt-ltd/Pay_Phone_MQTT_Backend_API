const { Terminal, RFIDCard, User, UserAssociatedNumber, CallLog } = require('../models');

const callStartHandler = async (incomingMessage, client) => {
    try {

        const { data } = incomingMessage;

        if (!data) {
            console.error("[HEARTBEAT] Missing data object");
            return;
        }

        const { tid, cid, credits, min_left, number, time_stamp } = data;

        if (!tid) {
            console.error("[HEARTBEAT] Missing terminal id");
            return;
        }

        const terminal = await Terminal.findOne({
            where: { terminalId: tid },
            attributes: ["id", "operatorId", "terminalId"]
        });

        if (!terminal) {
            console.warn(`[HEARTBEAT] Terminal not found : ${tid}`);
            return;
        }

        const card = await RFIDCard.findOne({
            where: { cardNumber: cid }
        });

        if (!card) {
            console.warn(`RFID Card not found : ${cid}`);
            return;
        }

        const associatedNumber = await UserAssociatedNumber.findOne({
            where: { phoneNumber: number, },
            attributes: ["id"]
        });

        await CallLog.create({
            callerId: `Cl${Date.now()}`,
            userId: card.userId,
            terminalId: terminal.id,
            phoneNumber: number,
            startTime: time_stamp,
            associatedNumberId: associatedNumber.id,
            rfidCardId: card.id,
            min_left: min_left
        })

        const response = {
            type: "card_connect_ack",
            time_stamp: Date.now(),
        }

        client.publish(`${terminal.terminalId}`, JSON.stringify(response), (err) => {
            if (err) {
                console.error('Error message:', err);
            }
        },);

    } catch (error) {
        console.log(error)
    }
}

module.exports = { callStartHandler }