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
       }
    },
  }),
);

const { APP_SECRET, PRIVATE_KEY, PASSPHRASE = "", PORT = "3000" } = process.env;

 

app.post("/", async (req, res) => {
 

  if (!PRIVATE_KEY) {
    throw new Error(
      'Chave privada está vazia. Por favor verifique sua variável de ambiente "PRIVATE_KEY".'
    );
  }

  if(!isRequestSignatureValid(req)) {
 
    return res.status(432).send();
  }

  let decryptedRequest = null;
  try {
    decryptedRequest = decryptRequest(req.body, PRIVATE_KEY, PASSPHRASE);
  } catch (err) {
     if (err instanceof FlowEndpointException) {
      return res.status(err.statusCode).send();
    }
    return res.status(500).send();
  }

  const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest;
 
   

  const screenResponse = await getNextScreen(decryptedBody);
 
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
     return true;
  }

  const signatureHeader = req.get("x-hub-signature-256");
  
  // Verifica se a assinatura existe
  if (!signatureHeader) {
     return false;
  }

  // Verifica se o rawBody existe
  if (!req.rawBody) {
     return false;
  }

  try {
    const signature = signatureHeader.replace("sha256=", "");
    const signatureBuffer = Buffer.from(signature, "hex"); // CORREÇÃO: Use 'hex' em vez de 'utf-8'
    
    const hmac = crypto.createHmac("sha256", APP_SECRET);
    const digest = hmac.update(req.rawBody).digest('hex');
    const digestBuffer = Buffer.from(digest, "hex"); // CORREÇÃO: Use 'hex' em vez de 'utf-8'

 

    const isValid = crypto.timingSafeEqual(digestBuffer, signatureBuffer);
    
    if (!isValid) {
     
    } else {
     }
    
    return isValid;
  } catch (error) {
     return false;
  }
}