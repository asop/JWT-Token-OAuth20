const crypto = require('crypto');
const axios = require('axios');

const BASE_URL = 'https://sandbox.partner.api.bri.co.id';
const CLIENT_ID = 'dihapus'; // Client ID
const PRIVATE_KEY = `-----BEGIN PUBLIC KEY-----
dihapus
-----END PUBLIC KEY-----`; // Private Key

// Fungsi Helper untuk Generate SNAP B2B Token
async function getB2BToken() {
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '+07:00'); // Format ISO 8601
    
    // 1. Susun stringToSign Token B2B: clientKey|timestamp
    const stringToSign = `${CLIENT_ID}|${timestamp}`;

    // 2. Tanda tangani dengan RSA-SHA256
    const sign = crypto.createSign('SHA256');
    sign.update(stringToSign);
    sign.end();
    const signature = sign.sign(PRIVATE_KEY, 'base64');

    try {
        // 3. Request ke BRIAPI Token Endpoint
        const response = await axios.post(`${BASE_URL}/snap/v1.0/access-token/b2b`, {
            grantType: 'client_credentials'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CLIENT-KEY': CLIENT_ID,
                'X-TIMESTAMP': timestamp,
                'X-SIGNATURE': signature
            }
        });

        return response.data.accessToken;
    } catch (error) {
        console.error('Gagal mengambil token BRI:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = { getB2BToken };
