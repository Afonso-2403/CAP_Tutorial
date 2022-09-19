const winston = require('winston');

module.exports =  {
    create_logger: function({
        level="info", 
        format=winston.format.combine(winston.format.timestamp(), winston.format.json()),
        defaultMeta = { service: 'user-service' },
        transports = [
            new winston.transports.Console(),
          ],
    }){
        return winston.createLogger({
            level: level,
            format: format,
            defaultMeta: defaultMeta,
            transports: transports,
        });        
    }
}