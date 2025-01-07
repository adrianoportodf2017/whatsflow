export const getNextScreen = async (decryptedBody) => {
  const { screen, data, action, flow_token } = decryptedBody;

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
      screen: "TELA_BOAS_VINDAS",
      data: {},
      layout: {
        type: "SingleColumnLayout",
        children: [
          {
            type: "TextHeading",
            text: "Olá, Mundo"
          },
          {
            type: "TextBody",
            text: "Vamos começar a construir coisas!"
          },
          {
            type: "Footer",
            label: "Concluir",
            "on-click-action": {
              name: "complete",
              payload: {}
            }
          }
        ]
      }
    };
  }

  console.error("Requisição não tratada:", decryptedBody);
  throw new Error(
    "Requisição não tratada. Verifique se você está tratando a ação e tela corretas."
  );
};