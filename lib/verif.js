const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

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

const sendEmail = async ({ iduser, username, idchat, ip }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Verifikasi Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.RECEIVER_EMAIL,
        subject: 'User Baru Diverifikasi',
        text: `User baru telah diverifikasi:\n\nID: ${iduser}\nUsername: ${username}\nChat ID: ${idchat}\nIP Address: ${ip}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email verifikasi terkirim');
    } catch (error) {
        console.error('Gagal kirim email:', error);
    }
};

module.exports = async function (req, res) {
    const { iduser, username, idchat } = req.query;

    if (!iduser || !username || !idchat) {
        return res.status(400).json({ error: "Parameter iduser, username, dan idchat harus diisi." });
    }

    let users = loadUsers();

    const alreadyExists = users.some(user => user.iduser === iduser);
    if (alreadyExists) {
        return res.status(400).json({ error: "ID sudah terverifikasi sebelumnya." });
    }

    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const newUser = { iduser, username, idchat };
    users.push(newUser);
    saveUsers(users);

    await sendEmail({ ...newUser, ip: userIP });

    return res.json({ success: true, message: "Berhasil diverifikasi dan email terkirim." });
};
