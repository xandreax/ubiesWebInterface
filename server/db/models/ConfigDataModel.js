module.exports = {
    fields: {
        registration_id: 'varchar',
        protocol: 'int',
        timestamp: 'timestamp',
        A0: {
            type: "list",
            typeDef: "<int>"
        },
        A1: {
            type: "list",
            typeDef: "<int>"
        },
        A2: {
            type: "list",
            typeDef: "<int>"
        },
        A3: {
            type: "list",
            typeDef: "<int>"
        },
        A4: {
            type: "list",
            typeDef: "<int>"
        },
        A5: {
            type: "list",
            typeDef: "<int>"
        },
        A6: {
            type: "list",
            typeDef: "<int>"
        },
        A7: {
            type: "list",
            typeDef: "<int>"
        }
    },
    key: [['registration_id'], 'timestamp'],
    table_name: 'reg_config_data'
}