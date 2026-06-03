
const cron = require("node-cron");
const { Op } = require("sequelize");
const { TerminalLog } = require("../models");

cron.schedule("0 2 * * *", async () => {
    try {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        const deletedCount = await TerminalLog.destroy({
            where: { createdAt: { [Op.lt]: fiveDaysAgo, }, },
        });

    } catch (error) {
        console.error("[TerminalLog Cleanup Error]", error);
    }
});
