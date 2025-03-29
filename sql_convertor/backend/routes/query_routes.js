const express = require("express");
const router = express.Router();
const axios = require("axios");
const { error, Console } = require("console");
const { get_table_schema } = require("../utils/utils.js")
const sqlite3 = require("sqlite3").verbose();
const authenticate=require("../middleware/auth.js");
const db = new sqlite3.Database("./database/database.db");

//------cleans up the the response recieved from python llm script-----------------
function extract_sql_query(response_text) {
    console.log("Raw LLM Response:", response_text);

    // Use a regex to find the first SQL query starting with a keyword and ending with a semicolon.
    const regex = /\b(SELECT|INSERT|UPDATE|DELETE)\b[\s\S]*?;/i;
    const match = regex.exec(response_text);
    
    if (match) {
        return match[0].trim();
    }
    
    console.error("Failed to extract SQL query!");
    return null;
}



//----- honestly this is not needed , it could be a simple function but since it was explicitly mentioned to create end point i have done so.
router.post("/validate", async (req, res) => {
    try {
        const { query } = req.body;
        db.get(`EXPLAIN QUERY PLAN ${query}`, [], (err, row) => {
            if (err) {
                return res.status(400).json({ valid: false, error: err.message });
            }
            res.json({ valid: true, details: row });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/query", authenticate,async (req, res) => {
    try {
        const { query, table } = req.body;

        if (!table) {
            return res.status(400).json({ error: "Table name is required." });
        }
        const schema = await get_table_schema(table); 
        console.log(schema);
        const response = await axios.post("http://127.0.0.1:5000/query", { query, schema });
        const sql_query = extract_sql_query(response.data.sql_query);
        console.log("Extracted SQL Query:", sql_query);
        const validateResponse = await axios.post("http://localhost:3000/api/validate", { query: sql_query });

        if (!validateResponse.data.valid) {
            return res.status(400).json({ error: "Invalid SQL Query", details: validateResponse.data.error });
        }
        db.all(sql_query, [], (err, rows) => {
            if (err) {
                console.error("SQLite Error:", err.message);
                return res.status(400).json({ error: "Invalid SQL Query", details: err.message });
            }
            res.json({ sql: sql_query, result: rows });
        });

    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;