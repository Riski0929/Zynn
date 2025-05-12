const fs = require('fs');
const path = require('path');

const GAMES_FILE = path.join(__dirname, 'tebakbom.json');
const GAME_TIMEOUT = 2 * 60 * 1000; // 30 menit

const initialBoard = () => ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];

const generatePetak = (bombCount) => {
    const petak = Array(10).fill(0);
    for (let i = 0; i < bombCount; i++) petak[i] = 2;
    return petak.sort(() => Math.random() - 0.5);
};

const formatBoard = (board) => board.slice(0, 5).join('') + '\n' + board.slice(5).join('');

const loadGames = () => {
    try {
        const data = fs.readFileSync(GAMES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return {};
    }
};

const saveGames = (games) => {
    fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2), 'utf8');
};

const cleanupGames = (games) => {
    const now = Date.now();
    for (const username in games) {
        if (games[username].ended || (now - games[username].lastMoveTime > GAME_TIMEOUT)) {
            delete games[username];
        }
    }
};

module.exports = async function(req, res) {
    const username = req.query.username;
    const start = req.query.start;
    const move = req.query.move;

    if (!username) {
        return res.status(400).json({ error: "Kamu belum isi parameter username." });
    }

    let games = loadGames();
    cleanupGames(games);
    let userGame = games[username];

    if (start) {
        let lives = 3;
        let bomb = 3;
        if (start === 'medium') {
            lives = 2;
            bomb = 4;
        } else if (start === 'hard') {
            lives = 1;
            bomb = 5;
        } else if (start !== 'easy') {
            return res.status(400).json({ error: "Level tidak valid. Gunakan 'easy', 'medium', atau 'hard'." });
        }

        userGame = {
            board: initialBoard(),
            petak: generatePetak(bomb),
            bomb,
            lolos: 10 - bomb,
            pick: 0,
            lives,
            opened: [],
            ended: false,
            lastMoveTime: Date.now()
        };

        games[username] = userGame;
        saveGames(games);

        return res.json({
            papan: formatBoard(userGame.board),
            lives: '❤️'.repeat(lives),
            level: start,
            bomb: bomb,
            status: 'ongoing',
            menang: false,  // Menambahkan properti menang untuk status game
            usermenang: false // Menambahkan properti usermenang yang false di awal
        });
    } else if (move) {
        if (!userGame || userGame.ended) {
            return res.status(400).json({ error: "Belum mulai game. Pakai parameter 'start' dulu." });
        }

        const moveIndex = parseInt(move, 10) - 1;
        if (isNaN(moveIndex) || moveIndex < 0 || moveIndex >= 10) {
            return res.status(400).json({ error: "Pilihan harus angka 1 sampai 10." });
        }

        if (userGame.opened.includes(moveIndex)) {
            return res.status(400).json({ error: "Petak itu sudah dibuka." });
        }

        userGame.opened.push(moveIndex);
        userGame.lastMoveTime = Date.now();

        if (userGame.petak[moveIndex] === 2) {
            userGame.board[moveIndex] = '💣';
            userGame.lives--;
        } else {
            userGame.board[moveIndex] = '🌀';
            userGame.pick++;
        }

        let status = 'ongoing';
        let menang = false;
        let usermenang = false;

        if (userGame.lives <= 0) {
            userGame.ended = true;
            status = 'lose';
            menang = false;
            usermenang = false;
        } else if (userGame.pick >= userGame.lolos) {
            userGame.ended = true;
            status = 'win';
            menang = true;
            usermenang = true;  // Pemain menang
        }

        if (userGame.ended) {
            delete games[username];
        } else {
            games[username] = userGame;
        }
        saveGames(games);

        return res.json({
            papan: formatBoard(userGame.board),
            lives: '❤️'.repeat(userGame.lives),
            bomb: '💣'.repeat(userGame.bomb),
            status,
            menang, // Status kemenangan umum
            usermenang // Status kemenangan pengguna
        });
    } else {
        return res.status(400).json({ error: "Harus pakai parameter 'start' atau 'move'." });
    }
};
