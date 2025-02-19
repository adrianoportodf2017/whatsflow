/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import { decryptRequest, encryptResponse, FlowEndpointException } from "./encryption.js";
import { getNextScreen as getAppointmentFlow } from "./flow.js";
import { getNextScreen as getCooperadoFlow } from "./cooperado-flow.js";
import crypto from "crypto";

const app = express();

// Middleware para processar o body das requisições
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      req.rawBody = buf?.toString(encoding || "utf8");
    },
  }),
);

// Configurações do ambiente
const { APP_SECRET, PRIVATE_KEY, PASSPHRASE = "", PORT = "3000" } = process.env;

// Função para selecionar o fluxo apropriado
const getFlowHandler = (flowType) => {
  const flows = {
    cooperado: getCooperadoFlow,
    appointment: getAppointmentFlow
  };
  
  return flows[flowType] || getAppointmentFlow; // Retorna o fluxo default se não encontrar
};

// Rota principal para processar os fluxos
app.post("/", async (req, res) => {
  // Validação da chave privada
  if (!PRIVATE_KEY) {
    throw new Error('Private key is empty. Please check your env variable "PRIVATE_KEY".');
  }

  // Validação da assinatura da requisição
  if (!isRequestSignatureValid(req)) {
    return res.status(432).send();
  }

  try {
    // Descriptografa a requisição
    const decryptedRequest = decryptRequest(req.body, PRIVATE_KEY, PASSPHRASE);
    const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest;
    
    console.log("💬 Requisição descriptografada:", decryptedBody);

    // Identifica qual fluxo deve ser usado
    const flowType = decryptedBody.flow_type || "appointment";
    const flowHandler = getFlowHandler(flowType);

    // Processa a requisição com o fluxo apropriado
    const screenResponse = await flowHandler(decryptedBody);
    
    console.log("👉 Resposta a ser criptografada:", screenResponse);

    // Criptografa e envia a resposta
    const encryptedResponse = encryptResponse(screenResponse, aesKeyBuffer, initialVectorBuffer);
    res.send(encryptedResponse);

  } catch (err) {
    console.error("Erro ao processar requisição:", err);
    
    if (err instanceof FlowEndpointException) {
      return res.status(err.statusCode).send();
    }
    
    return res.status(500).send();
  }
});

// Rota de status/healthcheck
app.get("/", (req, res) => {
  res.send(`<pre>WhatsApp Flow Server
Status: Running
Flows disponíveis:
- Appointment (default)
- Cooperado

Para mais informações, consulte o README.md</pre>`);
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta: ${PORT}`);
  console.log(`📑 Fluxos disponíveis: appointment, cooperado`);
});

/**
 * Valida a assinatura da requisição
 * @param {Express.Request} req 
 * @returns {boolean}
 */
function isRequestSignatureValid(req) {
  // Se não houver APP_SECRET, retorna true para desenvolvimento
  if (!APP_SECRET) {
    console.warn("⚠️ App Secret não configurado. Configure APP_SECRET no arquivo .env para validação");
    return true;
  }

  try {
    const signatureHeader = req.get("x-hub-signature-256");
    if (!signatureHeader) {
      console.error("❌ Header de assinatura não encontrado");
      return false;
    }

    const signatureBuffer = Buffer.from(signatureHeader.replace("sha256=", ""), "utf-8");
    const hmac = crypto.createHmac("sha256", APP_SECRET);
    const digestString = hmac.update(req.rawBody).digest('hex');
    const digestBuffer = Buffer.from(digestString, "utf-8");

    const isValid = crypto.timingSafeEqual(digestBuffer, signatureBuffer);
    if (!isValid) {
      console.error("❌ Assinatura da requisição inválida");
    }

    return isValid;
  } catch (error) {
    console.error("❌ Erro ao validar assinatura:", error);
    return false;
  }
}