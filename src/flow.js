const SCREEN_RESPONSES = {};

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, action, user } = decryptedBody;

  const wa_id = user?.wa_id ||  "";
  const profile_name = user?.name || " ";

  console.log("[Flow] Ação recebida:", action);
  console.log("[Flow] Tela atual:", screen);
  console.log("[Flow] Dados recebidos (raw):", data);
  console.log("📲 Usuário:", wa_id, "-", profile_name);
console.log(decryptedBody);

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
    const mapas = {
      nota_processo: {
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
      teve_problema: {
        "0": "Não",
        "1": "Sim"
      },
      tempo_votacao: {
        "0": "Menos de 5 minutos",
        "1": "Entre 5 e 10 minutos",
        "2": "Mais de 10 minutos"
      },
      receber_infos: {
        "0": "Sim, com certeza",
        "1": "Não"
      },
      aceitou_optin: {
        "0": "Sim",
        "1": "Não"
      }
    };

    const dadosMapeados = {
  wa_id: data.wa_id,
  cpf: data.cpf,  
  profile_name: data.nome,
  nota_processo: mapas.nota_processo?.[data.avaliacao_geral] || data.avaliacao_geral,
  clareza_info: mapas.clareza_info?.[data.clareza_info] || data.clareza_info,
  facilidade_uso: mapas.facilidade_uso?.[data.facilidade_uso] || data.facilidade_uso,
  teve_problema: mapas.teve_problema?.[data.problema_tecnico] || data.problema_tecnico,
  qual_problema: data.descricao_problema || "",
  tempo_votacao: mapas.tempo_votacao?.[data.tempo_votacao] || data.tempo_votacao,
  receber_infos: mapas.receber_infos?.[data.receber_info] || data.receber_info,
  comentario: data.sugestao || "",
  canal_resposta: "WhatsApp",
  aceitou_optin: mapas.aceitou_optin?.[data.optin] || data.optin,
  campanha_id: data.campanha_id || "avaliacao_2025",
  versao_flow: data.versao_flow || "v1"
};

    console.log("[Flow] ✅ Dados finais mapeados com usuário:");
    console.table(dadosMapeados);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzghAiaunrdhcrTuAvgY8gGkzMETi4vxI8uokpKXHRe6klvO_pb8FCxnQ7Bu5TSn0Ij/exec?tipo=pesquisa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosMapeados)
      });

      const resultado = await response.json();
      console.log("[Flow] 📤 Resultado do envio:", resultado);
    } catch (error) {
      console.error("[Flow] ❌ Erro ao enviar dados:", error);
    }

    return {
      screen: "AVALIACAO_FINALIZADA",
      data: {
        mensagem: "Obrigado pela sua avaliação!"
      }
    };
  }

  return {
    screen: "INTRODUCAO",
    data: {}
  };
};
