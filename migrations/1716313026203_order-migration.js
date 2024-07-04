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
  pgm.createTable('order', {
    id: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
      primaryKey: true
    },
    table_number: {
      type: 'smallint',
      notNull: true
    },
    status: {
      type: 'varchar(255)',
      notNull: true
    },
    cpf: {
      type: 'varchar(11)'
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
  pgm.createTable('order_item', {
    item_id: {
      type: 'varchar(255)',
      notNull: true
    },
    order_id: {
      type: 'varchar(255)',
      notNull: true,
      references: '"order"',
      onDelete: 'cascade'
    },
    price: {
      type: 'decimal',
      notNull: true
    },
    quantity: {
      type: 'decimal',
      notNull: true
    }
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {}
