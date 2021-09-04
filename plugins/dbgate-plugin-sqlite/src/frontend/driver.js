const { driverBase } = global.DBGATE_TOOLS;
const Dumper = require('./Dumper');
const { sqliteSplitterOptions, noSplitSplitterOptions } = require('dbgate-query-splitter/lib/options');

function getDatabaseFileLabel(databaseFile) {
  if (!databaseFile) return databaseFile;
  const m = databaseFile.match(/[\/]([^\/]+)$/);
  if (m) return m[1];
  return databaseFile;
}

/** @type {import('dbgate-types').SqlDialect} */
const dialect = {
  limitSelect: true,
  rangeSelect: true,
  offsetFetchRangeSyntax: false,
  explicitDropConstraint: true,
  stringEscapeChar: "'",
  fallbackDataType: 'nvarchar(max)',
  dropColumnDependencies: ['indexes', 'primaryKey'],
  quoteIdentifier(s) {
    return `[${s}]`;
  },

  createColumn: true,
  dropColumn: true,
  createIndex: true,
  dropIndex: true,
  createForeignKey: false,
  dropForeignKey: false,
  createPrimaryKey: false,
  dropPrimaryKey: false,
};

/** @type {import('dbgate-types').EngineDriver} */
const driver = {
  ...driverBase,
  dumperClass: Dumper,
  dialect,
  engine: 'sqlite@dbgate-plugin-sqlite',
  title: 'SQLite',
  showConnectionField: (field, values) => field == 'databaseFile',
  showConnectionTab: (field) => false,
  beforeConnectionSave: (connection) => ({
    ...connection,
    singleDatabase: true,
    defaultDatabase: getDatabaseFileLabel(connection.databaseFile),
  }),
  getQuerySplitterOptions: (usage) => (usage == 'stream' ? noSplitSplitterOptions : sqliteSplitterOptions),
  // isFileDatabase: true,
  isElectronOnly: true,
};

module.exports = driver;
