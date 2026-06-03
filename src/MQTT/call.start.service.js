const { Terminal, RFIDCard, User, UserAssociatedNumber, CallLog, Wallet } = require('../models');
const { logTerminalEvent } = require('../utils/LogCreation');

const callStartHandler = async (incomingMessage, client) => {
    try {

        const data = incomingMessage;

        if (!data) {
            console.error("Missing data object");
            return;
        }

        const { tid, cid, credits, min_left, number, time_stamp } = data;

        if (!tid) {
            console.error("Missing terminal id");
            return;
        }

        const terminal = await Terminal.findOne({
            where: { terminalId: tid },
            attributes: ["id", "operatorId", "terminalId"]
        });

        if (!terminal) {
            console.warn(`Terminal not found : ${tid}`);
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

        const userWallet = await Wallet.findOne({
            where: { userId: card.userId, accountType: "User" }
        });


        await CallLog.create({
            callerId: `Cl${Date.now()}`,
            userId: card.userId,
            terminalId: terminal.id,
            phoneNumber: number,
            startTime: time_stamp || Date.now(),
            associatedNumberId: associatedNumber.id,
            rfidCardId: card.id,
            min_left: min_left,
            start_credits: userWallet.balance,
            end_credits: credits,
            creditsUsed: Number(userWallet.balance) - Number(credits),
            status: false
        })

        await userWallet.update({ balance: credits })

        const response = {
            type: "CSTATACK",
            time_stamp: Date.now(),
        }
        
        logTerminalEvent(terminal.id, "Server", response.type, response);

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