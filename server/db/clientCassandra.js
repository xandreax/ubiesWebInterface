const models = require('express-cassandra');
const cassandra_config = require("./cassandra_config");
models.setDirectory(__dirname+'/models').bind(
    {
        clientOptions: {
            contactPoints: [cassandra_config.contactPoints],
            localDataCenter: cassandra_config.localDataCenter,
            keyspace: cassandra_config.keyspace,
            protocolOptions: {port: 9042},
            queryOptions: {consistency: models.consistencies.one},
            socketOptions: {readTimeout: 60000},
        },
        ormOptions: {
            defaultReplicationStrategy: {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            migration: 'safe',
            udts: {
                player: {
                    name: 'text',
                    id_tag: 'int',
                    kit_number: 'int',
                    team: 'text'
                },
                team: {
                    name: 'text',
                    colour: 'text'
                },
                squads: {
                    teams: 'set<frozen<team>>',
                    players: 'set<frozen<player>>'
                }
            },
        }
    },
    function (err) {
        if (err) throw err;
        // You'll now have a `person` table in cassandra created against the models
        // schema you've defined earlier and you can now access the models instance
        // in `models.instance.Person` object containing supported orm operations.
    }
);
module.exports = models;