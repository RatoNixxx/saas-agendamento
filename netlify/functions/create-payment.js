// ============================================
// ARQUIVO: netlify/functions/create-payment.js
// FUNÇÃO: Cria sessão de checkout na Stripe
// ============================================

// Importa a biblioteca da Stripe com a chave secreta
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Função principal que será chamada quando alguém clicar em "Assinar"
exports.handler = async (event) => {
  
  // === CONFIGURAÇÃO DE SEGURANÇA (CORS) ===
  // Permite que seu site chame esta função
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // === RESPOSTA PARA REQUISIÇÕES DE VERIFICAÇÃO ===
  // O navegador sempre envia uma requisição OPTIONS antes
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // === SÓ ACEITA REQUISIÇÕES POST ===
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }

  try {
    // === PEGA OS DADOS ENVIADOS PELO SEU SITE ===
    // Seu frontend vai enviar: { priceId, customerEmail }
    const dados = JSON.parse(event.body);
    const priceId = dados.priceId;           // Ex: price_1T4VMp2Z04DEDmWi53MRD3c6
    const customerEmail = dados.customerEmail; // Email do cliente logado

    // Verifica se o priceId foi enviado
    if (!priceId) {
      throw new Error('Price ID é obrigatório');
    }

    // === CRIA A SESSÃO DE CHECKOUT NA STRIPE ===
    // É aqui que a mágica acontece!
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',                    // É uma assinatura mensal
      payment_method_types: ['card', 'boleto'], // Aceita cartão e boleto
      line_items: [                            // O que está sendo comprado
        {
          price: priceId,                       // ID do plano (Básico, Profissional...)
          quantity: 1,                          // 1 assinatura
        },
      ],
      success_url: `${process.env.URL || 'http://localhost:5173'}/dashboard?success=true`, // Onde volta após pagar
      cancel_url: `${process.env.URL || 'http://localhost:5173'}/#planos`, // Se cancelar
      customer_email: customerEmail,            // Email do cliente
      locale: 'pt-BR',                          // Idioma português
    });

    // === DEVOLVE O ID DA SESSÃO PARA O SEU SITE ===
    // Seu frontend vai usar esse ID para redirecionar
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        sessionId: session.id,   // ID da sessão criada
        url: session.url         // URL do checkout (opcional)
      }),
    };

  } catch (error) {
    // === SE ALGO DER ERRADO, MOSTRA O ERRO ===
    console.error('Erro na função create-payment:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Erro interno do servidor' 
      }),
    };
  }
};