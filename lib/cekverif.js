const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'user.json');

const loadUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

module.exports = async function (req, res) {
    const { iduser } = req.query;

    if (!iduser) {
        return res.status(400).json({ error: "Parameter iduser harus diisi." });
    }

    const users = loadUsers();
    const userData = users.find(user => user.iduser === iduser);

    if (userData) {
        return res.json({
            verified: true,
            nama: userData.username
        });
    } else {
        return res.json({
            verified: false,
            nama: null
        });
    }
};
