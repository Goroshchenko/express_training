var config = {
    local: {
        mode: 'local',
        port: 1500,
        mongo: {
            host: '192.168.28.129',
            port: 1999
        }
    },
    staging: {
        mode: 'staging',
        port: 2500,
        mongo: {
            host: '192.168.28.129',
            port: 1999
        }
    },
    production: {
        mode: 'production',
        port: 3500,
        mongo: {
            host: '192.168.28.129',
            port: 1999
        }
    }
}
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}