const sharp = require("sharp");

sharp("./sandalye.jpg")
    .resize(1000)
    .jpeg({ quality: 70 })
    .toFile("./sandalye2.jpg")
    .then(() => console.log("✅ Görsel sıkıştırıldı!"))
    .catch(err => console.error("❌ Hata:", err));