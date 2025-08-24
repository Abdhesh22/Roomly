const CronJobService = require("../../services/cron-job.service");
const cron = require("node-cron");

class CronJobController {
    #cronJobService;

    constructor() {
        this.#cronJobService = new CronJobService();
    }

    #scheduleJob(cronKey, cronFunction) {
        cron.schedule(cronKey, async () => {
            try {
                await cronFunction();
            } catch (err) {
                console.error(`[CRON] Error running job for ${cronKey}:`, err);
            }
        });
        console.log(`[CRON] Job scheduled with cronKey: "${cronKey}" for function: "${cronFunction.name}"`);
    }


    initCron() {
        // Auto Check-In Cron
        this.#scheduleJob(process.env.CRON_CHECK_IN, this.#cronJobService.checkIn.bind(this.#cronJobService));

        // Auto Check-Out Cron
        this.#scheduleJob(process.env.CRON_CHECK_OUT, this.#cronJobService.checkOut.bind(this.#cronJobService));
    }
}

module.exports = CronJobController;