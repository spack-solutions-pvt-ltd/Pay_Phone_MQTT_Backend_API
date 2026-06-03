
const cron = require("node-cron");
const { Op } = require("sequelize");
const { TerminalLog, RefreshToken } = require("../models");

cron.schedule("0 2 * * *", async () => {
    try {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        const deletedCount = await TerminalLog.destroy({
            where: { createdAt: { [Op.lt]: fiveDaysAgo, }, },
        });

        console.log(`Terminal Logs Cleanup: Deleted ${deletedCount} logs older than 5 days.`);

        const refreshTokenDeletedCount = await RefreshToken.destroy({
            where: { expire: { [Op.lt]: new Date(), }, },
        });

        console.log(`Refresh Token Cleanup: Deleted ${refreshTokenDeletedCount} refresh tokens.`);

    } catch (error) {
        console.error("[TerminalLog Cleanup Error]", error);
    }
});
