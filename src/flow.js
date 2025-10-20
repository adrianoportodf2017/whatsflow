/**
 * Endpoint E-commerce Flow WhatsApp - VERSÃO SIMPLIFICADA
 * Foco: Resolver problema do carrinho
 */

// ==========================================
// DADOS MOCKADOS
// ==========================================

import { MOCK_DATA } from './mockData.js';

  
// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

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
    return sum + (q * p);
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
    console.log("🛒 CART - Dados recebidos:", JSON.stringify(data, null, 2));
    
    let cartItems = Array.isArray(data?.cart_items) ? [...data.cart_items] : [];
    let cart_notice = "";

    // ADICIONAR AO CARRINHO - Verifica se tem action de adicionar
    if (data?.action === "add_to_cart" && data?.product_id && data?.quantity) {
      console.log("➕ Adicionando produto ao carrinho...", {
        product_id: data.product_id,
        quantity: data.quantity
      });

      const product = getProductById(parseInt(data.product_id));
      
      if (product) {
        const requested = Math.max(1, Number(parseInt(data.quantity, 10)) || 0);
        const existingIndex = cartItems.findIndex((item) => Number(item.product_id) === Number(product.id));
        const existingQty = existingIndex >= 0 ? Number(cartItems[existingIndex].quantity) || 0 : 0;
        const available = Math.max(0, Number(product.stock) - existingQty);
        const qtyToAdd = Math.min(requested, available);

        console.log("📊 Cálculos:", {
          requested,
          existingQty,
          available,
          qtyToAdd,
          existingIndex
        });

        if (available <= 0) {
          cart_notice = "Este item atingiu o limite de estoque no carrinho.";
        } else {
          if (existingIndex >= 0) {
            const newQty = existingQty + qtyToAdd;
            const unitPrice = Number(product.price) || 0;
            cartItems[existingIndex].quantity = newQty;
            cartItems[existingIndex].unit_price = unitPrice;
            cartItems[existingIndex].subtotal = newQty * unitPrice;
            console.log("✅ Produto atualizado no carrinho");
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
            console.log("✅ Novo produto adicionado ao carrinho");
          }
          
          if (qtyToAdd < requested) {
            cart_notice = `Quantidade ajustada para ${qtyToAdd} (estoque máximo disponível).`;
          }
        }
      } else {
        console.error("❌ Produto não encontrado:", data.product_id);
      }
    }

    const totals = calculateCartTotals(cartItems);

    // GERAR RESUMO DOS PRODUTOS
    const cart_summary = cartItems.length > 0 
      ? "📦 Produtos:\n" + cartItems.map(item => 
          `• ${item.name} (${item.quantity}x) - R$ ${Number(item.unit_price).toFixed(2).replace(".", ",")} cada`
        ).join("\n")
      : "Carrinho vazio";

    console.log("📦 Carrinho final:", {
      items: cartItems.length,
      total: totals.formattedSubtotal
    });

    return {
      screen: "CART",
      data: {
        cart_items: cartItems,
        cart_summary: cart_summary,
        actions: [
          { id: "continue_shopping", title: "🛍️ Continuar comprando" },
          { id: "edit_cart", title: "✏️ Editar quantidades" },
          { id: "checkout", title: "✅ Finalizar pedido" }
        ],
        is_empty: cartItems.length === 0,
        subtotal: totals.subtotal,
        formatted_subtotal: totals.formattedSubtotal,
        items_count: totals.itemsCount,
        cart_notice: cart_notice,
        subtotal_label: `Subtotal: ${totals.formattedSubtotal}`,
        items_label: `${totals.itemsCount} ${totals.itemsCount === 1 ? 'item' : 'itens'}`
      }
    };
  },

  CART_EDIT: (data) => {
    console.log("✏️ CART_EDIT - Dados recebidos:", JSON.stringify(data, null, 2));
    
    const cartItems = data?.cart_items || [];

    return {
      screen: "CART_EDIT",
      data: {
        cart_items: cartItems,
        edit_instructions: "Digite 0 para remover o produto. Após salvar, você poderá continuar comprando.",
        actions: [
          { id: "continue_shopping", title: "🛍️ Voltar ao catálogo" },
          { id: "finish", title: "✅ Finalizar pedido" }
        ]
      }
    };
  }
};

// ==========================================
// HANDLER PRINCIPAL
// ==========================================

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, action } = decryptedBody || {};

  console.log(`[E-commerce Flow] Action: ${action}, Step: ${data?.step || "N/A"}`);
  console.log(`[E-commerce Flow] Data recebido:`, JSON.stringify(data, null, 2));

  try {
    if (action === "ping") {
      return { data: { status: "active", version: "1.0.0", timestamp: new Date().toISOString() } };
    }

    if (action === "INIT") {
      console.info("🛒 Iniciando E-commerce Flow");
      return SCREEN_RESPONSES.WELCOME;
    }

    if (action === "data_exchange") {
      const step = data?.step;
      console.log(`📍 Step detectado: ${step}`);

      switch (step) {
        case "select_menu":
          console.log("📂 Step: select_menu");
          if (data?.main_menu === "catalog") {
            return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);
          } else if (data?.main_menu === "cart") {
            return SCREEN_RESPONSES.CART(data);
          }
          return SCREEN_RESPONSES.WELCOME;

        case "select_category":
          console.log("📂 Step: select_category");
          if (data?.category_id) {
            return SCREEN_RESPONSES.CATALOG_PRODUCTS(data);
          }
          return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);

        case "select_product":
          console.log("📂 Step: select_product");
          if (data?.product_id) {
            return SCREEN_RESPONSES.PRODUCT_DETAIL(data);
          }
          return SCREEN_RESPONSES.CATALOG_PRODUCTS(data);

        case "add_to_cart":
          console.log("📂 Step: add_to_cart");
          const productId = parseInt(data.product_id, 10);
          const qty = parsePositiveInt(data.quantity);
          const cartItems = data?.cart_items || [];
          const available = getAvailableStock(productId, cartItems);

          console.log("🔍 Validando adição ao carrinho:", {
            productId,
            qty,
            available,
            cartItemsLength: cartItems.length
          });

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

          // Vai para o carrinho com os dados de adicionar
          console.log("✅ Validação OK, indo para CART");
          return SCREEN_RESPONSES.CART({
            ...data,
            action: "add_to_cart",
            product_id: String(productId),
            quantity: String(qty)
          });

        case "cart_action":
          console.log("📂 Step: cart_action");
          
          // Se escolheu editar carrinho
          if (data?.cart_action === "edit_cart") {
            return SCREEN_RESPONSES.CART_EDIT(data);
          }
          
          // Navegação do carrinho
          if (data?.cart_action === "continue_shopping") {
            return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);
          } else if (data?.cart_action === "checkout") {
            if (!data?.cart_items || data.cart_items.length === 0) {
              return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);
            }
            // Por enquanto volta para categorias (você vai adicionar as outras telas depois)
            return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);
          }
          
          return SCREEN_RESPONSES.CART(data);

        case "update_cart":
          console.log("📂 Step: update_cart");
          // TODO: Implementar lógica de atualização do carrinho
          // Por enquanto só redireciona baseado no next_action
          
          if (data?.next_action === "continue_shopping") {
            return SCREEN_RESPONSES.CATALOG_CATEGORIES(data);
          } else if (data?.next_action === "finish") {
            // Vai pra tela terminal
            return {
              screen: "CART_FINISH",
              data: {
                message: "Obrigado pela compra!"
              }
            };
          }
          
          return SCREEN_RESPONSES.CART(data);

        default:
          console.warn(`⚠️ Step não reconhecido: ${step}`);
          return SCREEN_RESPONSES.WELCOME;
      }
    }

    console.error("❌ Ação não tratada:", { action, step: data?.step });
    return SCREEN_RESPONSES.WELCOME;
  } catch (error) {
    console.error("💥 Erro no processamento:", error);
    return SCREEN_RESPONSES.WELCOME;
  }
};

export default { getNextScreen };