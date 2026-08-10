const fs = require('fs');
const path = require('path');

// 1. Create directory if not exists
const imgDir = path.join(__dirname, 'resimler', 'depo_rekorlari');
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

// 2. Copy the images
const uploadsDir = 'C:\\Users\\kopya\\.gemini\\antigravity\\brain\\cec9ad03-69a3-400e-b131-17f3064bf4cc\\.user_uploaded';

const fileMap = {
    'media_1786295900683.png': 'cift_tarafli_depo_rekoru.png',
    'media_1786295943271.png': 'depo_rekoru_ters_dis.png',
    'media_1786295958995.png': 'sintine_rekoru_ters_dis.png',
    'media_1786295980871.png': 'pvc_hortum_rekoru.png',
    'media_1786296012451.png': 'galvanizli_hortum_rekoru.png'
};

for (const [srcName, destName] of Object.entries(fileMap)) {
    const src = path.join(uploadsDir, srcName);
    const dest = path.join(imgDir, destName);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
    } else {
        console.warn('Source file not found:', src);
    }
}

// Ensure Ozel Depo Rekoru image exists in the new dir
const ozelSrc = path.join(__dirname, 'Özel Depo Rekoru.png');
const ozelDest = path.join(imgDir, 'ozel_depo_rekoru.png');
if (fs.existsSync(ozelSrc)) {
    fs.copyFileSync(ozelSrc, ozelDest);
}

// 3. Generate HTML
const htmlContent = `
<div class="category-header">
    <button class="back-btn" onclick="window.history.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Geri
    </button>
    <h2>Depo Rekorlar</h2>
</div>

<style>
.grouped-products-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 20px 0;
}
.product-group-card {
    display: flex;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    overflow: hidden;
    border: 1px solid #eee;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.product-group-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}
.group-image-col {
    flex: 0 0 300px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fdfdfd;
    border-right: 1px solid #eee;
}
.group-image-col img {
    max-width: 100%;
    height: auto;
    max-height: 250px;
    object-fit: contain;
    margin-bottom: 20px;
}
.group-image-col h3 {
    margin: 0;
    color: #e30613;
    font-size: 1.3rem;
    text-align: center;
}
.group-table-col {
    flex: 1;
    padding: 20px;
    overflow-x: auto;
}
.group-table-col table {
    width: 100%;
    border-collapse: collapse;
}
.group-table-col th, .group-table-col td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
}
.group-table-col th {
    background-color: #f8f9fa;
    color: #333;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
}
.group-table-col tr:last-child td {
    border-bottom: none;
}
.group-table-col tr:hover {
    background-color: #fcfcfc;
}
.add-btn {
    background: #e30613;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: background 0.2s;
}
.add-btn:hover {
    background: #c00410;
}
.qty-input-group {
    display: flex;
    align-items: center;
    gap: 8px;
}
.qty-input-group input {
    width: 60px;
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
}
@media (max-width: 768px) {
    .product-group-card {
        flex-direction: column;
    }
    .group-image-col {
        flex: auto;
        border-right: none;
        border-bottom: 1px solid #eee;
        padding: 20px;
    }
}
</style>

<div class="grouped-products-container">

    <!-- Group 1: ift Tarafl Depo Rekoru -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/cift_tarafli_depo_rekoru.png" alt="ift Tarafl Depo Rekoru">
            <h3>ift Tarafl Depo Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table>
                <thead>
                    <tr>
                        <th>Kod</th>
                        <th>Ebat</th>
                        <th>Fiyat</th>
                        <th>Ambalaj/Koli</th>
                        <th style="width: 150px;">Adet & Sepet</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>326</strong></td>
                        <td>1/2"</td>
                        <td style="color:#e30613; font-weight:600;">65.00 TL</td>
                        <td>-</td>
                        <td>
                            <div class="qty-input-group">
                                <input type="number" id="qty-326" value="1" min="1">
                                <button class="add-btn" onclick="addToCartMulti('ift Tarafl Depo Rekoru 1/2&quot;', 65.00, '326', '-', 'qty-326')">Ekle</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>327</strong></td>
                        <td>3/4"</td>
                        <td style="color:#e30613; font-weight:600;">72.00 TL</td>
                        <td>-</td>
                        <td>
                            <div class="qty-input-group">
                                <input type="number" id="qty-327" value="1" min="1">
                                <button class="add-btn" onclick="addToCartMulti('ift Tarafl Depo Rekoru 3/4&quot;', 72.00, '327', '-', 'qty-327')">Ekle</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>328</strong></td>
                        <td>1"</td>
                        <td style="color:#e30613; font-weight:600;">78.00 TL</td>
                        <td>-</td>
                        <td>
                            <div class="qty-input-group">
                                <input type="number" id="qty-328" value="1" min="1">
                                <button class="add-btn" onclick="addToCartMulti('ift Tarafl Depo Rekoru 1&quot;', 78.00, '328', '-', 'qty-328')">Ekle</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Group 2: Depo Rekoru - Ters Di -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/depo_rekoru_ters_dis.png" alt="Depo Rekoru Ters Di">
            <h3>Depo Rekoru (Ters Di)</h3>
        </div>
        <div class="group-table-col">
            <table>
                <thead>
                    <tr>
                        <th>Kod</th>
                        <th>Ebat</th>
                        <th>Fiyat</th>
                        <th>Koli (Ad.)</th>
                        <th style="width: 150px;">Adet & Sepet</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><strong>275</strong></td><td>1/2"</td><td style="color:#e30613; font-weight:600;">83.00 TL</td><td>400</td><td><div class="qty-input-group"><input type="number" id="qty-275" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Depo Rekoru Ters Di 1/2&quot;', 83.00, '275', '400', 'qty-275')">Ekle</button></div></td></tr>
                    <tr><td><strong>276</strong></td><td>3/4"</td><td style="color:#e30613; font-weight:600;">83.00 TL</td><td>400</td><td><div class="qty-input-group"><input type="number" id="qty-276" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Depo Rekoru Ters Di 3/4&quot;', 83.00, '276', '400', 'qty-276')">Ekle</button></div></td></tr>
                    <tr><td><strong>277</strong></td><td>1"</td><td style="color:#e30613; font-weight:600;">90.00 TL</td><td>250</td><td><div class="qty-input-group"><input type="number" id="qty-277" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Depo Rekoru Ters Di 1&quot;', 90.00, '277', '250', 'qty-277')">Ekle</button></div></td></tr>
                    <tr><td><strong>278</strong></td><td>1 1/4"</td><td style="color:#e30613; font-weight:600;">135.00 TL</td><td>125</td><td><div class="qty-input-group"><input type="number" id="qty-278" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Depo Rekoru Ters Di 1 1/4&quot;', 135.00, '278', '125', 'qty-278')">Ekle</button></div></td></tr>
                    <tr><td><strong>279</strong></td><td>1 1/2"</td><td style="color:#e30613; font-weight:600;">150.00 TL</td><td>125</td><td><div class="qty-input-group"><input type="number" id="qty-279" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Depo Rekoru Ters Di 1 1/2&quot;', 150.00, '279', '125', 'qty-279')">Ekle</button></div></td></tr>
                    <tr><td><strong>280</strong></td><td>2"</td><td style="color:#e30613; font-weight:600;">185.00 TL</td><td>75</td><td><div class="qty-input-group"><input type="number" id="qty-280" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Depo Rekoru Ters Di 2&quot;', 185.00, '280', '75', 'qty-280')">Ekle</button></div></td></tr>
                    <tr><td><strong>281</strong></td><td>3"</td><td style="color:#e30613; font-weight:600;">420.00 TL</td><td>25</td><td><div class="qty-input-group"><input type="number" id="qty-281" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Depo Rekoru Ters Di 3&quot;', 420.00, '281', '25', 'qty-281')">Ekle</button></div></td></tr>
                    <tr><td><strong>282</strong></td><td>4"</td><td style="color:#e30613; font-weight:600;">540.00 TL</td><td>18</td><td><div class="qty-input-group"><input type="number" id="qty-282" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Depo Rekoru Ters Di 4&quot;', 540.00, '282', '18', 'qty-282')">Ekle</button></div></td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Group 3: Sintine Rekoru - Ters Di -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/sintine_rekoru_ters_dis.png" alt="Sintine Rekoru Ters Di">
            <h3>Sintine Rekoru (Ters Di)</h3>
        </div>
        <div class="group-table-col">
            <table>
                <thead>
                    <tr>
                        <th>Kod</th>
                        <th>Ebat</th>
                        <th>Fiyat</th>
                        <th>Koli (Ad.)</th>
                        <th style="width: 150px;">Adet & Sepet</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><strong>236</strong></td><td>3/4"</td><td style="color:#e30613; font-weight:600;">80.00 TL</td><td>350</td><td><div class="qty-input-group"><input type="number" id="qty-236" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Sintine Rekoru Ters Di 3/4&quot;', 80.00, '236', '350', 'qty-236')">Ekle</button></div></td></tr>
                    <tr><td><strong>237</strong></td><td>1"</td><td style="color:#e30613; font-weight:600;">80.00 TL</td><td>200</td><td><div class="qty-input-group"><input type="number" id="qty-237" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Sintine Rekoru Ters Di 1&quot;', 80.00, '237', '200', 'qty-237')">Ekle</button></div></td></tr>
                    <tr><td><strong>238</strong></td><td>1 1/4"</td><td style="color:#e30613; font-weight:600;">115.00 TL</td><td>125</td><td><div class="qty-input-group"><input type="number" id="qty-238" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Sintine Rekoru Ters Di 1 1/4&quot;', 115.00, '238', '125', 'qty-238')">Ekle</button></div></td></tr>
                    <tr><td><strong>239</strong></td><td>1 1/2"</td><td style="color:#e30613; font-weight:600;">130.00 TL</td><td>125</td><td><div class="qty-input-group"><input type="number" id="qty-239" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Sintine Rekoru Ters Di 1 1/2&quot;', 130.00, '239', '125', 'qty-239')">Ekle</button></div></td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Group 4: PVC Hortum Rekoru -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/pvc_hortum_rekoru.png" alt="PVC Hortum Rekoru">
            <h3>PVC Hortum Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table>
                <thead>
                    <tr>
                        <th>Kod</th>
                        <th>Ebat</th>
                        <th>Fiyat</th>
                        <th>Ambalaj</th>
                        <th>Koli (Ad.)</th>
                        <th style="width: 150px;">Adet & Sepet</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><strong>241</strong></td><td>1/2"</td><td style="color:#e30613; font-weight:600;">13.00 TL</td><td>125</td><td>1250</td><td><div class="qty-input-group"><input type="number" id="qty-241" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('PVC Hortum Rekoru 1/2&quot;', 13.00, '241', '1250', 'qty-241')">Ekle</button></div></td></tr>
                    <tr><td><strong>242</strong></td><td>3/4"</td><td style="color:#e30613; font-weight:600;">14.00 TL</td><td>100</td><td>1000</td><td><div class="qty-input-group"><input type="number" id="qty-242" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('PVC Hortum Rekoru 3/4&quot;', 14.00, '242', '1000', 'qty-242')">Ekle</button></div></td></tr>
                    <tr><td><strong>243</strong></td><td>1"</td><td style="color:#e30613; font-weight:600;">27.50 TL</td><td>50</td><td>500</td><td><div class="qty-input-group"><input type="number" id="qty-243" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('PVC Hortum Rekoru 1&quot;', 27.50, '243', '500', 'qty-243')">Ekle</button></div></td></tr>
                    <tr><td><strong>244</strong></td><td>1 1/4"</td><td style="color:#e30613; font-weight:600;">32.00 TL</td><td>30</td><td>300</td><td><div class="qty-input-group"><input type="number" id="qty-244" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('PVC Hortum Rekoru 1 1/4&quot;', 32.00, '244', '300', 'qty-244')">Ekle</button></div></td></tr>
                    <tr><td><strong>245</strong></td><td>1 1/2"</td><td style="color:#e30613; font-weight:600;">40.00 TL</td><td>20</td><td>200</td><td><div class="qty-input-group"><input type="number" id="qty-245" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('PVC Hortum Rekoru 1 1/2&quot;', 40.00, '245', '200', 'qty-245')">Ekle</button></div></td></tr>
                    <tr><td><strong>246</strong></td><td>2"</td><td style="color:#e30613; font-weight:600;">67.00 TL</td><td>10</td><td>120</td><td><div class="qty-input-group"><input type="number" id="qty-246" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('PVC Hortum Rekoru 2&quot;', 67.00, '246', '120', 'qty-246')">Ekle</button></div></td></tr>
                    <tr><td><strong>247</strong></td><td>2 1/2"</td><td style="color:#e30613; font-weight:600;">90.00 TL</td><td>-</td><td>75</td><td><div class="qty-input-group"><input type="number" id="qty-247" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('PVC Hortum Rekoru 2 1/2&quot;', 90.00, '247', '75', 'qty-247')">Ekle</button></div></td></tr>
                    <tr><td><strong>248</strong></td><td>3"</td><td style="color:#e30613; font-weight:600;">145.00 TL</td><td>-</td><td>40</td><td><div class="qty-input-group"><input type="number" id="qty-248" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('PVC Hortum Rekoru 3&quot;', 145.00, '248', '40', 'qty-248')">Ekle</button></div></td></tr>
                    <tr><td><strong>249</strong></td><td>4"</td><td style="color:#e30613; font-weight:600;">200.00 TL</td><td>-</td><td>25</td><td><div class="qty-input-group"><input type="number" id="qty-249" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('PVC Hortum Rekoru 4&quot;', 200.00, '249', '25', 'qty-249')">Ekle</button></div></td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Group 5: Galvanizli Hortum Rekoru -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/galvanizli_hortum_rekoru.png" alt="Galvanizli Hortum Rekoru">
            <h3>Galvanizli Hortum Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table>
                <thead>
                    <tr>
                        <th>Kod</th>
                        <th>Ebat</th>
                        <th>Fiyat</th>
                        <th>Koli (Ad.)</th>
                        <th style="width: 150px;">Adet & Sepet</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><strong>251</strong></td><td>1/2"</td><td style="color:#e30613; font-weight:600;">70.00 TL</td><td>500</td><td><div class="qty-input-group"><input type="number" id="qty-251" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Galvanizli Hortum Rekoru 1/2&quot;', 70.00, '251', '500', 'qty-251')">Ekle</button></div></td></tr>
                    <tr><td><strong>252</strong></td><td>3/4"</td><td style="color:#e30613; font-weight:600;">80.00 TL</td><td>300</td><td><div class="qty-input-group"><input type="number" id="qty-252" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Galvanizli Hortum Rekoru 3/4&quot;', 80.00, '252', '300', 'qty-252')">Ekle</button></div></td></tr>
                    <tr><td><strong>253</strong></td><td>1"</td><td style="color:#e30613; font-weight:600;">95.00 TL</td><td>200</td><td><div class="qty-input-group"><input type="number" id="qty-253" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Galvanizli Hortum Rekoru 1&quot;', 95.00, '253', '200', 'qty-253')">Ekle</button></div></td></tr>
                    <tr><td><strong>254</strong></td><td>1 1/4"</td><td style="color:#e30613; font-weight:600;">110.00 TL</td><td>100</td><td><div class="qty-input-group"><input type="number" id="qty-254" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Galvanizli Hortum Rekoru 1 1/4&quot;', 110.00, '254', '100', 'qty-254')">Ekle</button></div></td></tr>
                    <tr><td><strong>255</strong></td><td>1 1/2"</td><td style="color:#e30613; font-weight:600;">130.00 TL</td><td>100</td><td><div class="qty-input-group"><input type="number" id="qty-255" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Galvanizli Hortum Rekoru 1 1/2&quot;', 130.00, '255', '100', 'qty-255')">Ekle</button></div></td></tr>
                    <tr><td><strong>256</strong></td><td>2"</td><td style="color:#e30613; font-weight:600;">175.00 TL</td><td>60</td><td><div class="qty-input-group"><input type="number" id="qty-256" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Galvanizli Hortum Rekoru 2&quot;', 175.00, '256', '60', 'qty-256')">Ekle</button></div></td></tr>
                    <tr><td><strong>257</strong></td><td>2 1/2"</td><td style="color:#e30613; font-weight:600;">215.00 TL</td><td>30</td><td><div class="qty-input-group"><input type="number" id="qty-257" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Galvanizli Hortum Rekoru 2 1/2&quot;', 215.00, '257', '30', 'qty-257')">Ekle</button></div></td></tr>
                    <tr><td><strong>258</strong></td><td>3"</td><td style="color:#e30613; font-weight:600;">320.00 TL</td><td>24</td><td><div class="qty-input-group"><input type="number" id="qty-258" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Galvanizli Hortum Rekoru 3&quot;', 320.00, '258', '24', 'qty-258')">Ekle</button></div></td></tr>
                    <tr><td><strong>259</strong></td><td>4"</td><td style="color:#e30613; font-weight:600;">530.00 TL</td><td>30</td><td><div class="qty-input-group"><input type="number" id="qty-259" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('Galvanizli Hortum Rekoru 4&quot;', 530.00, '259', '30', 'qty-259')">Ekle</button></div></td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Group 6: zel Depo Rekoru -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/ozel_depo_rekoru.png" alt="zel Depo Rekoru">
            <h3>zel Depo Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table>
                <thead>
                    <tr>
                        <th>Kod</th>
                        <th>Ebat</th>
                        <th>Fiyat</th>
                        <th>Koli (Ad.)</th>
                        <th style="width: 150px;">Adet & Sepet</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><strong>318</strong></td><td>1/2"</td><td style="color:#e30613; font-weight:600;">65.00 TL</td><td>200</td><td><div class="qty-input-group"><input type="number" id="qty-318" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('zel Depo Rekoru 1/2&quot;', 65.00, '318', '200', 'qty-318')">Ekle</button></div></td></tr>
                    <tr><td><strong>319</strong></td><td>3/4"</td><td style="color:#e30613; font-weight:600;">65.00 TL</td><td>200</td><td><div class="qty-input-group"><input type="number" id="qty-319" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('zel Depo Rekoru 3/4&quot;', 65.00, '319', '200', 'qty-319')">Ekle</button></div></td></tr>
                    <tr><td><strong>320</strong></td><td>1"</td><td style="color:#e30613; font-weight:600;">65.00 TL</td><td>200</td><td><div class="qty-input-group"><input type="number" id="qty-320" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('zel Depo Rekoru 1&quot;', 65.00, '320', '200', 'qty-320')">Ekle</button></div></td></tr>
                    <tr><td><strong>321</strong></td><td>1 1/4"</td><td style="color:#e30613; font-weight:600;">65.00 TL</td><td>180</td><td><div class="qty-input-group"><input type="number" id="qty-321" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('zel Depo Rekoru 1 1/4&quot;', 65.00, '321', '180', 'qty-321')">Ekle</button></div></td></tr>
                    <tr><td><strong>322</strong></td><td>1 1/2"</td><td style="color:#e30613; font-weight:600;">65.00 TL</td><td>160</td><td><div class="qty-input-group"><input type="number" id="qty-322" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('zel Depo Rekoru 1 1/2&quot;', 65.00, '322', '160', 'qty-322')">Ekle</button></div></td></tr>
                    <tr><td><strong>323</strong></td><td>2"</td><td style="color:#e30613; font-weight:600;">65.00 TL</td><td>150</td><td><div class="qty-input-group"><input type="number" id="qty-323" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('zel Depo Rekoru 2&quot;', 65.00, '323', '150', 'qty-323')">Ekle</button></div></td></tr>
                    <tr><td><strong>324</strong></td><td>2 1/2" (l)</td><td style="color:#e30613; font-weight:600;">220.00 TL</td><td>-</td><td><div class="qty-input-group"><input type="number" id="qty-324" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('zel Depo Rekoru 2 1/2&quot;', 220.00, '324', '-', 'qty-324')">Ekle</button></div></td></tr>
                    <tr><td><strong>325</strong></td><td>3" (l)</td><td style="color:#e30613; font-weight:600;">235.00 TL</td><td>-</td><td><div class="qty-input-group"><input type="number" id="qty-325" value="1" min="1"><button class="add-btn" onclick="addToCartMulti('zel Depo Rekoru 3&quot;', 235.00, '325', '-', 'qty-325')">Ekle</button></div></td></tr>
                </tbody>
            </table>
        </div>
    </div>

</div>

<script>
// Expose global helper for adding to cart with quantity multiplier
window.addToCartMulti = function(name, price, code, box, inputId) {
    const qtyInput = document.getElementById(inputId);
    let qty = 1;
    if (qtyInput && qtyInput.value) {
        qty = parseInt(qtyInput.value, 10) || 1;
    }
    
    // Attempt to access global addToCart if exists
    if (typeof window.addToCart === 'function') {
        for (let i = 0; i < qty; i++) {
            window.addToCart(name, price, code, box);
        }
        
        // Show success alert
        const alertBox = document.createElement('div');
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.right = '20px';
        alertBox.style.background = '#4CAF50';
        alertBox.style.color = 'white';
        alertBox.style.padding = '15px 25px';
        alertBox.style.borderRadius = '5px';
        alertBox.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        alertBox.style.zIndex = '9999';
        alertBox.innerHTML = \`\${qty} adet sepete eklendi!\`;
        document.body.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 2000);
    } else {
        alert("Sepet sistemi hazr deil!");
    }
};
</script>
`;

fs.writeFileSync('depo_rekorlari.html', htmlContent);

// 4. Update data.js
let dataCode = fs.readFileSync('data.js', 'utf8');

// Check if depo-rekorlari.html exists
if (dataCode.includes('"depo-rekorlari.html"')) {
    const routeRegex = /("depo-rekorlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(htmlContent, 'utf8').toString('base64');
    dataCode = dataCode.replace(routeRegex, (m, p1, p2, p3) => p1 + newBase64 + p3);
} else {
    // Add it
    const insertionPoint = dataCode.lastIndexOf('}');
    const newBase64 = Buffer.from(htmlContent, 'utf8').toString('base64');
    const newEntry = ',\\n    "depo-rekorlari.html": "' + newBase64 + '"\\n';
    dataCode = dataCode.substring(0, insertionPoint) + newEntry + dataCode.substring(insertionPoint);
}

fs.writeFileSync('data.js', dataCode);

console.log("Depo rekorlar added!");
