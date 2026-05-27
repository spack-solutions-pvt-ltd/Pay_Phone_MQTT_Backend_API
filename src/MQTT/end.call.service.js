const { Terminal, RFIDCard, User, UserAssociatedNumber, CallLog } = require("../models");



const endCallHandler = async (incomingMessage, client) => {
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

        const runnigCall = await CallLog.findOne({
            where: {
                userId: card.userId,
                terminalId: terminal.id,
                phoneNumber: number,
                rfidCardId: card.id,
                status: 0
            }
        });

        if (!runnigCall) {
            console.warn(`No running call for this card : ${cid}`);
            return;
        }

        const user = await User.findOne({
            where: { id: card.userId },
            attributes: ["id",]
        });

        if (!user) {
            console.warn(`User not found : ${card.userId}`);
            return;
        }

        const userWallet = await Wallet.findOne({
            where: { userId: user.id, accountType: "User" },
            attributes: ["id", "balance"]
        });

        if (!userWallet) {
            console.warn(`User wallet not found : ${user.id}`);
            return;
        }
        const amount = Number(userWallet.balance) - Number(credits);

        await userWallet.update({ balance: credits });

        await WalletTransaction.create({
            transactionId: `UCTX${Date.now()}`,
            walletId: userWallet.id,
            amount: amount,
            type: "Debit",
            remainingBalance: credits,
            transactionType: "DEDUCT_FUNDS",
        });

        runnigCall.duration = time_stamp - runnigCall.startTime
        runnigCall.status = 1;
        runnigCall.min_left = min_left
        runnigCall.endTime = time_stamp
        runnigCall.end_credits = credits
        runnigCall.creditsUsed = amount
        await runnigCall.save();

        const response = {
            type: "CENDACK",
            time_stamp: Date.now(),
        }

        client.publish(`${terminal.terminalId}`, JSON.stringify(response), (err) => {
            if (err) {
                console.error('Error message:', err);
            }
        },);

    } catch (error) {
        console.log("sadsa", error)
    }
}

module.exports = { endCallHandler }