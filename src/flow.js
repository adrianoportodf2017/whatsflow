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
    return { data: { status: "active" } };
  }

  if (action === "INIT") {
    return SCREEN_RESPONSES.IDENTIFICACAO_CPF;
  }

  if (action === "data_exchange") {
    switch (screen) {
      case "IDENTIFICACAO_CPF": {
        const cpfValido = [
          "12345678900",
          "98765432100",
          "74397912076"
        ];
        const cpf = data?.cpf;

        if (!cpfValido.includes(cpf)) {
          return {
            screen: "IDENTIFICACAO_CPF",
            data: {
              error: true,
              error_message: "CPF não encontrado."
            }
          };
        }

        if (cpf === "98765432100") {
          return {
            screen: "USUARIO_JA_VOTOU",
            data: {
              cpf,
              hash: "VOTO1234",
              candidatos: []
            }
          };
        }

        if (cpf === "74397912076") {
          return {
            screen: "SELECIONA_CANDIDATOS",
            data: {
              cpf,
              nome: "EVELINE MONICA DE AZEVEDO GUIMARAES",
              texto_nome: "👋 Olá, EVELINE MONICA DE AZEVEDO GUIMARAES! ",

              candidatos: [
                { id: "1", title: "Elvira Cruvinel Ferreira" },
                { id: "2", title: "Magno Soares dos Santos" },
                { id: "3", title: "Maria de Jesus Demétrio Gaia" },
                { id: "4", title: "Maurício Teixeira da Costa" },
                { id: "5", title: "Adriano A. de O. Porto" }
              ]
            }
          };
        }

        return SCREEN_RESPONSES.SELECIONA_CANDIDATOS;
      }
      case "SELECIONA_CANDIDATOS":
        return SCREEN_RESPONSES.CONFIRMACAO_VOTO;

      case "CONFIRMACAO_VOTO": {
        const { cpf, candidatos } = data;
        return SCREEN_RESPONSES.VOTO_FINALIZADO(cpf, candidatos);
      }

      default:
        return SCREEN_RESPONSES.IDENTIFICACAO_CPF;
    }
  }

  return SCREEN_RESPONSES.IDENTIFICACAO_CPF;
};
