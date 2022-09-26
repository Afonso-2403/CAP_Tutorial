const winston = require('winston');
// const ecsFormat = require('@elastic/ecs-winston-format')


module.exports =  {
    create_logger: function({
        level='info',
        format=winston.format.combine(winston.format.timestamp(), winston.format.json()),
        // format= ecsFormat(),
        defaultMeta= { service: 'user-service' },
        transports= [
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