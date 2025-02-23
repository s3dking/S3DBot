const fs = require("fs").promises;
const path = require("path");
const Database = require("better-sqlite3");

async function validateSQLFile(client, filePath) {

  if (!filePath.toLowerCase().endsWith(".sql")) {
    throw new Error("Invalid file type. Please provide a .sql file.");
  }

  try {
    await fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK);
  } catch (error) {
    throw new Error(`File not accessible: ${filePath}. ${error.message}`);
  }

  const fileContent = await fs.readFile(filePath, "utf-8");
  const hasCreateTable = /CREATE\s+TABLE/i.test(fileContent);
  
  if (!hasCreateTable) {
    throw new Error("No CREATE TABLE statement found in the file.");
  }

  return true;
}

async function loadSQLFile(client, filePath) {
  client.logs.info(`Loading SQL file: ${filePath}`);
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return fileContent
      .replace(/^\s*--.*$/gm, '')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
}

async function setupDB(client) {
  const sqlFilePath = path.resolve(__dirname, "..", "DB", "Tables.sql");
  const dbPath = path.resolve(__dirname, "..", "DB", "Data.sqlite");

  try {
    await validateSQLFile(client, sqlFilePath);

    client.db = new Database(dbPath);

    const sqlStatements = await loadSQLFile(client, sqlFilePath);

    client.db.transaction(() => {
      for (const statement of sqlStatements) {
        client.db.prepare(statement).run();
      }
    })();

    client.logs.info('Database setup completed successfully.');
  } catch (error) {
    client.logs.error(`Error setting up database: ${error.message}`);
    if (client.db) {
      client.db.close();
    }
    throw error;
  }
}

module.exports = setupDB
