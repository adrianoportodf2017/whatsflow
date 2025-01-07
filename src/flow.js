/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, version, action, flow_token } = decryptedBody;

  // Verificação de saúde do sistema
  if (action === "ping") {
    return {
      data: {
        status: "active",
      },
    };
  }

  // Tratamento de erros do cliente
  if (data?.error) {
    console.warn("Erro do cliente:", data);
    return {
      data: {
        acknowledged: true,
      },
    };
  }

  // Inicialização do fluxo
  if (action === "INIT") {
    return {
      screen: "WELCOME_SCREEN",
      data: {
        greeting: "Olá! 👋",
        message: "Como posso ajudar você hoje?",
        buttons: [
          {
            type: "reply",
            title: "Fazer Pedido",
            id: "make_order"
          },
          {
            type: "reply",
            title: "Suporte",
            id: "support"
          }
        ]
      },
    };
  }

  // Tratamento das interações do usuário
  if (action === "data_exchange") {
    switch (screen) {
      case "WELCOME_SCREEN":
        // Processamento da escolha inicial
        if (data.button_reply === "make_order") {
          return {
            screen: "ORDER_SCREEN",
            data: {
              message: "Qual produto você gostaria de pedir?",
              catalog_list: {
                title: "Nossos Produtos",
                items: [
                  { id: "1", title: "Produto 1", price: "R$ 50,00" },
                  { id: "2", title: "Produto 2", price: "R$ 75,00" }
                ]
              }
            }
          };
        } else if (data.button_reply === "support") {
          return {
            screen: "SUPPORT_SCREEN",
            data: {
              message: "Por favor, descreva seu problema:",
              input_field: {
                type: "text",
                placeholder: "Digite sua mensagem..."
              }
            }
          };
        }
        break;

      case "ORDER_SCREEN":
        // Processamento do pedido
        const selectedProduct = data.selected_item;
        if (selectedProduct) {
          return {
            screen: "CONFIRMATION_SCREEN",
            data: {
              message: `Você selecionou o produto ${selectedProduct.title}`,
              confirmation: {
                text: "Deseja confirmar seu pedido?",
                buttons: [
                  {
                    type: "reply",
                    title: "Confirmar",
                    id: "confirm_order"
                  },
                  {
                    type: "reply",
                    title: "Cancelar",
                    id: "cancel_order"
                  }
                ]
              }
            }
          };
        }
        break;

      case "SUPPORT_SCREEN":
        // Processamento da mensagem de suporte
        if (data.message) {
          // Aqui você pode adicionar lógica para salvar a mensagem ou encaminhar para um atendente
          return {
            screen: "SUCCESS",
            data: {
              message: "Obrigado pelo contato! Em breve um atendente entrará em contato.",
              extension_message_response: {
                params: {
                  flow_token,
                }
              }
            }
          };
        }
        break;

      case "CONFIRMATION_SCREEN":
        if (data.button_reply === "confirm_order") {
          // Aqui você pode adicionar lógica para processar o pedido
          return {
            screen: "SUCCESS",
            data: {
              message: "Pedido confirmado com sucesso! Obrigado pela preferência.",
              extension_message_response: {
                params: {
                  flow_token,
                }
              }
            }
          };
        } else if (data.button_reply === "cancel_order") {
          return {
            screen: "WELCOME_SCREEN",
            data: {
              message: "Pedido cancelado. Posso ajudar com mais alguma coisa?",
              buttons: [
                {
                  type: "reply",
                  title: "Fazer Novo Pedido",
                  id: "make_order"
                },
                {
                  type: "reply",
                  title: "Suporte",
                  id: "support"
                }
              ]
            }
          };
        }
        break;
    }
  }

  console.error("Requisição não tratada:", decryptedBody);
  throw new Error(
    "Requisição não tratada. Verifique se você está tratando a ação e tela corretas."
  );
};;
