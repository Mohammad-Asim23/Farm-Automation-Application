import db from "./DataBase";

const createTables = () => {
  db.transaction((tx) => {
    // Check if the "users" table exists in the database
    tx.executeSql(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="users"',
      [],
      (_, result) => {
        if (result.rows.length === 0) {
          // The "users" table does not exist, so create it
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)",
            [],
            () => {
              console.log('Table "users" created successfully');
            },
            (_, error) => {
              console.error('Error creating table "users":', error);
            }
          );
        } else {
          // The "users" table already exists, no need to create it again
          console.log('Table "users" already exists');
        }
      }
    );

    tx.executeSql(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="appliances"',
      [],
      (_, result) => {
        if (result.rows.length === 0) {
          // The "appliances" table does not exist, so create it
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS appliances (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, protocol TEXT, url TEXT, switchnumber TEXT)",
            [],
            () => {
              console.log('Table "appliances" created successfully');
            },
            (_, error) => {
              console.error('Error creating table "appliances":', error);
            }
          );
        } else {
          // The "appliances" table already exists
          console.log('Table "appliances" already exists');
        }
      }
    );

    // Check if other tables exist and create them if necessary
    ["appliance_records", "sensor_records"].forEach((tableName) => {
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type="table" AND name="${tableName}"`,
        [],
        (_, result) => {
          if (result.rows.length === 0) {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${
                tableName === "appliance_records"
                  ? "appliance_id INTEGER"
                  : "sensor_id INTEGER"
              }, status TEXT, timestamp DATETIME)`,
              [],
              () => {
                console.log(`Table "${tableName}" created successfully`);
              },
              (_, error) => {
                console.error(`Error creating table "${tableName}":`, error);
              }
            );
          } else {
            console.log(`Table "${tableName}" already exists`);
          }
        }
      );
    });
  });
};

export default createTables;
