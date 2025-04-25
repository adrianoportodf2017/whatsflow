/**
 * flow.js adaptado e corrigido para o processo de votação do Instituto Cooperforte
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
  VOTO_FINALIZADO: (cpf, candidatos_id, candidatos_nomes) => {
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    return {
      screen: "VOTO_FINALIZADO",
      data: {
        cpf,
        hash,
        candidatos_id,
        candidatos_nomes
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
        const cpf = data?.cpf;

        try {
          const response = await fetch(
            `https://script.google.com/macros/s/AKfycbzb7_mbiFNqQd47FG01bbOH3eDpgD0eNBjopjCgQ6K5b9QDtEhgJRY9YxWiK2EIosd0/exec?cpf=${cpf}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            }
          );

          const result = await response.json();
          console.log("debug - resposta da API:", result);

          if (result.encontrado == false) {
            return {
              screen: "IDENTIFICACAO_CPF",
              data: {
                error: true,
                error_message: result.mensagem
              }
            };
          }

          if (result.encontrado == true && result.votou == "Sim") {
            return {
              screen: "USUARIO_JA_VOTOU",
              data: {
                cpf,
                hash: result.hash,
                candidatos: []
              }
            };
          }

          if (result.encontrado == true && result.votou == "Não") {
            return {
              screen: "SELECIONA_CANDIDATOS",
              data: {
                cpf,
                nome: result.nome,
                texto_nome: "👋 Olá, "+result.nome +"!",
                candidatos: SCREEN_RESPONSES.SELECIONA_CANDIDATOS.data.candidatos
              }
            };
          }

          return SCREEN_RESPONSES.SELECIONA_CANDIDATOS;

        } catch (error) {
          console.error("Erro na requisição de verificação de CPF:", error);
          return {
            screen: "IDENTIFICACAO_CPF",
            data: {
              error: true,
              error_message: "Erro ao verificar o CPF. Tente novamente."
            }
          };
        }
      }

      case "SELECIONA_CANDIDATOS": {
        const { cpf, candidatos } = data;
        const mapaCandidatos = SCREEN_RESPONSES.SELECIONA_CANDIDATOS.data.candidatos.reduce((acc, curr) => {
          acc[curr.id] = curr.title;
          return acc;
        }, {});

        const nomesSelecionados = (candidatos || [])
          .map(id => `${id} - ${mapaCandidatos[id]}`)
          .filter(Boolean);

        return {
          screen: "CONFIRMACAO_VOTO",
          data: {
            cpf,
            texto_confirmacao: "Você selecionou:",
            candidatos_lista: nomesSelecionados.join(",\n"),
            candidatos_id: candidatos.map(id => ({ id }))
          }
        };
      }

      case "CONFIRMACAO_VOTO": {
        const { cpf, candidatos_id, candidatos_nomes } = data;
        return SCREEN_RESPONSES.VOTO_FINALIZADO(cpf, candidatos_id, candidatos_nomes);
      }

      default:
        return SCREEN_RESPONSES.IDENTIFICACAO_CPF;
    }
  }

  return SCREEN_RESPONSES.IDENTIFICACAO_CPF;
};