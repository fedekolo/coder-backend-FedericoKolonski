const optionsSQlite3 = {
    client: 'sqlite3',
    connection: {
        filename: './mydb.sqlite'
    },
    useNullAsDefault: true
}

console.log('Conectando a la base de datos SQlite3...');

module.exports = {
    optionsSQlite3
}