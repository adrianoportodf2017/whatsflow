/**
 * Endpoint E-commerce Flow WhatsApp
 * Versão com dados mockados para teste
 */

// ==========================================
// DADOS MOCKADOS
// ==========================================

const MOCK_DATA = {
    categories: [
        {
            id: 1,
            name: "🍺 Cervejas",
            description: "Artesanais e especiais"
        },
        {
            id: 2,
            name: "🍷 Vinhos",
            description: "Tintos, brancos e rosés"
        },
        {
            id: 3,
            name: "🥃 Destilados",
            description: "Whisky, vodka, gin e mais"
        },
        {
            id: 4,
            name: "🥤 Não Alcoólicos",
            description: "Refrigerantes, sucos e águas"
        },
        {
            id: 5,
            name: "🍿 Petiscos",
            description: "Para acompanhar"
        }
    ],

    products: {
        1: [ // Cervejas
            {
                id: 101,
                name: "Cerveja Pilsen 600ml",
                price: 12.00,
                description: "Cerveja artesanal pilsen, leve e refrescante",
                sku: "CERV-PIL-600",
                stock: 100
            },
            {
                id: 102,
                name: "IPA Americana 500ml",
                price: 18.00,
                description: "India Pale Ale com aroma cítrico e amargor marcante",
                sku: "CERV-IPA-500",
                stock: 50
            },
            {
                id: 103,
                name: "Weiss 500ml",
                price: 15.00,
                description: "Cerveja de trigo alemã, suave e aromática",
                sku: "CERV-WEI-500",
                stock: 75
            },
            {
                id: 104,
                name: "Stout 350ml",
                price: 20.00,
                description: "Cerveja escura com notas de café e chocolate",
                sku: "CERV-STO-350",
                stock: 30
            },
            {
                id: 105,
                name: "Pack 6 Pilsen",
                price: 65.00,
                description: "Pack com 6 unidades de Pilsen 600ml",
                sku: "PACK-PIL-6",
                stock: 20
            }
        ],
        2: [ // Vinhos
            {
                id: 201,
                name: "Vinho Tinto Malbec",
                price: 45.00,
                description: "Argentino, encorpado e frutado",
                sku: "VIN-MAL-750",
                stock: 40
            },
            {
                id: 202,
                name: "Vinho Branco Chardonnay",
                price: 38.00,
                description: "Chileno, fresco e equilibrado",
                sku: "VIN-CHA-750",
                stock: 35
            },
            {
                id: 203,
                name: "Vinho Rosé Provence",
                price: 52.00,
                description: "Francês, delicado e elegante",
                sku: "VIN-ROS-750",
                stock: 25
            }
        ],
        3: [ // Destilados
            {
                id: 301,
                name: "Whisky Jack Daniels",
                price: 89.00,
                description: "Tennessee Whiskey 750ml",
                sku: "WHI-JAC-750",
                stock: 20
            },
            {
                id: 302,
                name: "Vodka Absolut",
                price: 65.00,
                description: "Vodka Sueca Premium 750ml",
                sku: "VOD-ABS-750",
                stock: 30
            },
            {
                id: 303,
                name: "Gin Tanqueray",
                price: 78.00,
                description: "London Dry Gin 750ml",
                sku: "GIN-TAN-750",
                stock: 25
            }
        ],
        4: [ // Não Alcoólicos
            {
                id: 401,
                name: "Coca-Cola 2L",
                price: 8.00,
                description: "Refrigerante Coca-Cola 2 litros",
                sku: "REF-COC-2L",
                stock: 200
            },
            {
                id: 402,
                name: "Suco Natural Laranja 1L",
                price: 12.00,
                description: "Suco 100% natural de laranja",
                sku: "SUC-LAR-1L",
                stock: 50
            },
            {
                id: 403,
                name: "Água Mineral 500ml (6un)",
                price: 15.00,
                description: "Pack com 6 garrafas de 500ml",
                sku: "AGU-MIN-6",
                stock: 100
            }
        ],
        5: [ // Petiscos
            {
                id: 501,
                name: "Amendoim Japonês 200g",
                price: 8.00,
                description: "Crocante e temperado",
                sku: "PET-AME-200",
                stock: 150
            },
            {
                id: 502,
                name: "Mix de Castanhas 150g",
                price: 18.00,
                description: "Castanhas nobres selecionadas",
                sku: "PET-MIX-150",
                stock: 80
            },
            {
                id: 503,
                name: "Batata Chips Artesanal 100g",
                price: 12.00,
                description: "Crocante e sequinha",
                sku: "PET-BAT-100",
                stock: 100
            }
        ]
    },

    shippingOptions: [
        {
            id: 1,
            name: "Retirada no Local",
            description: "Retire seu pedido em nossa loja",
            price: 0.00,
            estimatedDays: 0
        },
        {
            id: 2,
            name: "Entrega Padrão",
            description: "Entrega em 2-3 dias úteis",
            price: 15.00,
            estimatedDays: 3
        },
        {
            id: 3,
            name: "Entrega Expressa",
            description: "Entrega no mesmo dia (pedidos até 14h)",
            price: 25.00,
            estimatedDays: 0
        },
        {
            id: 4,
            name: "Entrega Agendada",
            description: "Escolha o melhor dia para receber",
            price: 20.00,
            estimatedDays: null
        }
    ],

    paymentMethods: [
        {
            id: "pix",
            name: "PIX",
            description: "Pagamento instantâneo com 5% de desconto",
            discount: 5
        },
        {
            id: "credit_card",
            name: "Cartão de Crédito",
            description: "Parcelamento em até 3x sem juros",
            discount: 0
        },
        {
            id: "debit_card",
            name: "Cartão de Débito",
            description: "Débito à vista",
            discount: 0
        },
        {
            id: "cash",
            name: "Dinheiro na Entrega",
            description: "Pague ao receber (necessário valor exato)",
            discount: 0
        }
    ]
};

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Gerar ID único para pedido
const generateOrderId = () => {
    const prefix = "ORD";
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}-${date}-${random}`;
};

// Buscar produto por ID
const getProductById = (productId) => {
    for (const categoryProducts of Object.values(MOCK_DATA.products)) {
        const product = categoryProducts.find(p => p.id === productId);
        if (product) return product;
    }
    return null;
};

// Calcular totais do carrinho
const calculateCartTotals = (cartItems) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    return {
        subtotal,
        itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        formattedSubtotal: `R$ ${subtotal.toFixed(2).replace('.', ',')}`
    };
};


// Inteiro positivo (>=1) ou null
const parsePositiveInt = (v) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
};

// Quantidade desse produto já no carrinho
const getCartQty = (cartItems = [], productId) => {
    const found = cartItems.find(i => i.product_id === productId);
    return found ? parseInt(found.quantity || 0, 10) : 0;
};

// Estoque disponível considerando o que já está no carrinho
const getAvailableStock = (productId, cartItems = []) => {
    const p = getProductById(productId);
    if (!p) return 0;
    const inCart = getCartQty(cartItems, productId);
    return Math.max(0, (parseInt(p.stock, 10) || 0) - inCart);
};

// Validar telefone brasileiro
const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 || cleaned.length === 10;
};

// Validar CPF (simplificado)
const validateCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.length === 11;
};

// ==========================================
// RESPOSTAS DAS TELAS
// ==========================================

const SCREEN_RESPONSES = {
    // Tela inicial de boas-vindas
    WELCOME: {
        screen: "WELCOME",
        data: {
            menu_options: [
                {
                    id: "catalog",
                    title: "📦 Ver Produtos"
                },
                {
                    id: "cart",
                    title: "🛒 Meu Carrinho"
                },
                {
                    id: "orders",
                    title: "📋 Meus Pedidos"
                },
                {
                    id: "support",
                    title: "💬 Falar com Atendente"
                }
            ],
            cart_items: [],
            cart_count: 0
        }
    },

    // Categorias de produtos
    CATALOG_CATEGORIES: (data) => {
        const cartItems = data?.cart_items || [];
        const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
            screen: "CATALOG_CATEGORIES",
            data: {
                categories: MOCK_DATA.categories.map(cat => ({
                    id: cat.id.toString(),
                    title: cat.name,
                    description: cat.description
                })),
                cart_items: cartItems,
                cart_count: cartCount
            }
        };
    },

    // Lista de produtos da categoria
    CATALOG_PRODUCTS: (data) => {
        const categoryId = parseInt(data?.category_id);
        const cartItems = data?.cart_items || [];
        const products = MOCK_DATA.products[categoryId] || [];
        const category = MOCK_DATA.categories.find(c => c.id === categoryId);

        return {
            screen: "CATALOG_PRODUCTS",
            data: {
                category_name: category?.name || "Produtos",
                products: products.map(prod => ({
                    id: prod.id.toString(),
                    title: prod.name,
                    description: `R$ ${prod.price.toFixed(2).replace('.', ',')} - ${prod.description}`
                })),
                cart_items: cartItems,
                cart_count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
            }
        };
    },

    // Detalhes do produto
    PRODUCT_DETAIL: (data) => {
        const productId = parseInt(data?.product_id);
        const product = getProductById(productId);
        const cartItems = data?.cart_items || [];

        if (!product) {
            return {
                screen: "ERROR",
                data: {
                    error_message: "Produto não encontrado",
                    retry_available: true
                }
            };
        }

        const available = getAvailableStock(productId, cartItems);

        return {
            screen: "PRODUCT_DETAIL",
            data: {
                // Propriedades separadas (não objeto aninhado)
                product_id: product.id,
                product_name: product.name,
                product_price: `R$ ${product.price.toFixed(2).replace('.', ',')}`,
                product_description: product.description,
                product_sku: product.sku,
                product_stock: available > 0
                    ? `${available} unidades disponíveis`
                    : "Indisponível",
                error_message: data?.error_message || "",
                cart_items: cartItems
            }
        };
    },


    // Carrinho de compras
    CART: (data) => {
        let cartItems = data?.cart_items || [];
        let cart_notice = "";

        // Adicionar novo item ao carrinho
        if (data?.action === "add_to_cart" && data?.product_id && data?.quantity) {
            const product = getProductById(parseInt(data.product_id));
            if (product) {
                const requested = Math.max(1, parseInt(data.quantity));
                const existingIndex = cartItems.findIndex(item => item.product_id === product.id);
                const existingQty = existingIndex >= 0 ? cartItems[existingIndex].quantity : 0;

                const available = Math.max(0, product.stock - existingQty);
                let qtyToAdd = Math.min(requested, available);

                if (available <= 0) {
                    cart_notice = "Este item atingiu o limite de estoque no carrinho.";
                } else {
                    if (existingIndex >= 0) {
                        cartItems[existingIndex].quantity += qtyToAdd;
                        cartItems[existingIndex].subtotal = cartItems[existingIndex].quantity * cartItems[existingIndex].unit_price;
                    } else {
                        cartItems.push({
                            product_id: product.id,
                            name: product.name,
                            unit_price: product.price,
                            quantity: qtyToAdd,
                            subtotal: product.price * qtyToAdd
                        });
                    }

                    if (qtyToAdd < requested) {
                        cart_notice = `Quantidade ajustada para ${qtyToAdd} (estoque máximo disponível).`;
                    }
                }
            }
        }

        // Atualizar quantidade de item
        if (data?.action === "update_quantity" && data?.item_id && data?.new_quantity) {
            const itemIndex = cartItems.findIndex(item => item.product_id === parseInt(data.item_id));
            if (itemIndex >= 0) {
                const newQuantity = parseInt(data.new_quantity);
                if (newQuantity <= 0) {
                    cartItems.splice(itemIndex, 1);
                } else {
                    cartItems[itemIndex].quantity = newQuantity;
                    cartItems[itemIndex].subtotal = cartItems[itemIndex].quantity * cartItems[itemIndex].unit_price;
                }
            }
        }

        // Remover item do carrinho
        if (data?.action === "remove_item" && data?.item_id) {
            cartItems = cartItems.filter(item => item.product_id !== parseInt(data.item_id));
        }

        const totals = calculateCartTotals(cartItems);

        return {
            screen: "CART",
            data: {
                cart_items: cartItems,
                items_display: cartItems.map(item => ({
                    id: item.product_id.toString(),
                    title: `${item.name} (${item.quantity}x)`,
                    description: `R$ ${item.unit_price.toFixed(2).replace('.', ',')} cada | Total: R$ ${item.subtotal.toFixed(2).replace('.', ',')}`
                })),
                actions: [
                    { id: "update_quantity", title: "✏️ Atualizar quantidade" },
                    { id: "remove_item", title: "🗑️ Remover item" },
                    { id: "continue_shopping", title: "🛍️ Continuar comprando" },
                    { id: "checkout", title: "✅ Finalizar pedido" }
                ],
                is_empty: cartItems.length === 0,
                subtotal: totals.subtotal,
                formatted_subtotal: totals.formattedSubtotal,
                items_count: totals.itemsCount,
                cart_notice: cart_notice
            }
        };
    },
    // Dados do cliente
    CUSTOMER_DATA: (data) => {
        const cartItems = data?.cart_items || [];

        return {
            screen: "CUSTOMER_DATA",
            data: {
                cart_items: cartItems,
                customer_data: data?.customer_data || {},
                validation_errors: data?.validation_errors || []
            }
        };
    },

    // Validação e confirmação dos dados do cliente
    CUSTOMER_VALIDATION: (data) => {
        const cartItems = data?.cart_items || [];
        const customerData = data?.customer_data || {};
        const errors = [];

        // Validações
        if (!customerData.name || customerData.name.length < 3) {
            errors.push("Nome deve ter pelo menos 3 caracteres");
        }

        if (!validatePhone(customerData.phone)) {
            errors.push("Telefone inválido (use DDD + número)");
        }

        if (customerData.email && !customerData.email.includes('@')) {
            errors.push("Email inválido");
        }

        if (customerData.document && !validateCPF(customerData.document)) {
            errors.push("CPF inválido");
        }

        if (errors.length > 0) {
            return {
                screen: "CUSTOMER_DATA",
                data: {
                    cart_items: cartItems,
                    customer_data: customerData,
                    validation_errors: errors
                }
            };
        }

        // Se validou, vai para opções de entrega
        return SCREEN_RESPONSES.SHIPPING_OPTIONS(data);
    },

    // Opções de entrega
    SHIPPING_OPTIONS: (data) => {
        const cartItems = data?.cart_items || [];
        const customerData = data?.customer_data || {};

        return {
            screen: "SHIPPING_OPTIONS",
            data: {
                shipping_options: MOCK_DATA.shippingOptions.map(opt => ({
                    id: opt.id.toString(),
                    title: `${opt.name} - ${opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}`,
                    description: opt.description
                })),
                cart_items: cartItems,
                customer_data: customerData
            }
        };
    },

    // Endereço de entrega (se não for retirada)
    SHIPPING_ADDRESS: (data) => {
        const cartItems = data?.cart_items || [];
        const customerData = data?.customer_data || {};
        const shippingOption = data?.shipping_option || {};

        // Se escolheu retirada, pula para pagamento
        if (parseInt(shippingOption.id) === 1) {
            return SCREEN_RESPONSES.PAYMENT_METHOD(data);
        }

        return {
            screen: "SHIPPING_ADDRESS",
            data: {
                cart_items: cartItems,
                customer_data: customerData,
                shipping_option: shippingOption,
                shipping_address: data?.shipping_address || {}
            }
        };
    },

    // Forma de pagamento
    PAYMENT_METHOD: (data) => {
        const cartItems = data?.cart_items || [];
        const totals = calculateCartTotals(cartItems);
        const shippingOption = MOCK_DATA.shippingOptions.find(
            opt => opt.id === parseInt(data?.shipping_option?.id)
        );
        const shippingPrice = shippingOption?.price || 0;
        const total = totals.subtotal + shippingPrice;

        return {
            screen: "PAYMENT_METHOD",
            data: {
                payment_methods: MOCK_DATA.paymentMethods.map(method => ({
                    id: method.id,
                    title: method.name,
                    description: method.description,
                    discount: method.discount,
                    total_with_discount: method.discount > 0
                        ? `Total com desconto: R$ ${(total * (1 - method.discount / 100)).toFixed(2).replace('.', ',')}`
                        : null
                })),
                cart_items: cartItems,
                customer_data: data?.customer_data || {},
                shipping_option: data?.shipping_option || {},
                shipping_address: data?.shipping_address || {},
                subtotal: totals.subtotal,
                shipping_price: shippingPrice,
                total: total,
                formatted_total: `R$ ${total.toFixed(2).replace('.', ',')}`
            }
        };
    },

    ORDER_REVIEW: (data) => {
        const cartItems = data?.cart_items || [];
        const totals = calculateCartTotals(cartItems);
        const shippingOption = MOCK_DATA.shippingOptions.find(
            opt => opt.id === parseInt(data?.shipping_option?.id)
        );
        const shippingPrice = shippingOption?.price || 0;
        const paymentMethod = MOCK_DATA.paymentMethods.find(
            method => method.id === data?.payment_method
        );
        const discount = paymentMethod?.discount || 0;
        const discountAmount = (totals.subtotal + shippingPrice) * (discount / 100);
        const total = totals.subtotal + shippingPrice - discountAmount;

        return {
            screen: "ORDER_REVIEW",
            data: {
                // Campos individuais para o layout
                order_subtotal: `R$ ${totals.subtotal.toFixed(2).replace('.', ',')}`,
                order_shipping: shippingOption?.name || "N/A",
                order_shipping_price: `R$ ${shippingPrice.toFixed(2).replace('.', ',')}`,
                order_payment: paymentMethod?.name || "N/A",
                order_discount: discount > 0
                    ? `${discount}% - R$ ${discountAmount.toFixed(2).replace('.', ',')}`
                    : "Sem desconto",
                order_total: `R$ ${total.toFixed(2).replace('.', ',')}`,

                customer_name: data?.customer_data?.name || "",
                customer_phone: data?.customer_data?.phone || "",
                customer_email: data?.customer_data?.email || "Não informado",

                // Dados completos para o payload
                cart_items: cartItems,
                customer_data: data?.customer_data || {},
                shipping_option: data?.shipping_option || {},
                shipping_address: data?.shipping_address || {},
                payment_method: data?.payment_method || "",
                subtotal: totals.subtotal,
                shipping_amount: shippingPrice,
                discount_amount: discountAmount,
                total_amount: total
            }
        };
    },

    // Confirmação final do pedido
    ORDER_COMPLETE: async (data) => {
        const orderId = generateOrderId();
        const totalAmount = parseFloat(data?.total_amount) || 0;
        const paymentLink = `https://pay.exemplo.com/checkout/${orderId}`;

        let paymentInstructions = "";
        switch (data?.payment_method) {
            case "pix":
                paymentInstructions = "📱 Você receberá o QR Code do PIX em instantes.";
                break;
            case "credit_card":
            case "debit_card":
                paymentInstructions = "💳 Clique no link abaixo para realizar o pagamento.";
                break;
            case "cash":
                paymentInstructions = "💵 Tenha o valor exato em mãos na hora da entrega.";
                break;
            default:
                paymentInstructions = "📧 Você receberá as instruções de pagamento por email.";
        }

        // Simular delay de processamento
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            screen: "ORDER_COMPLETE",
            data: {
                success: true,
                order_number: orderId,
                payment_link: paymentLink,
                payment_instructions: paymentInstructions,
                formatted_total: `R$ ${totalAmount.toFixed(2).replace('.', ',')}`,
                confirmation_message: `✅ Pedido ${orderId} criado com sucesso!\n\n${paymentInstructions}\n\nTotal: R$ ${totalAmount.toFixed(2).replace('.', ',')}\n\nVocê receberá atualizações do seu pedido por WhatsApp.`
            }
        };
    },

    // Tela de erro genérica
    ERROR: (message) => {
        return {
            screen: "ERROR",
            data: {
                error_message: typeof message === 'string' ? message : "Ocorreu um erro. Por favor, tente novamente.",
                retry_available: true
            }
        };
    }
};

// ==========================================
// HANDLER PRINCIPAL DO ENDPOINT
// ==========================================

export const getNextScreen = async (decryptedBody) => {
    const { screen, data, version, action, flow_token } = decryptedBody;

    console.log(`[E-commerce Flow] Action: ${action}, Screen: ${screen}`, {
        cart_size: data?.cart_items?.length || 0,
        flow_token
    });

    try {
        // Health check
        if (action === "ping") {
            return {
                data: {
                    status: "active",
                    version: "1.0.0",
                    timestamp: new Date().toISOString()
                }
            };
        }

        // Tratamento de erros do cliente
        if (data?.error) {
            console.error("Erro recebido do cliente:", data.error);
            return {
                data: {
                    acknowledged: true,
                    error_logged: true
                }
            };
        }

        // Inicialização do flow
        if (action === "INIT") {
            console.info("🛒 Iniciando E-commerce Flow");
            return SCREEN_RESPONSES.WELCOME;
        }

        // Troca de dados entre telas
        if (action === "data_exchange") {
            switch (screen) {
                // ===== TELA INICIAL =====
                case "WELCOME":
                    const menuChoice = data?.main_menu;

                    if (menuChoice === "catalog") {
                        return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);
                    } else if (menuChoice === "cart") {
                        return SCREEN_RESPONSES.CART(data);
                    } else if (menuChoice === "orders") {
                        return SCREEN_RESPONSES.ERROR("Histórico de pedidos em breve!");
                    } else if (menuChoice === "support") {
                        return SCREEN_RESPONSES.ERROR("Você será transferido para um atendente.");
                    }
                    break;

                // ===== CATEGORIAS =====
                case "CATALOG_CATEGORIES":
                    if (data?.category_id) {
                        return SCREEN_RESPONSES.CATALOG_PRODUCTS(data);
                    }
                    break;

                // ===== PRODUTOS =====
                case "CATALOG_PRODUCTS":
                    if (data?.product_id) {
                        return SCREEN_RESPONSES.PRODUCT_DETAIL(data);
                    } else if (data?.action === "back_to_categories") {
                        return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);
                    } else if (data?.action === "view_cart") {
                        return SCREEN_RESPONSES.CART(data);
                    }
                    break;

                // ===== DETALHES DO PRODUTO =====
                case "PRODUCT_DETAIL":
                    if (data?.action === "add_to_cart") {
                        const productId = parseInt(data.product_id);
                        const qty = parsePositiveInt(data.quantity);
                        const cartItems = data?.cart_items || [];
                        const available = getAvailableStock(productId, cartItems);

                        if (!qty) {
                            return SCREEN_RESPONSES.PRODUCT_DETAIL({
                                ...data,
                                error_message: "Quantidade inválida. Digite um número inteiro maior que zero."
                            });
                        }

                        if (available <= 0) {
                            return SCREEN_RESPONSES.PRODUCT_DETAIL({
                                ...data,
                                error_message: "Produto sem estoque disponível."
                            });
                        }

                        if (qty > available) {
                            return SCREEN_RESPONSES.PRODUCT_DETAIL({
                                ...data,
                                error_message: `Quantidade acima do estoque. Disponível: ${available}.`
                            });
                        }

                        // válido → adiciona ao carrinho
                        return SCREEN_RESPONSES.CART({
                            ...data,
                            action: "add_to_cart",
                            product_id: String(productId),
                            quantity: String(qty)
                        });
                    }
                    break;

                case "CART":
                    if (data?.action === "continue_shopping") {
                        return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);
                    } else if (data?.action === "checkout") {
                        if (!data?.cart_items || data.cart_items.length === 0) {
                            return SCREEN_RESPONSES.ERROR("Seu carrinho está vazio!");
                        }
                        return SCREEN_RESPONSES.CUSTOMER_DATA(data);
                    } else if (data?.action === "update_quantity" || data?.action === "remove_item") {
                        return SCREEN_RESPONSES.CART(data);
                    }
                    break;
                // ===== DADOS DO CLIENTE =====
                case "CUSTOMER_DATA":
                    if (data?.action === "continue") {
                        // Validar e continuar
                        return SCREEN_RESPONSES.CUSTOMER_VALIDATION(data);
                    } else if (data?.action === "back_to_cart") {
                        return SCREEN_RESPONSES.CART(data);
                    }
                    break;

                // ===== OPÇÕES DE ENTREGA =====
                case "SHIPPING_OPTIONS":
                    if (data?.shipping_option?.id) {
                        // Se escolheu retirada (id=1), pula endereço
                        if (parseInt(data.shipping_option.id) === 1) {
                            return SCREEN_RESPONSES.PAYMENT_METHOD(data);
                        }
                        return SCREEN_RESPONSES.SHIPPING_ADDRESS(data);
                    } else if (data?.action === "back") {
                        return SCREEN_RESPONSES.CUSTOMER_DATA(data);
                    }
                    break;

                // ===== ENDEREÇO DE ENTREGA =====
                case "SHIPPING_ADDRESS":
                    if (data?.action === "continue") {
                        // Validar endereço básico
                        const address = data?.shipping_address || {};
                        if (!address.street || !address.number || !address.neighborhood ||
                            !address.city || !address.state || !address.zip) {
                            return SCREEN_RESPONSES.ERROR("Por favor, preencha todos os campos obrigatórios do endereço.");
                        }
                        return SCREEN_RESPONSES.PAYMENT_METHOD(data);
                    } else if (data?.action === "back") {
                        return SCREEN_RESPONSES.SHIPPING_OPTIONS(data);
                    }
                    break;

                // ===== FORMA DE PAGAMENTO =====
                case "PAYMENT_METHOD":
                    if (data?.payment_method) {
                        return SCREEN_RESPONSES.ORDER_REVIEW(data);
                    } else if (data?.action === "back") {
                        // Voltar para endereço ou opções de entrega
                        if (parseInt(data?.shipping_option?.id) === 1) {
                            return SCREEN_RESPONSES.SHIPPING_OPTIONS(data);
                        }
                        return SCREEN_RESPONSES.SHIPPING_ADDRESS(data);
                    }
                    break;

                // ===== REVISÃO DO PEDIDO =====
                case "ORDER_REVIEW":
                    if (data?.action === "confirm_order") {
                        return await SCREEN_RESPONSES.ORDER_COMPLETE(data);
                    } else if (data?.action === "back") {
                        return SCREEN_RESPONSES.PAYMENT_METHOD(data);
                    } else if (data?.action === "edit_cart") {
                        return SCREEN_RESPONSES.CART(data);
                    } else if (data?.action === "edit_shipping") {
                        return SCREEN_RESPONSES.SHIPPING_OPTIONS(data);
                    } else if (data?.action === "edit_payment") {
                        return SCREEN_RESPONSES.PAYMENT_METHOD(data);
                    }
                    break;

                // ===== PEDIDO COMPLETO =====
                case "ORDER_COMPLETE":
                    if (data?.action === "new_order") {
                        // Reiniciar para novo pedido
                        return SCREEN_RESPONSES.WELCOME;
                    }
                    break;

                // ===== TELA DE ERRO =====
                case "ERROR":
                    if (data?.action === "retry") {
                        // Voltar para tela anterior ou inicial
                        return SCREEN_RESPONSES.WELCOME;
                    }
                    break;

                default:
                    console.warn(`⚠️ Tela não reconhecida: ${screen}`);
                    return SCREEN_RESPONSES.ERROR(`Tela "${screen}" não encontrada.`);
            }
        }

        // Ação não reconhecida
        console.error("❌ Ação não tratada:", { action, screen, data });
        return SCREEN_RESPONSES.ERROR("Ação não reconhecida. Por favor, tente novamente.");

    } catch (error) {
        console.error("💥 Erro no processamento:", error);
        return {
            data: {
                error: true,
                message: "Erro interno no servidor. Por favor, tente novamente.",
                technical_details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        };
    }
};

// ==========================================
// FUNÇÕES AUXILIARES PARA INTEGRAÇÃO
// ==========================================

/**
 * Função para processar webhook do WhatsApp após conclusão do flow
 * Será chamada quando o flow terminar e precisarmos enviar o link de pagamento
 */
export const handleFlowCompletion = async (flowToken, responseData) => {
    console.log("📱 Flow concluído, processando resposta:", { flowToken });

    if (responseData?.order_id && responseData?.payment_link) {
        // Aqui você enviaria uma mensagem de follow-up com o link de pagamento
        // usando a API do WhatsApp Business

        const message = {
            messaging_product: "whatsapp",
            to: flowToken, // Em produção, isso seria o número do telefone
            type: "text",
            text: {
                body: `🎉 *Pedido ${responseData.order_id} confirmado!*\n\n` +
                    `💰 *Total:* ${responseData.formatted_total}\n\n` +
                    `🔗 *Link para pagamento:*\n${responseData.payment_link}\n\n` +
                    `_Você tem 30 minutos para concluir o pagamento._`
            }
        };

        console.log("📤 Mensagem a ser enviada:", message);

        // Simular envio (em produção, usar API real do WhatsApp)
        // await whatsappAPI.sendMessage(message);
    }
};

/**
 * Função para validar dados antes de criar pedido real na API
 */
export const validateOrderData = (data) => {
    const errors = [];

    // Validar carrinho
    if (!data.cart_items || data.cart_items.length === 0) {
        errors.push("Carrinho vazio");
    }

    // Validar cliente
    if (!data.customer_data?.name || !data.customer_data?.phone) {
        errors.push("Dados do cliente incompletos");
    }

    // Validar entrega (se não for retirada)
    if (data.shipping_option?.id !== "1" && !data.shipping_address?.street) {
        errors.push("Endereço de entrega obrigatório");
    }

    // Validar pagamento
    if (!data.payment_method) {
        errors.push("Forma de pagamento não selecionada");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Função para formatar dados do pedido para enviar à API Laravel
 */
export const formatOrderForAPI = (flowData) => {
    const cartItems = flowData.cart_items || [];
    const customerData = flowData.customer_data || {};
    const shippingAddress = flowData.shipping_address || {};

    return {
        // Cliente
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_document: customerData.document,

        // Itens do pedido
        items: cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_amount: 0
        })),

        // Entrega
        shipping_option_id: flowData.shipping_option?.id,
        shipping_address: {
            street: shippingAddress.street,
            number: shippingAddress.number,
            complement: shippingAddress.complement,
            neighborhood: shippingAddress.neighborhood,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zip: shippingAddress.zip,
            country: "BR"
        },

        // Valores
        subtotal: flowData.subtotal,
        shipping_amount: flowData.shipping_amount || 0,
        discount_amount: flowData.discount_amount || 0,
        tax_amount: 0,
        total_amount: flowData.total_amount,

        // Pagamento
        payment_method: flowData.payment_method,
        payment_status: "pending",

        // Meta
        source: "whatsapp_flow",
        notes: flowData.notes,
        metadata: {
            flow_token: flowData.flow_token,
            flow_version: "1.0.0"
        }
    };
};

/**
 * Função para buscar pedidos do cliente (para implementação futura)
 */
export const getCustomerOrders = async (phone) => {
    // Mock de pedidos anteriores
    return [
        {
            id: "ORD-20241215-0001",
            date: "15/12/2024",
            status: "delivered",
            total: "R$ 127,50",
            items: 3
        },
        {
            id: "ORD-20241210-0023",
            date: "10/12/2024",
            status: "processing",
            total: "R$ 89,00",
            items: 2
        }
    ];
};

/**
 * Função para calcular frete dinâmico (para implementação futura)
 */
export const calculateShipping = async (zipCode, items) => {
    // Mock de cálculo de frete
    const weight = items.reduce((sum, item) => sum + (item.quantity * 0.5), 0); // 500g por item

    return {
        standard: {
            price: 15 + (weight * 2),
            days: 3
        },
        express: {
            price: 25 + (weight * 3),
            days: 1
        }
    };
};

// ==========================================
// LOGS E ANALYTICS
// ==========================================

/**
 * Função para logar interações do flow (para analytics)
 */
export const logFlowInteraction = (action, screen, data, flowToken) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        flow_token: flowToken,
        action,
        screen,
        cart_size: data?.cart_items?.length || 0,
        cart_value: data?.cart_items?.reduce((sum, item) => sum + item.subtotal, 0) || 0,
        event_data: {
            ...data,
            cart_items: undefined // Não logar itens completos do carrinho
        }
    };

    console.log("[ANALYTICS]", JSON.stringify(logEntry));

    // Em produção, enviar para serviço de analytics
    // analytics.track('flow_interaction', logEntry);
};

// ==========================================
// EXPORTS
// ==========================================

export default {
    getNextScreen,
    handleFlowCompletion,
    validateOrderData,
    formatOrderForAPI,
    getCustomerOrders,
    calculateShipping,
    logFlowInteraction
};