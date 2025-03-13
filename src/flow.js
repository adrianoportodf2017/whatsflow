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
  
  console.log("debug", decryptedBody);

  const { screen, data, action, flow_token } = decryptedBody;

  if (action === "ping") {  console.log("debug 2", decryptedBody);

    return {
      data: {
        status: "active",
      },
    };
  }

  if (data?.error) {
    console.log("debug 3", decryptedBody);    return { data: { acknowledged: true } };
  }

  if (action === "INIT") {
    console.log("debug 4", decryptedBody);    return SCREEN_RESPONSES.CADASTRO_INICIAL; ;

  }

  if (action === "data_exchange") {
    console.log("debug 5", decryptedBody);
    switch (screen) {
      case "CADASTRO_INICIAL":
        return SCREEN_RESPONSES.DADOS_PESSOAIS;
      case "DADOS_PESSOAIS":
        return SCREEN_RESPONSES.ENDERECO;
      case "ENDERECO":
        return SCREEN_RESPONSES.CONFIRMACAO;
        case "CONFIRMACAO":
          console.log("debug - enviando dados completos para API");
  
          try {
            const response = await fetch(
              "https://api-cadastro-flow.agenciatecnet.com.br/index.php",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  apikey: "f79a4875d574dfb7aae1b443b8a56c64",
                },
                body: JSON.stringify(data), // Enviando todo o objeto data
              }
            );
  
            const result = await response.json();
            console.log("debug - resposta da API:", result);
  
            if (!response.ok) {
              throw new Error(`Erro na API: ${result.message || response.status}`);
            }
  
            return SCREEN_RESPONSES.SUCCESS;
          } catch (error) {
            console.error("Erro ao enviar dados para a API:", error);
            return { data: { error: "Falha ao processar o cadastro." } };
          }
  
        default:
          break;
      }
    }
  
    console.log("debug 6", decryptedBody);
    return SCREEN_RESPONSES.CADASTRO_INICIAL;
  };