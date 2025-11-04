import query from "../../db.js";


const readData = async () => {
    try {
        const result = await query(`SELECT * FROM logs`)
        if (result.rows.length === 0) {
            throw new Error("Table is empty");
        }

        console.log(`Query executed successfully ${result.rows.length} rows returned`)

    } catch (err) {
        console.error(err)
    }
}

readData()