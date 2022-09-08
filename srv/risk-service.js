
const cds = require('@sap/cds')
const logger_creator = require('./utilities/my_logger')
const custom_winston_logger = logger_creator.create_logger({
    defaultMeta: { service: 'risk-service' }
})
/**
 * Implementation for Risk Management service defined in ./risk-service.cds
 */
module.exports = cds.service.impl(async function() {

    this.before('READ', 'Risks', (req) => {
        custom_winston_logger.log({level: 'error', message: 'Just to test logging an error before request: ' + req})
    });

    this.before('READ', 'Risks', (req) => {
        custom_winston_logger.info({message: 'Just to test logging upon request: ' + req})
    });

    this.after('READ', 'Risks', risksData => {
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