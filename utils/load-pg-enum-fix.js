// Fixes a bug with enum data types while syncing the database.
// The following was taken from the comment left by 'aristov' on Mar 5, 2020 in https://github.com/sequelize/sequelize/issues/7649

const PostgresQueryGenerator = require("sequelize/lib/dialects/postgres/query-generator");

module.exports = () => {
  PostgresQueryGenerator.prototype.pgEnum = function (
    tableName,
    attr,
    dataType,
    options
  ) {
    const enumName = this.pgEnumName(tableName, attr, options);
    let values;

    if (dataType.values) {
      values = `ENUM(${dataType.values
        .map((value) => this.escape(value))
        .join(", ")})`;
    } else {
      values = dataType.toString().match(/^ENUM\(.+\)/)[0];
    }

    let sql = `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_${tableName}_${attr}') THEN CREATE TYPE ${enumName} AS ${values}; END IF; END$$;`;
    if (!!options && options.force === true) {
      sql = this.pgEnumDrop(tableName, attr) + sql;
    }
    return sql;
  };
};
