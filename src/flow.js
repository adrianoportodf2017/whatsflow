export const getNextScreen = async (decryptedBody) => {
  const { screen, data, action, flow_token } = decryptedBody;

  // Verificação de saúde do sistema
  if (action === "ping") {
    console.log("teste de integracai");

    return {
      data: {
        status: "active",
      },
    };
  }

  // Tratamento de erros do cliente
  if (data?.error) {
    console.log("erro encontrado");

    console.warn("Erro do cliente:", data);
    return {
      data: {
        acknowledged: true,
      },
    };
  }

  // Inicialização do fluxo
  if (action === "INIT") {
    console.log("iniciando Cadastro");

    return {
      screen: "CADASTRO",
      data: {}
    };
  }

  // Processamento do formulário de cadastro
  if (action == "complete") {
    const { nome, email, telefone } = data;

    // Lógica para salvar os dados recebidos
    console.log("Dados do cadastro recebidos:", { nome, email, telefone });

    // Retorno de sucesso após o processamento
    return {
      screen: "TELA_SUCESSO",
      data: {
        message: "Cadastro concluído com sucesso!",
        nome,
        email,
        telefone
      }
    };
  }

  console.error("Requisição não tratada:", decryptedBody);
  throw new Error(
    "Requisição não tratada. Verifique se você está tratando a ação e tela corretas."
  );
};
