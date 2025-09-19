// Flow WhatsApp - Máfia Beer (Seguindo padrão do Facebook)

const SCREEN_RESPONSES = {
  WELCOME: {
    "screen": "WELCOME",
    "data": {}
  },
  GROWLER_SELECTOR: {
    "screen": "GROWLER_SELECTOR", 
    "data": {
      "hubs": [
        {
          "id": "bar_do_zeca",
          "title": "Bar do Zeca — 1,2 km"
        },
        {
          "id": "emporio_da_cerva", 
          "title": "Empório da Cerva — 2,1 km"
        }
      ],
      "growlers": [
        {
          "id": "pilsen_1l",
          "title": "Pilsen 1L — R$ 15"
        },
        {
          "id": "ipa_1l",
          "title": "IPA 1L — R$ 18"  
        },
        {
          "id": "weiss_1l",
          "title": "Weiss 1L — R$ 17"
        }
      ]
    }
  },
  PAYMENT: {
    "screen": "PAYMENT",
    "data": {
      "pay_methods": [
        {
          "id": "pix",
          "title": "Pix (5% off)"
        },
        {
          "id": "dinheiro", 
          "title": "Dinheiro"
        },
        {
          "id": "cartao",
          "title": "Cartão na entrega"
        }
      ]
    }
  },
  BARREL_FORM: {
    "screen": "BARREL_FORM",
    "data": {}
  },
  BARREL_OPTIONS: {
    "screen": "BARREL_OPTIONS",
    "data": {
      "barrel_offers": [
        {
          "id": "combo_30l_ipa",
          "title": "Barril 30L IPA + Chopeira — R$ 350 + frete"
        },
        {
          "id": "combo_50l_pilsen", 
          "title": "Barril 50L Pilsen + Chopeira — R$ 520 + frete"
        }
      ]
    }
  },
  PICKUP_SELECTOR: {
    "screen": "PICKUP_SELECTOR",
    "data": {
      "partners": [
        {
          "id": "bar_do_zeca",
          "title": "Bar do Zeca — Rua XPTO, 123"
        },
        {
          "id": "emporio_da_cerva",
          "title": "Empório da Cerva — Av. ABC, 456"
        }
      ],
      "pickup_items": [
        {
          "id": "growler_pilsen",
          "title": "Growler Pilsen 1L — R$ 15"
        },
        {
          "id": "growler_ipa", 
          "title": "Growler IPA 1L — R$ 18"
        }
      ]
    }
  },
  PICKUP_CONFIRM: {
    "screen": "PICKUP_CONFIRM",
    "data": {}
  },
  SUMMARY: {
    "screen": "SUMMARY", 
    "data": {
      "order_id": "MB-2871"
    }
  },
  SUCCESS: {
    "screen": "SUCCESS",
    "data": {
      "extension_message_response": {
        "params": {
          "flow_token": "REPLACE_FLOW_TOKEN",
          "some_param_name": "PASS_CUSTOM_VALUE"
        }
      }
    }
  }
};

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, action, user } = decryptedBody;

  const wa_id = user?.wa_id || "";
  const profile_name = user?.name || "";

  console.log("[Máfia Beer Flow] Ação recebida:", action);
  console.log("[Máfia Beer Flow] Tela atual:", screen);
  console.log("[Máfia Beer Flow] Dados recebidos:", data);
  console.log("🍺 Cliente:", wa_id, "-", profile_name);

  // Verificação de status
  if (action === "ping") {
    return { data: { status: "active" } };
  }

  // Inicialização do flow
  if (action === "INIT") {
    return SCREEN_RESPONSES.WELCOME;
  }

  // Processamento das navegações
  if (action === "data_exchange") {
    return await handleDataExchange(screen, data, { wa_id, profile_name });
  }

  // Fallback para tela inicial
  return SCREEN_RESPONSES.WELCOME;
};

// Função principal para processar navegações
async function handleDataExchange(currentScreen, data, user) {
  console.log(`[Máfia Beer] Processando tela: ${currentScreen}`);

  switch (currentScreen) {
    case "WELCOME":
      return handleWelcomeScreen(data, user);
    
    case "GROWLER_SELECTOR":
      return handleGrowlerSelector(data, user);
    
    case "PAYMENT":
      return handlePayment(data, user);
    
    case "BARREL_FORM":
      return handleBarrelForm(data, user);
    
    case "BARREL_OPTIONS": 
      return handleBarrelOptions(data, user);
    
    case "PICKUP_SELECTOR":
      return handlePickupSelector(data, user);
    
    case "PICKUP_CONFIRM":
      return handlePickupConfirm(data, user);
    
    case "SUMMARY":
      return handleSummary(data, user);
    
    default:
      console.log("[Máfia Beer] Tela não reconhecida, retornando para WELCOME");
      return SCREEN_RESPONSES.WELCOME;
  }
}

// Handler para tela Welcome
function handleWelcomeScreen(data, user) {
  const selectedOption = data.main_menu;
  
  console.log("[Máfia Beer] Opção selecionada no menu principal:", selectedOption);

  // Log dos dados do usuário para analytics
  logUserAction(user, "menu_selection", { 
    selected_service: selectedOption,
    screen: "WELCOME" 
  });

  // Navegar baseado na seleção
  switch (selectedOption) {
    case "growler":
      return SCREEN_RESPONSES.GROWLER_SELECTOR;
    
    case "barrel":
      return SCREEN_RESPONSES.BARREL_FORM;
    
    case "pickup":
      return SCREEN_RESPONSES.PICKUP_SELECTOR;
    
    default:
      console.log("[Máfia Beer] Opção inválida:", selectedOption);
      return SCREEN_RESPONSES.WELCOME;
  }
}

// Handler para seleção de growler
function handleGrowlerSelector(data, user) {
  console.log("[Máfia Beer] Dados do growler:", data);

  // Validar dados obrigatórios
  if (!data.cep || !data.hub || !data.item || !data.qtde) {
    console.log("[Máfia Beer] Dados incompletos no growler, retornando");
    return SCREEN_RESPONSES.GROWLER_SELECTOR;
  }

  // Log da seleção
  logUserAction(user, "growler_selection", {
    cep: data.cep,
    hub: data.hub, 
    item: data.item,
    quantity: data.qtde
  });

  return SCREEN_RESPONSES.PAYMENT;
}

// Handler para pagamento
function handlePayment(data, user) {
  console.log("[Máfia Beer] Método de pagamento selecionado:", data.payment);

  logUserAction(user, "payment_method", {
    payment_method: data.payment
  });

  return SCREEN_RESPONSES.SUMMARY;
}

// Handler para formulário de barril
function handleBarrelForm(data, user) {
  console.log("[Máfia Beer] Dados do evento:", data);

  if (!data.date || !data.people || !data.address) {
    console.log("[Máfia Beer] Dados do evento incompletos");
    return SCREEN_RESPONSES.BARREL_FORM;
  }

  logUserAction(user, "event_info", {
    event_date: data.date,
    people_count: data.people,
    address: data.address
  });

  return SCREEN_RESPONSES.BARREL_OPTIONS;
}

// Handler para opções de barril
function handleBarrelOptions(data, user) {
  console.log("[Máfia Beer] Barril selecionado:", data.barrel_choice);

  logUserAction(user, "barrel_selection", {
    barrel_option: data.barrel_choice
  });

  return SCREEN_RESPONSES.SUMMARY;
}

// Handler para seleção de retirada
function handlePickupSelector(data, user) {
  console.log("[Máfia Beer] Seleção de retirada:", data);

  if (!data.partner || !data.pickup_item) {
    return SCREEN_RESPONSES.PICKUP_SELECTOR;
  }

  logUserAction(user, "pickup_selection", {
    partner: data.partner,
    pickup_item: data.pickup_item
  });

  return SCREEN_RESPONSES.PICKUP_CONFIRM;
}

// Handler para confirmação de retirada
function handlePickupConfirm(data, user) {
  console.log("[Máfia Beer] Confirmando retirada");

  logUserAction(user, "pickup_confirmed", {});

  return SCREEN_RESPONSES.SUMMARY;
}

// Handler para resumo final
async function handleSummary(data, user) {
  console.log("[Máfia Beer] Finalizando pedido");

  // Aqui você pode integrar com sua API para salvar o pedido
  const orderData = await processFinalOrder(data, user);
  
  logUserAction(user, "order_completed", {
    order_id: orderData.order_id
  });

  return SCREEN_RESPONSES.SUCCESS;
}

// Função para processar pedido final (integração com API)
async function processFinalOrder(data, user) {
  try {
    // Exemplo de integração com API da cervejaria
    const response = await fetch("https://sua-api-cervejaria.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer seu-token"
      },
      body: JSON.stringify({
        customer: user,
        order_data: data,
        timestamp: new Date().toISOString(),
        source: "whatsapp_flow"
      })
    });

    const result = await response.json();
    console.log("[Máfia Beer] Pedido salvo:", result);

    return {
      order_id: result.order_id || `MB-${Date.now()}`
    };

  } catch (error) {
    console.error("[Máfia Beer] Erro ao salvar pedido:", error);
    
    // Fallback - gerar ID local
    return {
      order_id: `MB-${Date.now()}`
    };
  }
}

// Função para log de ações do usuário (analytics)
function logUserAction(user, action, details) {
  const logData = {
    wa_id: user.wa_id,
    profile_name: user.profile_name,
    action: action,
    details: details,
    timestamp: new Date().toISOString(),
    flow_version: "v1.0"
  };

  console.log("[Máfia Beer Analytics]:", logData);

  // Aqui você pode enviar para sua API de analytics
  // sendToAnalytics(logData);
}