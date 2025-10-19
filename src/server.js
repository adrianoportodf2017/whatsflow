/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * Este código é licenciado sob a licença MIT encontrada no
 * arquivo LICENSE no diretório raiz deste código fonte.
 */

import express from "express";
import { decryptRequest, encryptResponse, FlowEndpointException } from "./encryption.js";
import { getNextScreen } from "./flow.js";
import crypto from "crypto";

const app = express();

app.use(
  express.json({
    // armazena o corpo raw da requisição para usar na verificação de assinatura
    verify: (req, res, buf, encoding) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || "utf8");
        console.log("📦 Raw body armazenado para verificação:", req.rawBody?.substring(0, 200) + "...");
      }
    },
  }),
);

const { APP_SECRET, PRIVATE_KEY, PASSPHRASE = "", PORT = "3000" } = process.env;

/*
Exemplo:
```-----[SUBSTITUA ISSO] BEGIN RSA PRIVATE KEY-----
MIIE...
...
...AQAB
-----[SUBSTITUA ISSO] END RSA PRIVATE KEY-----```
*/

app.post("/", async (req, res) => {
  console.log("📨 Cabeçalhos da requisição recebidos:", req.headers);
  console.log("🔐 Cabeçalho de assinatura:", req.get("x-hub-signature-256"));
  console.log("📝 Tamanho do corpo da requisição:", req.body?.length);

  if (!PRIVATE_KEY) {
    throw new Error(
      'Chave privada está vazia. Por favor verifique sua variável de ambiente "PRIVATE_KEY".'
    );
  }

  if(!isRequestSignatureValid(req)) {
    // Retorna código 432 se a assinatura não corresponder
    // Para aprender mais sobre códigos de erro: https://developers.facebook.com/docs/whatsapp/flows/reference/error-codes#endpoint_error_codes
    return res.status(432).send();
  }

  let decryptedRequest = null;
  try {
    decryptedRequest = decryptRequest(req.body, PRIVATE_KEY, PASSPHRASE);
  } catch (err) {
    console.error("❌ Erro ao descriptografar:", err);
    if (err instanceof FlowEndpointException) {
      return res.status(err.statusCode).send();
    }
    return res.status(500).send();
  }

  const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest;
  console.log("💬 Requisição Descriptografada:", decryptedBody);

  // TODO: Descomente este bloco e adicione sua lógica de validação do flow token
  // Se o flow token se tornar inválido, retorne código HTTP 427 para desativar o flow e mostrar a mensagem em `error_msg` para o usuário
  // Consulte a documentação para detalhes: https://developers.facebook.com/docs/whatsapp/flows/reference/error-codes#endpoint_error_codes

  /*
  if (!isValidFlowToken(decryptedBody.flow_token)) {
    const error_response = {
      error_msg: `A mensagem não está mais disponível`,
    };
    return res
      .status(427)
      .send(
        encryptResponse(error_response, aesKeyBuffer, initialVectorBuffer)
      );
  }
  */

  const screenResponse = await getNextScreen(decryptedBody);
  console.log("👉 Resposta para Criptografar:", screenResponse);

  res.send(encryptResponse(screenResponse, aesKeyBuffer, initialVectorBuffer));
});

app.get("/", (req, res) => {
  res.send(`<pre>Ambiente Mafia Beer 🍺</pre>`);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta: ${PORT}`);
});

function isRequestSignatureValid(req) {
  if(!APP_SECRET) {
    console.warn("⚠️ App Secret não está configurado. Por favor adicione seu app secret no arquivo /.env para verificar a validação de requisição");
    return true;
  }

  const signatureHeader = req.get("x-hub-signature-256");
  
  // Verifica se a assinatura existe
  if (!signatureHeader) {
    console.error("❌ Erro: cabeçalho x-hub-signature-256 está faltando");
    return false;
  }

  // Verifica se o rawBody existe
  if (!req.rawBody) {
    console.error("❌ Erro: rawBody está faltando");
    return false;
  }

  try {
    const signature = signatureHeader.replace("sha256=", "");
    const signatureBuffer = Buffer.from(signature, "hex"); // CORREÇÃO: Use 'hex' em vez de 'utf-8'
    
    const hmac = crypto.createHmac("sha256", APP_SECRET);
    const digest = hmac.update(req.rawBody).digest('hex');
    const digestBuffer = Buffer.from(digest, "hex"); // CORREÇÃO: Use 'hex' em vez de 'utf-8'

    console.log("🔍 Assinatura recebida:", signature);
    console.log("🔍 Assinatura calculada:", digest);

    const isValid = crypto.timingSafeEqual(digestBuffer, signatureBuffer);
    
    if (!isValid) {
      console.error("❌ Erro: Assinatura da Requisição não corresponde");
      console.error("📤 Esperado:", digest);
      console.error("📥 Recebido:", signature);
    } else {
      console.log("✅ Assinatura validada com sucesso!");
    }
    
    return isValid;
  } catch (error) {
    console.error("💥 Erro validando assinatura:", error);
    return false;
  }
}