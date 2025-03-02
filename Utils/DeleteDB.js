const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'DB', 'Data.sqlite');

module.exports = async function resetDB(client) {
    if (!client || !client.db) {
        console.error('No database connection found in client');
        return;
    }

    try {
        const db = client.db;
        console.log('Starting database reset process...');

        // Get all table names
        const tables = db.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' 
            AND name NOT LIKE 'sqlite_%'
        `).all();

        if (tables.length === 0) {
            console.log('No tables found in database');
            return;
        }

        console.log(`Found ${tables.length} tables to process`);

        // Start transaction
        db.prepare('BEGIN TRANSACTION').run();

        try {
            // Backup all table data and schemas
            const tableData = {};
            const tableSchemas = {};
            
            for (const table of tables) {
                console.log(`Processing table: ${table.name}`);
                
                // Get table schema
                const schema = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`).get(table.name);
                tableSchemas[table.name] = schema.sql;
                
                // Backup table data
                const data = db.prepare(`SELECT * FROM ${table.name}`).all();
                tableData[table.name] = data;
                console.log(`Backed up ${data.length} rows from ${table.name}`);
            }

            // Drop and recreate each table
            db.prepare('PRAGMA foreign_keys = OFF').run();
            
            for (const table of tables) {
                db.prepare(`DROP TABLE IF EXISTS ${table.name}`).run();
                db.prepare(tableSchemas[table.name]).run();
                console.log(`Recreated table structure: ${table.name}`);
                
                // Restore data if table had any
                if (tableData[table.name].length > 0) {
                    const columns = Object.keys(tableData[table.name][0]).join(', ');
                    const placeholders = Object.keys(tableData[table.name][0]).map(() => '?').join(', ');
                    
                    const insert = db.prepare(`INSERT INTO ${table.name} (${columns}) VALUES (${placeholders})`);
                    
                    for (const row of tableData[table.name]) {
                        insert.run(...Object.values(row));
                    }
                    console.log(`Restored ${tableData[table.name].length} rows to ${table.name}`);
                }
            }

            db.prepare('PRAGMA foreign_keys = ON').run();
            
            // Commit transaction
            db.prepare('COMMIT').run();
            console.log('Database reset completed successfully');

        } catch (error) {
            // Rollback on error
            db.prepare('ROLLBACK').run();
            throw error;
        }

    } catch (error) {
        console.error('Error during database reset:', error);
        throw error;
    }
}
