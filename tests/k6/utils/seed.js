const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const { config } = require('dotenv');
config();

async function seedPhotos(batchSize = 500) {
    const filePath = path.join(__dirname, '../data/photos.json');
    const photosData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'user',
        password: 'password',
        database: 'lumen'
    });

    try {
        const [rows] = await connection.execute('SELECT id FROM user ORDER BY id ASC LIMIT 1');
        if (rows.length === 0) {
            throw new Error('Nenhum usuário encontrado.');
        }

        const userId = rows[0].id;
        await connection.execute('DELETE FROM photo');

        for (let i = 0; i < photosData.length; i += batchSize) {
            const batch = photosData.slice(i, i + batchSize);

            const values = [];
            const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');

            const data = new Date();
            const [rows] = await connection.execute('SELECT MAX(id) AS maxId FROM photo');
            let lastId = rows[0].maxId || 0;
            batch.forEach(({ url, caption }, index) => {
                values.push(lastId + index + 1, userId, url, caption, 0, 0, data, data);
            });


            const query = `INSERT INTO photo (id, userId, path, caption, width, height, updatedAt, createdAt) VALUES ${placeholders}`;
            await connection.execute(query, values);
            console.log(`Inseridos ${batch.length} fotos (batch ${i / batchSize + 1})`);
        }

        console.log(`✅ Todas as ${photosData.length} fotos foram inseridas com sucesso!`);
    } catch (error) {
        console.error('Erro ao inserir fotos:', error);
    } finally {
        await connection.end();
    }
}

seedPhotos();
