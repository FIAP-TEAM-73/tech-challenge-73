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
  pgm.createTable('item', {
    id: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
      primaryKey: true
    },
    name: {
      type: 'varchar(255)',
      notNull: true
    },
    category: {
      type: 'varchar(100)',
      notNull: true
    },
    price: {
      type: 'decimal'
    },
    description: {
      type: 'varchar',
      notNull: true
    },
    is_active: {
      type: 'bool',
      notNull: true,
      default: true
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
  pgm.createTable('item_image', {
    id: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
      primaryKey: true
    },
    item_id: {
      type: 'varchar(255)',
      notNull: true,
      references: 'item',
      onDelete: 'cascade'
    },
    base64: {
      type: 'bytea'
    },
    storage_path: {
      type: 'varchar'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {}
