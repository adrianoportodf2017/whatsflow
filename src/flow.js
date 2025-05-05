const SCREEN_RESPONSES = {
  AVALIACAO_FINALIZADA: (dadosRecebidos) => ({
    screen: "AVALIACAO_FINALIZADA",
    data: {
      mensagem: "✅ Obrigado pela sua avaliação!",
      dados_recebidos: dadosRecebidos
    }
  }),

  // ...telas anteriores mantidas aqui
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
    return {
      screen: "INTRODUCAO",
      data: {}
    };
  }

  if (action === "data_exchange") {
    // Aqui você pode incluir telas se quiser dividir lógica
    return {
      screen: "INTRODUCAO",
      data: {}
    };
  }

  if (action === "complete") {
    // Captura final dos dados enviados pelo Flow
    console.log("[Flow] 📦 Dados finais recebidos do Flow de avaliação:");
    console.table(data);

    return SCREEN_RESPONSES.AVALIACAO_FINALIZADA(data);
  }

  return {
    screen: "INTRODUCAO",
    data: {}
  };
};
