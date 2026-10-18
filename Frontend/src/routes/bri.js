const express = require('express');
const router = express.Router();

// Import fungsi getB2BToken dari file briService.js yang tadi dibuat
const { getB2BToken } = require('./briService'); 

// Buat endpoint API untuk frontend CoreUI
router.get('/get-bri-token', async (req, res) => {
    try {
        // Panggil fungsi getB2BToken
        const token = await getB2BToken();
        
        // Kirim token kembali ke frontend
        res.json({
            success: true,
            accessToken: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil token BRI',
            error: error.message
        });
    }
});

module.exports = router;