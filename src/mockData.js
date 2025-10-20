const MOCK_DATA = {
    categories: [
      { id: 1, name: "🍺 Cervejas", description: "Artesanais e especiais" },
      { id: 2, name: "🍷 Vinhos", description: "Tintos, brancos e rosés" },
      { id: 3, name: "🥃 Destilados", description: "Whisky, vodka, gin e mais" },
      { id: 4, name: "🥤 Não Alcoólicos", description: "Refrigerantes, sucos e águas" },
      { id: 5, name: "🍿 Petiscos", description: "Para acompanhar" }
    ],
    products: {
      1: [
        { id: 101, name: "Cerveja Pilsen 600ml", price: 12.0, description: "Cerveja artesanal pilsen, leve e refrescante", sku: "CERV-PIL-600", stock: 100 },
        { id: 102, name: "IPA Americana 500ml", price: 18.0, description: "India Pale Ale com aroma cítrico e amargor marcante", sku: "CERV-IPA-500", stock: 50 },
        { id: 103, name: "Weiss 500ml", price: 15.0, description: "Cerveja de trigo alemã, suave e aromática", sku: "CERV-WEI-500", stock: 75 },
        { id: 104, name: "Stout 350ml", price: 20.0, description: "Cerveja escura com notas de café e chocolate", sku: "CERV-STO-350", stock: 30 },
        { id: 105, name: "Pack 6 Pilsen", price: 65.0, description: "Pack com 6 unidades de Pilsen 600ml", sku: "PACK-PIL-6", stock: 20 }
      ],
      2: [
        { id: 201, name: "Vinho Tinto Malbec", price: 45.0, description: "Argentino, encorpado e frutado", sku: "VIN-MAL-750", stock: 40 },
        { id: 202, name: "Vinho Branco Chardonnay", price: 38.0, description: "Chileno, fresco e equilibrado", sku: "VIN-CHA-750", stock: 35 },
        { id: 203, name: "Vinho Rosé Provence", price: 52.0, description: "Francês, delicado e elegante", sku: "VIN-ROS-750", stock: 25 }
      ],
      3: [
        { id: 301, name: "Whisky Jack Daniels", price: 89.0, description: "Tennessee Whiskey 750ml", sku: "WHI-JAC-750", stock: 20 },
        { id: 302, name: "Vodka Absolut", price: 65.0, description: "Vodka Sueca Premium 750ml", sku: "VOD-ABS-750", stock: 30 },
        { id: 303, name: "Gin Tanqueray", price: 78.0, description: "London Dry Gin 750ml", sku: "GIN-TAN-750", stock: 25 }
      ],
      4: [
        { id: 401, name: "Coca-Cola 2L", price: 8.0, description: "Refrigerante Coca-Cola 2 litros", sku: "REF-COC-2L", stock: 200 },
        { id: 402, name: "Suco Natural Laranja 1L", price: 12.0, description: "Suco 100% natural de laranja", sku: "SUC-LAR-1L", stock: 50 },
        { id: 403, name: "Água Mineral 500ml (6un)", price: 15.0, description: "Pack com 6 garrafas de 500ml", sku: "AGU-MIN-6", stock: 100 }
      ],
      5: [
        { id: 501, name: "Amendoim Japonês 200g", price: 8.0, description: "Crocante e temperado", sku: "PET-AME-200", stock: 150 },
        { id: 502, name: "Mix de Castanhas 150g", price: 18.0, description: "Castanhas nobres selecionadas", sku: "PET-MIX-150", stock: 80 },
        { id: 503, name: "Batata Chips Artesanal 100g", price: 12.0, description: "Crocante e sequinha", sku: "PET-BAT-100", stock: 100 }
      ]
    }
  };

export { MOCK_DATA };
