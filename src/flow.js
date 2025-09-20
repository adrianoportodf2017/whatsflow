/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Definição das telas e seus dados conforme o JSON do Flow
const SCREEN_RESPONSES = {
  WELCOME: {
    screen: "WELCOME",
    data: {
      main_menu: [
        {
          id: "growler",
          title: "Pedir Growler (entrega rápida)"
        },
        {
          id: "barrel",
          title: "Pedir Barril (eventos)"
        },
        {
          id: "pickup",
          title: "Retirar em Ponto Parceiro"
        }
      ]
    }
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
          "order_id": "MB-2871" // Será substituído por ID único
      }
  }
};

// Função para gerar um ID de pedido único
const generateOrderId = () => {
  const prefix = "MB-";
  const number = Math.floor(Math.random() * 9000) + 1000;
  return prefix + number;
};

// Função para processar e salvar dados do pedido (mock - substitua pela sua lógica)
const processOrder = async (orderData) => {
  // Aqui você salvaria no banco de dados, enviaria emails, etc.
  console.log("Processando pedido:", orderData);
  
  // Simular processamento assíncrono
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve({
              orderId: generateOrderId(),
              status: "processed"
          });
      }, 100);
  });
};

// Função principal do endpoint
export const getNextScreen = async (decryptedBody) => {
  const { screen, data, version, action, flow_token } = decryptedBody;
  
  console.log(`[Flow] Action: ${action}, Screen: ${screen}`, { data });
  
  // Handle health check request
  if (action === "ping") {
      return {
          data: {
              status: "active",
          },
      };
  }

  // Handle error notification
  if (data?.error) {
      console.warn("Received client error:", data);
      return {
          data: {
              acknowledged: true,
          },
      };
  }

  // Handle initial request when opening the flow
  if (action === "INIT") {
      console.info("🍺 Iniciando Máfia Beer Flow");
      return SCREEN_RESPONSES.WELCOME;
  }

  if (action === "data_exchange") {
      // Handle the request based on the current screen
      switch (screen) {
          case "WELCOME":
              console.info("📋 Tela de boas-vindas - Menu principal");
              // O Flow já controla a navegação via routing_model
              // Apenas retorna a próxima tela baseada na escolha
              const choice = data?.main_menu;
              
              if (choice === "growler") {
                  return SCREEN_RESPONSES.GROWLER_SELECTOR;
              } else if (choice === "barrel") {
                  return SCREEN_RESPONSES.BARREL_FORM;
              } else if (choice === "pickup") {
                  return SCREEN_RESPONSES.PICKUP_SELECTOR;
              }
              
              // Fallback para growler
              return SCREEN_RESPONSES.GROWLER_SELECTOR;

          case "GROWLER_SELECTOR":
              console.info("🍺 Seleção de growler:", {
                  cep: data?.cep,
                  hub: data?.hub,
                  item: data?.item,
                  qtde: data?.qtde
              });
              
              // Validar dados obrigatórios
              if (!data?.cep || !data?.hub || !data?.item || !data?.qtde) {
                  console.warn("Dados incompletos no growler selector");
                  return SCREEN_RESPONSES.GROWLER_SELECTOR;
              }
              
              // Armazenar dados do growler para usar no summary
              // Em produção, você salvaria isso em sessão/banco
              
              return SCREEN_RESPONSES.PAYMENT;

          case "PAYMENT":
              console.info("💳 Forma de pagamento selecionada:", data?.payment);
              
              if (!data?.payment) {
                  console.warn("Forma de pagamento não selecionada");
                  return SCREEN_RESPONSES.PAYMENT;
              }
              
              // Processar para SUMMARY
              const summaryResponse = { ...SCREEN_RESPONSES.SUMMARY };
              summaryResponse.data.order_id = generateOrderId();
              
              return summaryResponse;

          case "BARREL_FORM":
              console.info("🛢️ Formulário de barril:", {
                  date: data?.date,
                  people: data?.people,
                  address: data?.address
              });
              
              // Validar dados do evento
              if (!data?.date || !data?.people || !data?.address) {
                  console.warn("Dados do evento incompletos");
                  return SCREEN_RESPONSES.BARREL_FORM;
              }
              
              return SCREEN_RESPONSES.BARREL_OPTIONS;

          case "BARREL_OPTIONS":
              console.info("🎯 Opção de barril selecionada:", data?.barrel_choice);
              
              if (!data?.barrel_choice) {
                  console.warn("Opção de barril não selecionada");
                  return SCREEN_RESPONSES.BARREL_OPTIONS;
              }
              
              // Ir direto para SUMMARY conforme routing_model
              const barrelSummary = { ...SCREEN_RESPONSES.SUMMARY };
              barrelSummary.data.order_id = generateOrderId();
              
              return barrelSummary;

          case "PICKUP_SELECTOR":
              console.info("📍 Seleção de retirada:", {
                  partner: data?.partner,
                  pickup_item: data?.pickup_item
              });
              
              if (!data?.partner || !data?.pickup_item) {
                  console.warn("Dados de retirada incompletos");
                  return SCREEN_RESPONSES.PICKUP_SELECTOR;
              }
              
              return SCREEN_RESPONSES.PICKUP_CONFIRM;

          case "PICKUP_CONFIRM":
              console.info("✅ Confirmação de retirada");
              
              // Ir para SUMMARY
              const pickupSummary = { ...SCREEN_RESPONSES.SUMMARY };
              pickupSummary.data.order_id = generateOrderId();
              
              return pickupSummary;

          case "SUMMARY":
              console.info("📋 Finalizando pedido - SUMMARY é terminal");
              
              // O SUMMARY é uma tela terminal que não navega para lugar nenhum
              // O Flow vai chamar a ação "complete" automaticamente
              
              // Aqui você pode processar o pedido final
              try {
                  const orderData = {
                      orderId: data?.order_id || generateOrderId(),
                      timestamp: new Date().toISOString(),
                      flowData: data
                  };
                  
                  await processOrder(orderData);
                  
                  // Retornar dados para completar o fluxo
                  return {
                      data: {
                          extension_message_response: {
                              params: {
                                  flow_token: flow_token,
                                  order_id: orderData.orderId,
                                  status: "completed"
                              }
                          }
                      }
                  };
                  
              } catch (error) {
                  console.error("Erro ao processar pedido:", error);
                  // Retornar erro para o Flow
                  return {
                      data: {
                          error: "Erro interno. Tente novamente."
                      }
                  };
              }

          default:
              console.warn(`⚠️ Tela não reconhecida: ${screen}`);
              // Retornar para tela inicial em caso de erro
              return SCREEN_RESPONSES.WELCOME;
      }
  }

  console.error("❌ Unhandled request body:", decryptedBody);
  throw new Error(
      `Unhandled endpoint request. Action: ${action}, Screen: ${screen}`
  );
};

// Função auxiliar para buscar hubs baseado no CEP (mock)
export const getHubsByCep = async (cep) => {
  // Mock: Em produção, consultaria API de CEP e hubs próximos
  console.log(`Buscando hubs para CEP: ${cep}`);
  
  return [
      {
          "id": "bar_do_zeca",
          "title": "Bar do Zeca — 1,2 km"
      },
      {
          "id": "emporio_da_cerva",
          "title": "Empório da Cerva — 2,1 km"
      }
  ];
};

// Função para calcular sugestões de barril baseado no número de pessoas
export const getBarrelSuggestions = (people) => {
  console.log(`Calculando sugestões para ${people} pessoas`);
  
  const suggestions = [];
  
  if (people <= 20) {
      suggestions.push({
          "id": "combo_30l_ipa",
          "title": "Barril 30L IPA + Chopeira — R$ 350 + frete"
      });
  }
  
  if (people > 15) {
      suggestions.push({
          "id": "combo_50l_pilsen",
          "title": "Barril 50L Pilsen + Chopeira — R$ 520 + frete"
      });
  }
  
  return suggestions.length > 0 ? suggestions : SCREEN_RESPONSES.BARREL_OPTIONS.data.barrel_offers;
};

// Função para logging de interações do flow
export const logFlowInteraction = (action, screen, data) => {
  const timestamp = new Date().toISOString();
  const logData = {
      timestamp,
      action,
      screen,
      ...(data && { data })
  };
  
  console.log(`[${timestamp}] 🍺 Máfia Beer Flow:`, logData);
  
  // Em produção, enviar para serviço de analytics
  // analytics.track('flow_interaction', logData);
};