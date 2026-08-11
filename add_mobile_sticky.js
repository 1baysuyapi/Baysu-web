const fs = require('fs');

let css = fs.readFileSync('cart.css', 'utf8');

const mobileOptimization = `

/* ========================================================
   MOBILE OPTIMIZATION: STICKY FIRST COLUMN (EBAT)
======================================================== */
@media (max-width: 768px) {
    .table-responsive {
        position: relative !important;
        overflow-x: auto !important;
        /* Ensure we don't clip the shadow of the sticky column */
    }
    
    .price-table {
        border-collapse: separate !important;
        border-spacing: 0 !important;
    }
    
    .price-table th:first-child,
    .price-table td:first-child {
        position: sticky !important;
        left: 0 !important;
        z-index: 2 !important;
    }
    
    .price-table th:first-child {
        background: linear-gradient(135deg, #004797 0%, #002D62 100%) !important;
        z-index: 3 !important; /* Header needs to be above the scroll AND the rows */
    }
    
    .price-table tbody tr td:first-child {
        background-color: #ffffff !important;
        /* Ensure border right for the sticky column isn't doubled */
        border-right: 1px solid #E2E8F0 !important;
    }
    
    .price-table tbody tr:nth-child(even) td:first-child {
        background-color: #F8FAFC !important;
    }
    
    /* Subtle shadow to indicate that the user can scroll */
    .price-table th:first-child::after,
    .price-table td:first-child::after {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        right: -5px !important;
        bottom: 0 !important;
        width: 5px !important;
        background: linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0)) !important;
        pointer-events: none !important;
    }
}
`;

if (!css.includes('STICKY FIRST COLUMN')) {
    css += mobileOptimization;
    fs.writeFileSync('cart.css', css);
    console.log('Mobile optimization added to cart.css');
} else {
    console.log('Mobile optimization already exists in cart.css');
}
