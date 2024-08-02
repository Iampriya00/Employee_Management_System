import pg from "pg";
import dotenv from "dotenv";

const saltRounds = 10;
dotenv.config();

const db = new pg.Client({
    user: "administrator_verifiedresume",
    host: "verifiedresumepostgre.postgres.database.azure.com",
    database: "db_rcc_employee",
    password: "0T)-m0!>Qk/@n/poz523",
    port: 5432
});
db.connect(err => {
    if (err) {
        console.log("Error establishing Connection", err);
    } else {
        console.log("Connection Succesfull")
    }
});

export default db;
