// Flow WhatsApp - Máfia Beer
// Parte 1: Tela Welcome com integração de API

const SCREEN_RESPONSES = {};

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
    return await getWelcomeScreen();
  }

  // Processamento da tela Welcome
  if (action === "data_exchange" && screen === "WELCOME") {
    return await processWelcomeSelection(data);
  }

  // Fallback para tela inicial
  return await getWelcomeScreen();
};

// Função para buscar e montar a tela WELCOME
async function getWelcomeScreen() {
  try {
    console.log("[Máfia Beer] Carregando tela de boas-vindas...");

    // Aqui você pode buscar dados dinâmicos de uma API
    // Por enquanto, vou usar dados estáticos baseados no seu JSON
    const menuOptions = await getMenuOptions();

    return {
      screen: "WELCOME",
      data: {
        // Dados dinâmicos que serão injetados no flow
        menu_options: menuOptions,
        version: "7.0",
        store_name: "Máfia Beer",
        welcome_message: "🍺 Bem-vindo à Máfia Beer! O que você deseja hoje?"
      }
    };

  } catch (error) {
    console.error("[Máfia Beer] Erro ao carregar tela Welcome:", error);
    
    // Fallback com opções estáticas
    return {
      screen: "WELCOME",
      data: {
        menu_options: [
          { "id": "growler", "title": "Pedir Growler (entrega rápida)" },
          { "id": "barrel", "title": "Pedir Barril (eventos)" },
          { "id": "pickup", "title": "Retirar em Ponto Parceiro" }
        ],
        welcome_message: "🍺 Bem-vindo à Máfia Beer! O que você deseja hoje?"
      }
    };
  }
}

// Função para buscar opções do menu via API
async function getMenuOptions() {
  try {
    // Substitua pela URL da sua API
    const apiUrl = "https://sua-api-cervejaria.com/menu-options";
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Adicione headers de autenticação se necessário
        // "Authorization": "Bearer seu-token"
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const menuData = await response.json();
    
    console.log("[Máfia Beer] Opções do menu carregadas da API:", menuData);
    
    // Mapear resposta da API para o formato esperado pelo flow
    return menuData.options || [
      { "id": "growler", "title": "Pedir Growler (entrega rápida)" },
      { "id": "barrel", "title": "Pedir Barril (eventos)" },
      { "id": "pickup", "title": "Retirar em Ponto Parceiro" }
    ];

  } catch (error) {
    console.error("[Máfia Beer] Erro ao buscar opções da API:", error);
    
    // Retorna opções padrão em caso de erro
    return [
      { "id": "growler", "title": "Pedir Growler (entrega rápida)" },
      { "id": "barrel", "title": "Pedir Barril (eventos)" },
      { "id": "pickup", "title": "Retirar em Ponto Parceiro" }
    ];
  }
}

// Função para processar a seleção feita na tela Welcome
async function processWelcomeSelection(data) {
  const selectedOption = data.main_menu;
  
  console.log("[Máfia Beer] Opção selecionada:", selectedOption);

  // Log dos dados do usuário
  const userData = {
    wa_id: data.wa_id,
    profile_name: data.nome || data.profile_name,
    selected_service: selectedOption,
    timestamp: new Date().toISOString(),
    flow_version: "v1.0"
  };

  console.log("[Máfia Beer] Dados do usuário:", userData);

  // Determinar próxima tela baseado na seleção
  switch (selectedOption) {
    case "growler":
      return {
        screen: "GROWLER_SELECTOR",
        data: {
          user_data: userData,
          service_type: "growler"
        }
      };

    case "barrel":
      return {
        screen: "BARREL_FORM", 
        data: {
          user_data: userData,
          service_type: "barrel"
        }
      };

    case "pickup":
      return {
        screen: "PICKUP_SELECTOR",
        data: {
          user_data: userData,
          service_type: "pickup"  
        }
      };

    default:
      console.log("[Máfia Beer] Opção inválida, retornando para Welcome");
      return await getWelcomeScreen();
  }
}