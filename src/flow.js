/**
 * Flow.js atualizado para o Cadastro de Cooperado
 */

const SCREEN_RESPONSES = {
  CADASTRO_INICIAL: {
    screen: "CADASTRO_INICIAL",
    data: {
      tipo_pessoa: [
        { id: "pf", title: "Pessoa Física" },
        { id: "pj", title: "Pessoa Jurídica" }
      ]
    }
  },
  DADOS_PESSOAIS: {
    screen: "DADOS_PESSOAIS",
    data: {}
  },
  ENDERECO: {
    screen: "ENDERECO",
    data: {
      estados: [
        { id: "SP", title: "São Paulo" },
        { id: "RJ", title: "Rio de Janeiro" },
        { id: "MG", title: "Minas Gerais" },
        { id: "RS", title: "Rio Grande do Sul" },
        { id: "PR", title: "Paraná" }
      ]
    }
  },
  CONFIRMACAO: {
    screen: "CONFIRMACAO",
    data: {}
  },
  SUCCESS: {
    screen: "SUCCESS",
    data: {
      extension_message_response: {
        params: {
          flow_token: "REPLACE_FLOW_TOKEN",
          message: "Cadastro realizado com sucesso! Em breve entraremos em contato."
        }
      }
    }
  }
};

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, action, flow_token } = decryptedBody;

  if (action === "ping") {
    return SCREEN_RESPONSES.CADASTRO_INICIAL;
  }

  if (data?.error) {
    console.warn("Received client error:", data);
    return { data: { acknowledged: true } };
  }

  if (action === "INIT") {
    return SCREEN_RESPONSES.CADASTRO_INICIAL;
  }

  if (action === "data_exchange") {
    switch (screen) {
      case "CADASTRO_INICIAL":
        return SCREEN_RESPONSES.DADOS_PESSOAIS;
      case "DADOS_PESSOAIS":
        return SCREEN_RESPONSES.ENDERECO;
      case "ENDERECO":
        return SCREEN_RESPONSES.CONFIRMACAO;
      case "CONFIRMACAO":
        return SCREEN_RESPONSES.SUCCESS;
      default:
        break;
    }
  }

  console.error("Unhandled request body:", decryptedBody);
  throw new Error("Unhandled endpoint request.");
};