const SCREEN_RESPONSES = {
  AVALIACAO_FINALIZADA: (dadosRecebidos) => ({
    screen: "AVALIACAO_FINALIZADA",
    data: {
      mensagem: "✅ Obrigado pela sua avaliação!",
      dados_recebidos: dadosRecebidos
    }
  }),
};

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, action } = decryptedBody;
  console.log("[Flow] Ação recebida:", action);
  console.log("[Flow] Tela atual:", screen);
  console.log("[Flow] Dados recebidos (raw):", data);

  if (action === "ping") {
    return { data: { status: "active" } };
  }

  if (action === "INIT") {
    return {
      screen: "INTRODUCAO",
      data: {}
    };
  }

  if (action === "data_exchange") {
    // Mapeamento de valores enviados como ID
    const mapas = {
      avaliacao_geral: {
        "0": "Muito bom",
        "1": "Bom",
        "2": "Regular",
        "3": "Ruim",
        "4": "Muito ruim"
      },
      clareza_info: {
        "0": "Muito claro",
        "1": "Claro",
        "2": "Regular",
        "3": "Pouco claro",
        "4": "Nada claro"
      },
      facilidade_uso: {
        "0": "Muito fácil",
        "1": "Fácil",
        "2": "Regular",
        "3": "Difícil",
        "4": "Muito difícil"
      },
      problema_tecnico: {
        "0": "Não",
        "1": "Sim"
      },
      tempo_votacao: {
        "0": "Menos de 5 minutos",
        "1": "Entre 5 e 10 minutos",
        "2": "Mais de 10 minutos"
      },
      receber_info: {
        "0": "Sim, com certeza",
        "1": "Não"
      }
    };

    const dadosMapeados = {
      optin: data.optin,
      avaliacao_geral: mapas.avaliacao_geral?.[data.avaliacao_geral] || data.avaliacao_geral,
      clareza_info: mapas.clareza_info?.[data.clareza_info] || data.clareza_info,
      facilidade_uso: mapas.facilidade_uso?.[data.facilidade_uso] || data.facilidade_uso,
      problema_tecnico: mapas.problema_tecnico?.[data.problema_tecnico] || data.problema_tecnico,
      descricao_problema: data.descricao_problema,
      tempo_votacao: mapas.tempo_votacao?.[data.tempo_votacao] || data.tempo_votacao,
      receber_info: mapas.receber_info?.[data.receber_info] || data.receber_info,
      sugestao: data.sugestao
    };

    console.log("[Flow] ✅ Dados finais mapeados:");
    console.table(dadosMapeados);

    return SCREEN_RESPONSES.AVALIACAO_FINALIZADA(dadosMapeados);
  }

  return {
    screen: "INTRODUCAO",
    data: {}
  };
};
