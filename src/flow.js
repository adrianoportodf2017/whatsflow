/**
 * flow.js adaptado para o processo de votação do Instituto Cooperforte
 */

const SCREEN_RESPONSES = {
  IDENTIFICACAO_CPF: {
    screen: "IDENTIFICACAO_CPF",
    data: {}
  },
  SELECIONA_CANDIDATOS: {
    screen: "SELECIONA_CANDIDATOS",
    data: {
      candidatos: [
        { id: "1", title: "Elvira Cruvinel Ferreira" },
        { id: "2", title: "Magno Soares dos Santos" },
        { id: "3", title: "Maria de Jesus Demétrio Gaia" },
        { id: "4", title: "Maurício Teixeira da Costa" },
        { id: "5", title: "Sandra Regina de Miranda" }
      ]
    }
  },
  CONFIRMACAO_VOTO: {
    screen: "CONFIRMACAO_VOTO",
    data: {}
  },
  VOTO_FINALIZADO: (cpf, candidatos) => {
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    return {
      screen: "VOTO_FINALIZADO",
      data: {
        cpf,
        hash,
        candidatos
      }
    };
  }
};

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, action } = decryptedBody;
  console.log("[Flow] Ação recebida:", action);
  console.log("[Flow] Tela atual:", screen);
  console.log("[Flow] Dados recebidos:", data);

  if (action === "ping") {
    console.log("[Flow] Resposta ao ping: status ativo");
    return { data: { status: "active" } };
  }

  if (data?.error) {
    console.log("[Flow] Erro recebido no payload. Acknowledged enviado.");
    return { data: { acknowledged: true } };
  }

  if (action === "INIT") {
    console.log("[Flow] Ação INIT - iniciando com IDENTIFICACAO_CPF");
    return SCREEN_RESPONSES.IDENTIFICACAO_CPF;
  }

  if (action === "data_exchange") {
    switch (screen) {
      case "IDENTIFICACAO_CPF": {
        console.log("[Flow] Validação de CPF");
        const cpfValido = [
          "12345678900",
          "98765432100"
        ];
        const cpf = data?.cpf;

        if (!cpfValido.includes(cpf)) {
          console.log("[Flow] CPF não encontrado:", cpf);
          return { data: { error: "CPF não encontrado." } };
        }

        if (cpf === "98765432100") {
          console.log("[Flow] CPF já votou. Encerrando fluxo:", cpf);
          return {
            screen: "VOTO_FINALIZADO",
            data: {
              cpf,
              hash: "VOTO1234",
              candidatos: []
            }
          };
        }

        console.log("[Flow] CPF válido. Avançando para SELECIONA_CANDIDATOS");
        return SCREEN_RESPONSES.SELECIONA_CANDIDATOS;
      }
      case "SELECIONA_CANDIDATOS":
        console.log("[Flow] Avançando para CONFIRMACAO_VOTO");
        return SCREEN_RESPONSES.CONFIRMACAO_VOTO;

      case "CONFIRMACAO_VOTO": {
        const { cpf, candidatos } = data;
        console.log("[Flow] Confirmação de voto recebida para:", cpf);
        console.log("[Flow] Candidatos selecionados:", candidatos);
        return SCREEN_RESPONSES.VOTO_FINALIZADO(cpf, candidatos);
      }

      default:
        console.log("[Flow] Tela desconhecida, retornando IDENTIFICACAO_CPF");
        return SCREEN_RESPONSES.IDENTIFICACAO_CPF;
    }
  }

  console.log("[Flow] Ação desconhecida. Redirecionando para IDENTIFICACAO_CPF");
  return SCREEN_RESPONSES.IDENTIFICACAO_CPF;
};