/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
  pgm.createTable('customer', {
    id: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
      primaryKey: true
    },
    name: {
      type: 'varchar(100)',
      notNull: true
    },
    cpf: {
      type: 'varchar(11)',
      notNull: true,
      unique: true
    },
    phone: {
      type: 'varchar(11)',
      notNull: true
    }
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => { }
