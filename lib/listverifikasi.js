const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'user.json');

module.exports = async function(req, res) {
    try {
        const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));

        if (!Array.isArray(data)) {
            return res.status(500).json({ error: 'Format data salah. Harus array.' });
        }

        const verifiedUsers = data.map(u => ({
            iduser: u.iduser,
            nama: u.username
        }));

        return res.json({
            total: verifiedUsers.length,
            verified: verifiedUsers
        });

    } catch (err) {
        return res.status(500).json({ error: 'Gagal membaca data.' });
    }
};
