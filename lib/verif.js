// verif.js
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

const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

module.exports = async function (req, res) {
    const { iduser, username, idchat } = req.query;

    if (!iduser || !username || !idchat) {
        return res.status(400).json({ error: "Parameter iduser, username, dan idchat harus diisi." });
    }

    let users = loadUsers();

    // Cek apakah iduser sudah ada
    const alreadyExists = users.some(user => user.iduser === iduser);

    if (alreadyExists) {
        return res.status(400).json({ error: "ID sudah terverifikasi sebelumnya." });
    }

    users.push({ iduser, username, idchat });
    saveUsers(users);

    return res.json({ success: true, message: "Berhasil diverifikasi." });
};
