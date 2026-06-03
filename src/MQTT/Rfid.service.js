const { Op } = require('sequelize');
const { Terminal, RFIDCard, User, wallet, UserAssociatedNumber, UserActiveDay,
    CallLog, Operator, Wallet, UserTimeSlot } = require('../models');
const moment = require('moment-timezone');
const { logTerminalEvent } = require('../utils/LogCreation');

const rfidHandler = async (incomingMessage, client) => {
    try {
        const data = incomingMessage;

        if (!data) {
            console.error("Missing data object");
            return;
        }

        const { tid, cid } = data

        const terminal = await Terminal.findOne({
            where: { terminalId: tid },
            attributes: ["id", "operatorId", "terminalId"]
        });
        const notAllowedResponse = {
            type: "CARSP",
            allowed: false
        }

        if (!terminal) {
            console.warn(`Terminal not found : ${tid}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            })
        }
        const operator = await Operator.findOne({
            where: { id: terminal.operatorId },
            attributes: ["id", "per_min_price"]
        })

        const card = await RFIDCard.findOne({
            where: { cardNumber: cid }
        });

        if (!card) {
            console.warn(`RFID Card not found : ${cid}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            })
        }

        if (card.status !== "Active") {
            console.warn(`RFID Card blocked : ${card.id}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            })
        }

        const user = await User.findOne({
            where: { id: card.userId },
        });

        if (!user) {
            console.warn(`User not found : ${card.userId}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            })
        }

        if (user.status == "Blocked") {
            console.warn(`User blocked : ${card.userId}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            })
        }

        if (user.operatorId != terminal.operatorId) {
            console.warn(`User operator mismatch : ${card.userId}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            })
        }

        const userWallet = await Wallet.findOne({
            where: { userId: user.id, accountType: "User" }
        });

        if (userWallet.balance <= 0) {
            console.warn(`User wallet balance not enough : ${user.id}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            })
        }

        const associatedNumber = await UserAssociatedNumber.findAll({
            where: { userId: user.id },
            attributes: ["phoneNumber", "id"]
        });

        if (associatedNumber.length === 0) {
            console.warn(`Associated number not found : ${user.id}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            })
        }


        // Indian Timezone
        const indiaTime = moment().tz("Asia/Kolkata");

        const today = indiaTime.format("dddd");
        const currentTime = indiaTime.format("HH:mm");

        const activeDaysData = await UserActiveDay.findAll({
            where: { userId: user.id }
        });

        if (!activeDaysData) {
            console.warn(` User active days not found : ${user.id}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            });
        }

        const activeDays = activeDaysData.map(day => day.day);

        if (!activeDays.includes(today)) {
            console.warn(`User inactive today : ${user.id}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            });
        }


        const timeSlot = await UserTimeSlot.findOne({
            where: {
                userId: user.id,
                startTime: { [Op.lte]: currentTime },
                endTime: { [Op.gte]: currentTime },
                status: true
            }
        })

        // Active Time Validation
        if (!timeSlot) {
            console.warn(`User inactive at this time : ${user.id}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            });
        }

        // if (user.activeFrom && user.activeTo && (currentTime < user.activeFrom || currentTime > user.activeTo)) {
        //     console.warn(`User inactive at this time : ${user.id}`);
        //     return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
        //         if (err) {
        //             console.error('Error message:', err);
        //         }
        //     });
        // }


        // Today Call Usage
        const todayUsedSec = await CallLog.sum("duration", {
            where: {
                userId: user.id,
                createdAt: {
                    [Op.between]: [
                        indiaTime.clone().startOf("day").toDate(),
                        indiaTime.clone().endOf("day").toDate()
                    ]
                }
            }
        });
        const todayUsedMinutes = Math.ceil(todayUsedSec / 60);
        const usedMinutes = Number(todayUsedMinutes || 0);

        const leftMinutes = Math.max(Number(user.callDurationLimit) - usedMinutes, 0);

        if (leftMinutes <= 0) {
            console.warn(`Daily limit exceeded : ${user.id}`);
            logTerminalEvent(terminal.id, "Server", notAllowedResponse.type, notAllowedResponse);
            return client.publish(`${terminal.terminalId}`, JSON.stringify(notAllowedResponse), (err) => {
                if (err) {
                    console.error('Error message:', err);
                }
            })
        }

        const res = {
            type: "CARSP",
            name: user.fullName,
            credits: Number(userWallet?.balance || 0),
            card_type: "locked",
            day_max: Number(user.callDurationLimit),
            day_left: leftMinutes,
            numbers: associatedNumber.map(number => number.phoneNumber),
            allowed: true,
            pulse_rate: 60,
            unit_rate: Number(operator.per_min_price || 0),
        }
        logTerminalEvent(terminal.id, "Server", res.type, res);

        client.publish(`${terminal.terminalId}`, JSON.stringify(res), (err) => {
            if (err) {
                console.error('Error message:', err);
            }
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = { rfidHandler }