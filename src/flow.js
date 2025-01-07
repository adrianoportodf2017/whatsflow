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
      screen: "CADASTRO",
      data: {}
    };
  }

  // Processamento do formulário
  if (action === "data_exchange") {
    switch (screen) {
      case "CADASTRO":
        // Pega os dados do formulário
        const formData = data.form_responses;
        
        // Aqui você pode adicionar sua lógica para salvar os dados
        // Por exemplo, salvar em um banco de dados
        console.log("Dados do formulário:", formData);

        // Redireciona para tela de sucesso
        return {
          screen: "SUCESSO",
          data: {}
        };

      default:
        console.error("Tela não encontrada:", screen);
        throw new Error("Tela não encontrada");
    }
  }

  console.error("Requisição não tratada:", decryptedBody);
  throw new Error(
    "Requisição não tratada. Verifique se você está tratando a ação e tela corretas."
  );
};