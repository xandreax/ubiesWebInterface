module.exports = {
    fields: {
        registration_id: 'text',
        protocol: 'int',
        timestamp: 'timestamp',
        id: 'int',
        temp: 'double',
        batt: 'double',
        position: {
            type: "list",
            typeDef: "<int>"
        },
        hposition: {
            type: "list",
            typeDef: "<int>"
        },
        acc: {
            type: "list",
            typeDef: "<double>"
        },
        gyro: {
            type: "list",
            typeDef: "<double>"
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
    key: [['registration_id'],'timestamp'],
    table_name: 'reg_data'
}