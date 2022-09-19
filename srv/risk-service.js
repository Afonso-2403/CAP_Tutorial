
const cds = require('@sap/cds')
const logger_creator = require('./utilities/my_logger');
const custom_winston_logger = logger_creator.create_logger({
    level: 'info',
    defaultMeta: { service: 'risk-service' }
});
const CDS_LOG = cds.log('risk-service');

/**
 * Implementation for Risk Management service defined in ./risk-service.cds
 */
module.exports = cds.service.impl(async function() {

    this.before('READ', 'Risks', (req) => {
        custom_winston_logger.log({level: 'error', message: 'Just to test logging an error before request from winston: ' + req})
        CDS_LOG.log('from cds built-in logger')
        CDS_LOG.error('an error from cds built-in logger')
        console.log('From the console')
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