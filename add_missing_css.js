const fs = require('fs');

let css = fs.readFileSync('cart.css', 'utf8');

const additionalCSS = `
/* Hortum Ek Parcalari Table Styles */
.premium-table {
    width: 100%;
    border-collapse: collapse;
    background: #ffffff;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    border-radius: 12px;
    overflow: hidden;
}
.premium-table th {
    background: linear-gradient(135deg, #004797 0%, #002D62 100%);
    color: #ffffff;
    font-weight: 700;
    padding: 16px;
    text-align: center;
    font-size: 14px;
    border: none;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.premium-table td {
    padding: 16px;
    text-align: center;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    font-size: 15px;
    vertical-align: middle;
}
.premium-table tr:hover td {
    background-color: #f8fafc;
}
.price-val {
    font-weight: 700;
    color: #004797;
    font-size: 16px;
}

.qty-controls {
    display: inline-flex;
    align-items: center;
    background: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #dee2e6;
}
.qty-btn {
    background: none;
    border: none;
    color: #004797;
    font-size: 16px;
    width: 28px;
    height: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
.qty-input {
    width: 40px;
    text-align: center;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 600;
}
.qty-input:focus { outline: none; }

.add-btn {
    background: #004797;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    transition: background 0.2s;
}
.add-btn:hover { background: #003377; color: #fff; }

.ebat-pill {
    background: #EFF6FF;
    border: 1px solid #DBEAFE;
    color: #004797;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 20px;
    display: inline-block;
}
`;

if (!css.includes('.premium-table {width: 100%;')) {
    css += '\n\n' + additionalCSS;
    fs.writeFileSync('cart.css', css);
    console.log('Added Hortum Ek Parcalari CSS to cart.css');
}
