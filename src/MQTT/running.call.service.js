const { Op } = require('sequelize');
const { User, Wallet, CallLog, Terminal, UserTimeSlot } = require('../models');
const { logTerminalEvent } = require('../utils/LogCreation');
const moment = require('moment-timezone');

const runningCallHandler = async (incomingMessage, client) => {
    try {
        const { tid, cid, credits, min_left, number, time_stamp } = incomingMessage;


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

        const endTime = time_stamp || Date.now();

        const duration = Math.floor((endTime - new Date(callLog.startTime)) / 1000);

        callLog.duration = duration
        callLog.min_left = min_left;
        callLog.end_credits = credits;
        callLog.creditsUsed = callLog.start_credits - credits;
        callLog.endTime = endTime
        await callLog.save()

        wallet.balance = credits;
        await wallet.save();

        const response = {
            type: "CUPDACK",
            time_stamp: Date.now(),
        }

        logTerminalEvent(terminal.id, "Server", response.type, response);
        publishResponse(client, terminal.terminalId, response);


        const indiaTime = moment().tz("Asia/Kolkata");

        const today = indiaTime.format("dddd");
        const currentTime = indiaTime.format("HH:mm");

        let activeSlot
        if (callLog.timeSlotId) {

            activeSlot = await UserTimeSlot.findOne({
                where: {
                    id: callLog.timeSlotId,
                    userId: user.id,
                    status: true
                },
            });
        } else {
            activeSlot = await UserTimeSlot.findOne({
                where: {
                    userId: user.id,
                    status: true,
                    startTime: { [Op.lte]: callLog.startTime }
                }
            });
        }

        if (activeSlot && currentTime >= activeSlot.endTime) {
            const stopResponse = {
                type: "CDIS",
                tid: callLog.tid,
                cid: callLog.cid
            };

            logTerminalEvent(terminal.id, "Server", stopResponse.type, stopResponse);

            return publishResponse(client, terminal.terminalId, stopResponse);
        }

    } catch (error) {
        console.error("Error in runningCallHandler:", error);
    }
}

const publishResponse = (client, terminalId, payload) => {
    client.publish(`${terminalId}`, JSON.stringify(payload),
        (err) => {
            if (err) { console.error("Publish Error:", err); }
        }
    );
};
module.exports = { runningCallHandler }