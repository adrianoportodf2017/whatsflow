/**
 * Endpoint E-commerce Flow WhatsApp - VERSÃO CORRIGIDA FINAL
 */

// ==========================================
// DADOS MOCKADOS
// ==========================================

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
  },
  shippingOptions: [
    { id: 1, name: "Retirada no Local", description: "Retire seu pedido em nossa loja", price: 0.0, estimatedDays: 0 },
    { id: 2, name: "Entrega Padrão", description: "Entrega em 2-3 dias úteis", price: 15.0, estimatedDays: 3 },
    { id: 3, name: "Entrega Expressa", description: "Entrega no mesmo dia (pedidos até 14h)", price: 25.0, estimatedDays: 0 },
    { id: 4, name: "Entrega Agendada", description: "Escolha o melhor dia para receber", price: 20.0, estimatedDays: null }
  ],
  paymentMethods: [
    { id: "pix", name: "PIX", description: "Pagamento instantâneo com 5% de desconto", discount: 5 },
    { id: "credit_card", name: "Cartão de Crédito", description: "Parcelamento em até 3x sem juros", discount: 0 },
    { id: "debit_card", name: "Cartão de Débito", description: "Débito à vista", discount: 0 },
    { id: "cash", name: "Dinheiro na Entrega", description: "Pague ao receber (necessário valor exato)", discount: 0 }
  ]
};

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

const generateOrderId = () => {
  const prefix = "ORD";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${date}-${random}`;
};

const getProductById = (productId) => {
  const pid = Number(productId);
  for (const categoryProducts of Object.values(MOCK_DATA.products)) {
    const product = categoryProducts.find((p) => Number(p.id) === pid);
    if (product) return product;
  }
  return null;
};

const calculateCartTotals = (cartItems) => {
  const subtotal = (cartItems || []).reduce((sum, item) => {
    const q = Number(item.quantity) || 0;
    const p = Number(item.unit_price) || 0;
    const st = Number(item.subtotal);
    return sum + (Number.isFinite(st) ? st : q * p);
  }, 0);

  const itemsCount = (cartItems || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  return {
    subtotal,
    itemsCount,
    formattedSubtotal: `R$ ${subtotal.toFixed(2).replace(".", ",")}`
  };
};

const parsePositiveInt = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const getCartQty = (cartItems = [], productId) => {
  const pid = Number(productId);
  const found = cartItems.find((i) => Number(i.product_id) === pid);
  return found ? parseInt(found.quantity || 0, 10) : 0;
};

const getAvailableStock = (productId, cartItems = []) => {
  const p = getProductById(productId);
  if (!p) return 0;
  const inCart = getCartQty(cartItems, productId);
  return Math.max(0, (parseInt(p.stock, 10) || 0) - inCart);
};

const validatePhone = (phone) => {
  if (!phone) return false;
  const cleaned = String(phone).replace(/\D/g, "");
  return cleaned.length === 11 || cleaned.length === 10;
};

const validateCPF = (cpf) => {
  if (!cpf) return false;
  const cleaned = String(cpf).replace(/\D/g, "");
  return cleaned.length === 11;
};

// ==========================================
// RESPOSTAS DAS TELAS
// ==========================================

const SCREEN_RESPONSES = {
  WELCOME: {
    screen: "WELCOME",
    data: {
      menu_options: [
        { id: "catalog", title: "📦 Ver Produtos" },
        { id: "cart", title: "🛒 Meu Carrinho" }
      ],
      cart_items: [],
      cart_count: 0
    }
  },

  CATALOG_CATEGORIES: (data) => {
    const cartItems = data?.cart_items || [];
    const cartCount = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    return {
      screen: "CATALOG_CATEGORIES",
      data: {
        categories: MOCK_DATA.categories.map((cat) => ({
          id: String(cat.id),
          title: cat.name,
          description: cat.description
        })),
        cart_items: cartItems,
        cart_count: cartCount
      }
    };
  },

  CATALOG_PRODUCTS: (data) => {
    const categoryId = parseInt(data?.category_id);
    const cartItems = data?.cart_items || [];
    const products = MOCK_DATA.products[categoryId] || [];
    const category = MOCK_DATA.categories.find((c) => c.id === categoryId);
    return {
      screen: "CATALOG_PRODUCTS",
      data: {
        category_name: category?.name || "Produtos",
        products: products.map((prod) => ({
          id: String(prod.id),
          title: prod.name,
          description: `R$ ${Number(prod.price).toFixed(2).replace(".", ",")} - ${prod.description}`
        })),
        cart_items: cartItems,
        cart_count: cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
      }
    };
  },

  PRODUCT_DETAIL: (data) => {
    const productId = parseInt(data?.product_id);
    const product = getProductById(productId);
    const cartItems = data?.cart_items || [];

    if (!product) {
      return {
        screen: "WELCOME",
        data: { ...SCREEN_RESPONSES.WELCOME.data }
      };
    }

    const available = getAvailableStock(productId, cartItems);
    return {
      screen: "PRODUCT_DETAIL",
      data: {
        product_id: Number(product.id),
        product_name: product.name,
        product_price: `R$ ${Number(product.price).toFixed(2).replace(".", ",")}`,
        product_description: product.description,
        product_sku: product.sku,
        product_stock: available > 0 ? `${available} unidades disponíveis` : "Indisponível",
        error_message: data?.error_message || "",
        cart_items: cartItems
      }
    };
  },

  CART: (data) => {
    let cartItems = Array.isArray(data?.cart_items) ? [...data.cart_items] : [];
    let cart_notice = "";

    // Adicionar ao carrinho
    if (data?.action === "add_to_cart" && data?.product_id && data?.quantity) {
      const product = getProductById(parseInt(data.product_id));
      if (product) {
        const requested = Math.max(1, Number(parseInt(data.quantity, 10)) || 0);
        const existingIndex = cartItems.findIndex((item) => Number(item.product_id) === Number(product.id));
        const existingQty = existingIndex >= 0 ? Number(cartItems[existingIndex].quantity) || 0 : 0;
        const available = Math.max(0, Number(product.stock) - existingQty);
        const qtyToAdd = Math.min(requested, available);

        if (available <= 0) {
          cart_notice = "Este item atingiu o limite de estoque no carrinho.";
        } else {
          if (existingIndex >= 0) {
            const newQty = existingQty + qtyToAdd;
            const unitPrice = Number(cartItems[existingIndex].unit_price) || Number(product.price) || 0;
            cartItems[existingIndex].quantity = newQty;
            cartItems[existingIndex].unit_price = unitPrice;
            cartItems[existingIndex].subtotal = newQty * unitPrice;
          } else {
            const unitPrice = Number(product.price) || 0;
            const quantity = Number(qtyToAdd) || 0;
            cartItems.push({
              product_id: Number(product.id),
              name: product.name,
              unit_price: unitPrice,
              quantity,
              subtotal: unitPrice * quantity
            });
          }
          if (qtyToAdd < requested) {
            cart_notice = `Quantidade ajustada para ${qtyToAdd} (estoque máximo disponível).`;
          }
        }
      }
    }

    const totals = calculateCartTotals(cartItems);

    return {
      screen: "CART",
      data: {
        action: "",
        cart_items: cartItems,
        items_display: cartItems.map((item) => {
          const unit = Number(item.unit_price) || 0;
          const qty = Number(item.quantity) || 0;
          const st = unit * qty;
          return {
            id: String(item.product_id),
            title: `${item.name} (${qty}x)`,
            description: `R$ ${unit.toFixed(2).replace(".", ",")} cada | Total: R$ ${st.toFixed(2).replace(".", ",")}`
          };
        }),
        actions: [
          { id: "continue_shopping", title: "🛍️ Continuar comprando" },
          { id: "checkout", title: "✅ Finalizar pedido" }
        ],
        is_empty: cartItems.length === 0,
        subtotal: totals.subtotal,
        formatted_subtotal: totals.formattedSubtotal,
        items_count: totals.itemsCount,
        cart_notice: cart_notice,
        subtotal_label: `Subtotal: ${totals.formattedSubtotal}`,
        items_label: `Itens: ${totals.itemsCount}`
      }
    };
  },

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

  CUSTOMER_VALIDATION: (data) => {
    const cartItems = data?.cart_items || [];
    const customerData = data?.customer_data || {};
    const errors = [];

    if (!customerData.name || customerData.name.length < 3) {
      errors.push("Nome deve ter pelo menos 3 caracteres");
    }
    if (!validatePhone(customerData.phone)) {
      errors.push("Telefone inválido (use DDD + número)");
    }
    if (customerData.email && !String(customerData.email).includes("@")) {
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

    return SCREEN_RESPONSES.SHIPPING_OPTIONS(data);
  },

  SHIPPING_OPTIONS: (data) => {
    const cartItems = data?.cart_items || [];
    const customerData = data?.customer_data || {};
    return {
      screen: "SHIPPING_OPTIONS",
      data: {
        shipping_options: MOCK_DATA.shippingOptions.map((opt) => ({
          id: String(opt.id),
          title: `${opt.name} - ${opt.price === 0 ? "Grátis" : `R$ ${Number(opt.price).toFixed(2).replace(".", ",")}`}`,
          description: opt.description
        })),
        cart_items: cartItems,
        customer_data: customerData
      }
    };
  },

  SHIPPING_ADDRESS: (data) => {
    const cartItems = data?.cart_items || [];
    const customerData = data?.customer_data || {};
    const shippingOption = data?.shipping_option || {};

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

  PAYMENT_METHOD: (data) => {
    const cartItems = data?.cart_items || [];
    const totals = calculateCartTotals(cartItems);
    const shippingOption = MOCK_DATA.shippingOptions.find((opt) => opt.id === parseInt(data?.shipping_option?.id));
    const shippingPrice = Number(shippingOption?.price) || 0;
    const total = totals.subtotal + shippingPrice;

    return {
      screen: "PAYMENT_METHOD",
      data: {
        payment_methods: MOCK_DATA.paymentMethods.map((method) => ({
          id: method.id,
          title: method.name,
          description: method.description,
          total_with_discount:
            method.discount > 0
              ? `Total com desconto: R$ ${(total * (1 - method.discount / 100)).toFixed(2).replace(".", ",")}`
              : ""
        })),
        cart_items: cartItems,
        customer_data: data?.customer_data || {},
        shipping_option: data?.shipping_option || {},
        shipping_address: data?.shipping_address || {},
        subtotal: totals.subtotal,
        shipping_price: shippingPrice,
        total: total,
        formatted_total: `R$ ${total.toFixed(2).replace(".", ",")}`
      }
    };
  },

  ORDER_REVIEW: (data) => {
    const cartItems = data?.cart_items || [];
    const totals = calculateCartTotals(cartItems);
    const shippingOption = MOCK_DATA.shippingOptions.find((opt) => opt.id === parseInt(data?.shipping_option?.id));
    const shippingPrice = Number(shippingOption?.price) || 0;
    const paymentMethod = MOCK_DATA.paymentMethods.find((method) => method.id === data?.payment_method);
    const discount = Number(paymentMethod?.discount) || 0;
    const discountAmount = (totals.subtotal + shippingPrice) * (discount / 100);
    const total = totals.subtotal + shippingPrice - discountAmount;

    return {
      screen: "ORDER_REVIEW",
      data: {
        order_subtotal: `R$ ${totals.subtotal.toFixed(2).replace(".", ",")}`,
        order_shipping: shippingOption?.name || "N/A",
        order_shipping_price: `R$ ${shippingPrice.toFixed(2).replace(".", ",")}`,
        order_payment: paymentMethod?.name || "N/A",
        order_discount: discount > 0 ? `${discount}% - R$ ${discountAmount.toFixed(2).replace(".", ",")}` : "Sem desconto",
        order_total: `R$ ${total.toFixed(2).replace(".", ",")}`,
        customer_name: data?.customer_data?.name || "",
        customer_phone: data?.customer_data?.phone || "",
        customer_email: data?.customer_data?.email || "Não informado",
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

  ORDER_COMPLETE: async (data) => {
    const orderId = generateOrderId();
    const totalAmount = Number(data?.total_amount) || 0;
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

    // Simula pequena latência
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      screen: "ORDER_COMPLETE",
      data: {
        success: true,
        order_number: orderId,
        payment_link: paymentLink,
        payment_instructions: paymentInstructions,
        formatted_total: `R$ ${totalAmount.toFixed(2).replace(".", ",")}`,
        confirmation_message: `Pedido ${orderId} criado com sucesso!`
      }
    };
  },

  // Tela de erro genérica
  ERROR: (message) => {
    return {
      screen: "ERROR",
      data: {
        error_message: message || "Ocorreu um erro. Por favor, tente novamente.",
        retry_available: true
      }
    };
  }
};

// ==========================================
// HANDLER PRINCIPAL
// ==========================================

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, action } = decryptedBody || {};

  console.log(`[E-commerce Flow] Action: ${action}, Screen: ${screen || "N/A"}`, {
    has_product_id: !!data?.product_id,
    has_quantity: !!data?.quantity,
    has_action: !!data?.action,
    cart_size: data?.cart_items?.length || 0
  });

  try {
    if (action === "ping") {
      return { data: { status: "active", version: "1.0.0", timestamp: new Date().toISOString() } };
    }

    if (action === "INIT") {
      console.info("🛒 Iniciando E-commerce Flow");
      return SCREEN_RESPONSES.WELCOME;
    }

    if (action === "data_exchange") {
      let currentScreen = screen || data?.NEXT || data?.next;

      // Heurística: se veio comando de add_to_cart sem screen, considerar que veio da tela de produto
      if (!currentScreen && data?.product_id && data?.quantity && data?.action === "add_to_cart") {
        currentScreen = "PRODUCT_DETAIL";
      }
      console.log(`📍 Tela detectada: ${currentScreen}`);

      switch (currentScreen) {
        case "WELCOME":
          if (data?.main_menu === "catalog") {
            return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);
          } else if (data?.main_menu === "cart") {
            return SCREEN_RESPONSES.CART(data);
          }
          return SCREEN_RESPONSES.WELCOME;

        case "CATALOG_CATEGORIES":
          if (data?.category_id) {
            return SCREEN_RESPONSES.CATALOG_PRODUCTS(data);
          }
          return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);

        case "CATALOG_PRODUCTS":
          if (data?.product_id) {
            return SCREEN_RESPONSES.PRODUCT_DETAIL(data);
          }
          return SCREEN_RESPONSES.CATALOG_PRODUCTS(data);

        case "PRODUCT_DETAIL":
          if (data?.action === "add_to_cart") {
            const productId = parseInt(data.product_id, 10);
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

            return SCREEN_RESPONSES.CART({
              ...data,
              action: "add_to_cart",
              product_id: String(productId),
              quantity: String(qty)
            });
          }
          return SCREEN_RESPONSES.PRODUCT_DETAIL(data);

        case "CART":
          if (data?.action === "continue_shopping") {
            return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);
          } else if (data?.action === "checkout") {
            if (!data?.cart_items || data.cart_items.length === 0) {
              return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);
            }
            return SCREEN_RESPONSES.CUSTOMER_DATA(data);
          }
          return SCREEN_RESPONSES.CART(data);

        case "CUSTOMER_DATA":
          if (data?.action === "continue") {
            return SCREEN_RESPONSES.CUSTOMER_VALIDATION(data);
          }
          return SCREEN_RESPONSES.CUSTOMER_DATA(data);

        case "SHIPPING_OPTIONS":
          if (data?.shipping_option?.id) {
            if (parseInt(data.shipping_option.id) === 1) {
              return SCREEN_RESPONSES.PAYMENT_METHOD(data);
            }
            return SCREEN_RESPONSES.SHIPPING_ADDRESS(data);
          }
          return SCREEN_RESPONSES.SHIPPING_OPTIONS(data);

        case "SHIPPING_ADDRESS":
          if (data?.action === "continue") {
            const address = data?.shipping_address || {};
            if (!address.street || !address.number || !address.neighborhood || !address.city || !address.state || !address.zip) {
              return SCREEN_RESPONSES.SHIPPING_ADDRESS(data);
            }
            return SCREEN_RESPONSES.PAYMENT_METHOD(data);
          }
          return SCREEN_RESPONSES.SHIPPING_ADDRESS(data);

        case "PAYMENT_METHOD":
          if (data?.payment_method) {
            return SCREEN_RESPONSES.ORDER_REVIEW(data);
          }
          return SCREEN_RESPONSES.PAYMENT_METHOD(data);

        case "ORDER_REVIEW":
          if (data?.action === "confirm_order") {
            return await SCREEN_RESPONSES.ORDER_COMPLETE(data);
          }
          return SCREEN_RESPONSES.ORDER_REVIEW(data);

        default:
          console.warn(`⚠️ Tela não reconhecida: ${currentScreen}`);
          return SCREEN_RESPONSES.ERROR("Tela não reconhecida.");
      }
    }

    console.error("❌ Ação não tratada:", { action, screen, data });
    return SCREEN_RESPONSES.ERROR("Ação não tratada pelo endpoint.");
  } catch (error) {
    console.error("💥 Erro no processamento:", error);
    return SCREEN_RESPONSES.ERROR("Falha interna no processamento.");
  }
};

export default { getNextScreen };
