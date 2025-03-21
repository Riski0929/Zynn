const express = require('express');
const router = express.Router();
const axios = require('axios');
const { alldown } = require('alldown');
const { handleTextQuery } = require('../lib/ai.js');
const { pin } = require('../lib/pinterest.js');
const { jadwal } = require('../lib/animeJadwal.js');
const crypto = require('crypto');
const alicia = require('../lib/alicia.js');
const gq = require('../lib/genrateQuery.js');
const snapsave = require('../lib/snapsave.js')
const speechma = require('../lib/speechma.js')
const imagine = require('../lib/imagine.js')
const gemini = require('../lib/toolbaz.js')
const luminai = require('../lib/luminai.js')
const rmbg = require('../lib/removebg.js')

router.get('/removebg', rmbg)
router.get('/luminai', luminai)
router.get('/gemini',gemini)

router.get('/soundoftext', async (req, res) => {
  const text = req.query.text;
  if (!text) {
    return res.status(400).send('Parameter "text" is required.');
  }

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.soundoftext.com/sounds',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Origin': 'https://soundoftext.com',
        'Referer': 'https://soundoftext.com/',
        'Sec-Ch-Ua': '"Not A(Brand";v="8", "Chromium";v="132"',
        'Sec-Ch-Ua-Mobile': '?1',
        'Sec-Ch-Ua-Platform': '"Android"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
      },
      data: {
        engine: 'Google',
        data: {
          text: text,
          voice: 'id-ID',
        },
      },
    });
    response.data.id = "https://files.soundoftext.com/"+response.data.id+".mp3"
    res.succesJson(response.data.id);
  } catch (error) {
    console.error('Error calling Sound of Text API:', error);
    if (error.response) {
      res.errorJson(error.response.data);
    } else {
      res.errorJson('Internal Server Error');
    }
  }
});

router.get('/deepseek', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const response = await axios.post(
      'https://www.multichatai.com/api/chat/deepinfra',
      {
        chatSettings: {
          model: 'deepseek-ai/DeepSeek-R1',
          prompt: 'You are a friendly, helpful AI assistant.',
          temperature: 0.5,
          contextLength: 32000,
          includeProfileContext: true,
          includeWorkspaceInstructions: true,
          embeddingsProvider: 'openai',
        },
        messages: [
          {
            role: 'user',
            content: query,
          },
        ],
        customModelId: '',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': 'en-US,en;q=0.9,en-GB;q=0.8,en-IN;q=0.7',
          'cache-control': 'no-cache',
          'pragma': 'no-cache',
          'priority': 'u=1, i',
          'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'referrer': 'https://www.multichatai.com/1ed886c3-9f08-4090-9e44-123456/chat?model=claude-3-5-sonnet',
          'referrerPolicy': 'strict-origin-when-cross-origin',
        },
      }
    );

    res.succesJson(response.data);
  } catch (error) {
    console.error('Error calling Deepinfra API:', error);
    res.errorJsonjson({ error: 'Failed to process the request' });
  }
});

router.get('/speechma', speechma);
router.get('/brats', async (req, res) => {
  const host = req.query.host;
  const text = req.query.text;

  if (!host || !text) {
    return res.errorJson({ error: "Parameter 'host' dan 'text' harus disediakan." });
  }

  try {
    const apiUrl = `https://express-vercel-ytdl.vercel.app/brats?host=${encodeURIComponent(host)}&text=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl, { responseType: 'stream' });
    res.setHeader('Content-Type', 'image/png');
    response.data.pipe(res);
  } catch (error) {
    console.error("Error fetching or streaming brats image:", error);
    res.errorJson({ error: "Gagal mengambil atau mengirim gambar brats." });
  }
});

router.get('/artinama', async (req, res) => {
  const nama = req.query.nama;

  if (!nama) {
    return res.errorJson({ error: "Parameter 'nama' harus disediakan." });
  }

  try {
    const apiUrl = `https://express-vercel-ytdl.vercel.app/arti?nama=${encodeURIComponent(nama)}`;
    const response = await axios.get(apiUrl, { responseType: 'stream' });

    res.setHeader('Content-Type', 'image/jpeg');
    response.data.pipe(res);
  } catch (error) {
    console.error("Error fetching or streaming khodam image:", error);
    res.errorJson({ error: "Gagal mengambil atau mengirim gambar khodam." });
  }
});

router.get('/khodam', async (req, res) => {
  const nama = req.query.nama;

  if (!nama) {
    return res.errorJson({ error: "Parameter 'nama' harus disediakan." });
  }

  try {
    const apiUrl = `https://express-vercel-ytdl.vercel.app/khodam?nama=${encodeURIComponent(nama)}`;
    const response = await axios.get(apiUrl, { responseType: 'stream' });

    res.setHeader('Content-Type', 'image/jpeg');
    response.data.pipe(res);
  } catch (error) {
    console.error("Error fetching or streaming khodam image:", error);
    res.errorJson({ error: "Gagal mengambil atau mengirim gambar khodam." });
  }
});

router.get('/snapsave', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.errorJson({ error: "Parameter 'url' harus disediakan." });
  }
  try {
    await snapsave(req, res);
  } catch (error) {
    console.error("Error processing snapsave request:", error);
    res.errorJson({ error: "Terjadi kesalahan saat memproses permintaan snapsave." });
  }
});


router.get('/imagine', imagine)

router.get('/simsimi', async (req, res) => {
  const msg = req.query.msg;
  const id = req.query.lang || "id";

  if (!msg) {
    return res.errorJson({ error: "Parameter 'msg' harus disediakan." });
  }

  try {
    const response = await axios.post('https://simsimi.vn/web/simtalk', `text=${encodeURIComponent(msg)}&lc=${id}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.succesJson({ respon: response.data.success });
  } catch (error) {
    console.error("Error calling SimSimi API:", error);
    res.errorJson({ error: "Terjadi kesalahan saat memproses permintaan SimSimi." });
  }
});

router.get('/generate-query', async (req, res) => {
  const user = req.query.user;
  const msg = req.query.msg;

  if (!user || !msg) {
    return res.errorJson({ error: "Parameter 'user' dan 'msg' harus disediakan." });
  }

  try {
    let response = await gq.botika(user, msg);
    response = response.replace(/Alicia:/i, "").trim();
    res.succesJson(JSON.parse(response));
  } catch (error) {
    console.error("Error calling alicia.botika:", error);
    res.errorJson({ error: "Terjadi kesalahan saat memproses permintaan." });
  }
});

router.get('/alicia', async (req, res) => {
  const user = req.query.user;
  const msg = req.query.msg;

  if (!user || !msg) {
    return res.errorJson({ error: "Parameter 'user' dan 'msg' harus disediakan." });
  }

  try {
    let response = await alicia.botika(user, msg);
    response = response.replace(/Alicia:/i, "").trim();
    res.succesJson({ response });
  } catch (error) {
    console.error("Error calling alicia.botika:", error);
    res.errorJson({ error: "Terjadi kesalahan saat memproses permintaan." });
  }
});

router.get('/ytdl', async (req, res) => {
  const link = req.query.url;
  const format = req.query.format || '360';
  const availableFormats = ['144', '240', '360', '480', '720', '1080', 'mp3'];
  const headers = {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
  };
  
  if (!link) return res.errorJson({ error: "Linknya mana? Yakali download kagak ada linknya 🗿" });
  try {
    new URL(link);
  } catch (_) {
    return res.json({ error: "Lu masukin link apaan sih 🗿 Link Youtube aja bree, kan lu mau download youtube 👍🏻" });
  }
  if (!availableFormats.includes(format)) return res.json({ error: "Formatnya kagak ada bree, pilih yang udah disediain aja yak, jangan nyari yang gak ada 🗿", availableFormats });
  
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/
  ];
  let id = null;
  for (let pattern of patterns) {
    if (pattern.test(link)) {
      id = link.match(pattern)[1];
      break;
    }
  }
  if (!id) return res.errorJson({ error: "Kagak bisa ekstrak link youtubenya nih, btw link youtubenya yang bener yak.. biar kagak kejadian begini lagi 😂" });
  
  try {
    const getCDN = await axios.get("https://media.savetube.me/api/random-cdn", { headers });
    const cdn = getCDN.data.cdn;
    const infoResponse = await axios.post(`https://${cdn}/v2/info`, { url: `https://www.youtube.com/watch?v=${id}` }, { headers });
    const encData = infoResponse.data.data;
    
    const secretKey = Buffer.from("C5D58EF67A7584E4A29F6C35BBC4EB12", "hex");
    const bufferData = Buffer.from(encData, "base64");
    const iv = bufferData.slice(0, 16);
    const content = bufferData.slice(16);
    const decipher = crypto.createDecipheriv("aes-128-cbc", secretKey, iv);
    let decrypted = decipher.update(content);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const videoInfo = JSON.parse(decrypted.toString());
    
    const downloadResponse = await axios.post(`https://${cdn}/download`, {
      id,
      downloadType: format === 'mp3' ? 'audio' : 'video',
      quality: format === 'mp3' ? '128' : format,
      key: videoInfo.key
    }, { headers });
    
    return res.json({
      success: true,
      title: videoInfo.title || "Gak tau 🤷🏻",
      type: format === 'mp3' ? 'audio' : 'video',
      format: format,
      thumbnail: videoInfo.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
      download: downloadResponse.data.data.downloadUrl,
      id: id,
      key: videoInfo.key,
      duration: videoInfo.duration,
      quality: format === 'mp3' ? '128' : format,
      downloaded: downloadResponse.data.data.downloaded || false
    });
    
  } catch (error) {
    return res.errorJson({ error: error.message });
  }
});

router.get('/memegen', async (req, res) => {
  const { text_atas, text_bawah, background } = req.query;
  let url = 'https://api.memegen.link/images/custom';
  if (text_atas || text_bawah) {
    const atas = text_atas ? encodeURIComponent(text_atas) : ' ';
    const bawah = text_bawah ? encodeURIComponent(text_bawah) : ' ';
    url += `/${atas}/${bawah}.png`;
  } else {
    return res.errorJson({ error: 'Parameter text-atas atau text-bawah harus diisi.' });
  }
  if (background) {
    url += `?background=${encodeURIComponent(background)}`;
  }
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    res.set('Content-Type', 'image/png');
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('Error saat memanggil API memegen:', error);
    res.errorJson({ error: 'Terjadi kesalahan saat memproses permintaan.' });
  }
});

router.get('/autogempa', async (req, res) => {
  try {
    const response = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
    const data = response.data;
    if (data && data.Infogempa && data.Infogempa.gempa) {
      data.Infogempa.gempa.Shakemap = "https://data.bmkg.go.id/DataMKG/TEWS/" + data.Infogempa.gempa.Shakemap;
      res.succesJson(data.Infogempa.gempa);
    } else {
      res.errorJson({ message: 'Data tidak ditemukan atau format tidak valid.' });
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data autogempa:', error);
    if (error.response) {
      res.errorJson({ message: `Kesalahan server: ${error.response.statusText}` });
    } else if (error.request) {
      res.errorJson({ message: 'Tidak dapat terhubung ke server BMKG.' });
    } else {
      res.errorJson({ message: 'Terjadi kesalahan saat mengambil data autogempa.' });
    }
  }
});

router.get('/susunkata', async (req, res) => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/BochilTeam/database/refs/heads/master/games/susunkata.json');
    const data = response.data;
    if (Array.isArray(data) && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomItem = data[randomIndex];
      res.succesJson(randomItem);
    } else {
      res.errorJson({ message: 'Data tidak ditemukan atau format tidak valid.' });
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data:', error);
    res.errorJson({ message: 'Terjadi kesalahan saat mengambil data.' });
  }
});

router.get('/asahotak', async (req, res) => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/BochilTeam/database/refs/heads/master/games/asahotak.json');
    const data = response.data;
    if (Array.isArray(data) && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomItem = data[randomIndex];
      res.succesJson(randomItem);
    } else {
      res.errorJson({ message: 'Data tidak ditemukan atau format tidak valid.' });
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data:', error);
    res.errorJson({ message: 'Terjadi kesalahan saat mengambil data.' });
  }
});

router.get('/savetube', async (req, res) => {
  const { url, format } = req.query;
  if (!url) return res.errorJson("Masukkan parameter url");
  if (!format) return res.errorJson("Masukkan parameter format");
  try {
    const response = await axios.get(`https://pursky.vercel.app/api/ytdl?url=${url}?si=HJ1GvDr8o1dNUKcB&format=${format}`);
    if (response.status !== 200) return res.errorJson("Terjadi kesalahan saat mengunduh video");
    return res.succesJson(response.data);
  } catch (error) {
    return res.errorJson(error);
  }
});

router.get('/anime-jadwal', async (req, res) => {
  const hari = req.query.hari;
  if (!hari) {
    return res.errorJson("Hari tidak valid. Masukkan nama hari dalam bahasa Inggris atau Indonesia")
  }
  try {
    const response = await jadwal(hari.trim());
    if (response.includes("Hari tidak valid.")) {
      return res.errorJson(response)
    }
    return res.succesJson(response);
  } catch (error) {
    return res.errorJson({ error: error.message });
  }
});

router.get('/pin', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.errorJson("Search query cannot be empty.");
  try {
    const result = await pin.search(query);
    if (result.status) {
      return res.succesJson(result.result);
    } else {
      return res.errorJson(result.result);
    }
  } catch (error) {
    return res.errorJson(error.message);
  }
});

router.get('/llm', async (req, res) => {
  let { groqKey, model = 'gemma2-9b-it', systemPrompt = " ", msg, user } = req.query;
  if (!groqKey) return res.errorJson("groqKey is required");
  if (!msg) return res.errorJson("msg is required");
  if (!user) return res.errorJson("user is required");
  if (groqKey.includes('Bearer')) groqKey = groqKey.replace('Bearer ', '').trim();
  try {
    const response = await handleTextQuery({ groqKey, model, systemPrompt, msg, user });
    if (response.reply.includes('API Error')) return res.errorJson(response.reply);
    return res.succesJson(response);
  } catch (error) {
    return res.errorJson(error);
  }
});

router.get('/aio-dl', async (req, res) => {
  const query = req.query.url;
  if (!query) return res.errorJson("Masukkan parameter url");
  try {
    const data = await alldown(query);
    if (!data.data) return res.errorJson("Terjadi kesalahan saat mengunduh video");
    return res.succesJson(data.data);
  } catch (error) {
    return res.errorJson(error);
  }
});

module.exports = router;