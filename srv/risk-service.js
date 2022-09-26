const cds = require('@sap/cds')

const CDS_LOG = cds.log('risk-service');

const cf_log = require("cf-nodejs-logging-support");

const winston = require('winston');
const custom_winston_logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [cf_log.createWinstonTransport()],
    defaultMeta: { service: 'risk-service' }
});

/**
 * Implementation for Risk Management service defined in ./risk-service.cds
 */


module.exports = cds.service.impl(async function() {

    this.before('READ', 'Risks', (req) => {
        custom_winston_logger.log({level: 'error', message: 'Just to test logging an error before request from winston: ' + req})
        custom_winston_logger.info('Info before request from winston')

        CDS_LOG.error('an error from cds built-in logger: shows as info, not anymore!')

        console.log('From the console: limited usage')

        cf_log.warn('A warning from the cf-nodejs-logging-support logger')
    });


/*
// How to forward the request? This way I get the error "Path expressions in query options are not supported on SQLite"
    this.on('READ', 'Risks', (req) => {
        CDS_LOG.warn({message: 'Test logging warn upon request from cds built-in logger: ' + req})
        cds.tx(req).run(req.query)
    });
*/

    this.after('READ', 'Risks', (risksData) => {
        const risks = Array.isArray(risksData) ? risksData : [risksData];
        risks.forEach(risk => {
            if (risk.impact >= 100000) {
                risk.criticality = 1;
            } else {
                risk.criticality = 2;
            }
        });
    });
});