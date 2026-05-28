const { User, Wallet, CallLog, Terminal } = require('../models');

const runningCallHandler = async (incomingMessage, client) => {
    try {
        const { tid, cid, credits, min_left, number } = incomingMessage;


        const terminal = await Terminal.findOne({
            where: { terminalId: tid },
            attributes: ["id", "terminalId"]
        });

        if (!terminal) {
            console.warn(`Terminal not found : ${tid}`);
            return;
        }

        const callLog = await CallLog.findOne({
            where: {
                phoneNumber: number,
                status: false,
                terminalId: terminal.id
            },
        });

        if (!callLog) {
            console.warn(`Call log not found : ${number}`);
            return;
        }

        const user = await User.findOne({
            where: { id: callLog.userId },
            attributes: ["id", "userId"]
        });

        const wallet = await Wallet.findOne({
            where: { userId: user.id, accountType: "User" },
        });

        if (!wallet) {
            console.warn(`Wallet not found : ${user.id}`);
            return;
        }

        callLog.min_left = min_left;
        callLog.end_credits = credits;
        callLog.creditsUsed = callLog.start_credits - credits;
        await callLog.save()

        wallet.balance = credits;
        await wallet.save();

        const response = {
            type: "CUPDACK",
            time_stamp: Date.now(),
        }

        client.publish(`${terminal.terminalId}`, JSON.stringify(response), (err) => {
            if (err) {
                console.error('Error message:', err);
            }
        },);
    } catch (error) {
        console.error("Error in runningCallHandler:", error);
    }
}

module.exports = { runningCallHandler }