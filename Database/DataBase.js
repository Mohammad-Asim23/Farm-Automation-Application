import * as SQLite from 'expo-sqlite';



const db = SQLite.openDatabase('farm_Database.db');

console.log('Database opened ');


export default db;
