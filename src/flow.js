export const getNextScreen = async (decryptedBody) => {
  const { screen, data, action, flow_token } = decryptedBody;

  console.log("💬 Recebendo request:", decryptedBody);

  if (action === "ping") {
    return {
      data: {
        status: "active",
      },
    };
  }

  if (data?.error) {
    console.warn("⚠️ Erro do cliente:", data);
    return {
      data: {
        acknowledged: true,
      },
    };
  }

  if (action === "INIT") {
    console.log("🟢 Iniciando flow");
    return {
      screen: "CADASTRO",
      data: {}
    };
  }

  if (action === "data_exchange") {
    switch (screen) {
      case "CADASTRO":
        // data.trigger será 'submit_form'
        console.log("📝 Trigger recebido:", data.trigger);
        
        // Os dados do formulário devem estar em data.form_data
        const formData = data.form_data || {};
        console.log("📝 Dados do formulário:", formData);
        
        // Redireciona para tela de sucesso
        console.log("✅ Redirecionando para sucesso");
        return {
          screen: "SUCESSO",
          data: {}
        };

      default:
        console.error("❌ Tela não encontrada:", screen);
        throw new Error("Tela não encontrada");
    }
  }

  console.error("❌ Requisição não tratada:", decryptedBody);
  throw new Error(
    "Requisição não tratada. Verifique se você está tratando a ação e tela corretas."
  );
};