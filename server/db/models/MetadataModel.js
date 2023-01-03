module.exports = {
    fields: {
        name_registration: 'text',
        registration_id: 'text',
        length_court: 'int',
        width_court: 'int',
        timestamp: 'timestamp',
        end_registration_timestamp: 'timestamp',
        squads: {
            type: 'frozen',
            typeDef: '<squads>'
        }
    },
    key: ['registration_id'],
    table_name: 'reg_metadata'
}