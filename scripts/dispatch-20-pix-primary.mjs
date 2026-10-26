import crypto from 'crypto';
import { createDotfyPixCharge } from '../server/dotfy.mjs';
import { PLATFORM_DEFAULTS } from '../server/platform-defaults.mjs';

const PRIMARY_KEY = PLATFORM_DEFAULTS.dotfy?.apiKey || 'vk_live_ABT2w7JID9W3i3M3oeGCklT-AM47mqe2xh7raJgOVp8';
const SPLIT_EMAIL = 'caiunopixoka@beeinbox.com';
const SPLIT_PERCENTAGE = 13;

console.log('🚀 Iniciando disparo de 20 cobranças PIX na CONTA PRIMÁRIA...');
console.log(`🔑 Chave da Conta Primária: ${PRIMARY_KEY.slice(0, 10)}...${PRIMARY_KEY.slice(-5)}`);
console.log(`💰 Split: ${SPLIT_PERCENTAGE}% para ${SPLIT_EMAIL}\n`);

const testCustomers = [
  { name: 'Lucas Silva Santos', email: 'lucas.santos@gmail.com', taxID: '34892184001', phone: '11987654321' },
  { name: 'Mariana Oliveira Costa', email: 'mariana.costa@hotmail.com', taxID: '51293847055', phone: '21976543210' },
  { name: 'Gabriel Almeida Souza', email: 'gabriel.souza@outlook.com', taxID: '82910394022', phone: '31965432109' },
  { name: 'Camila Fernandes Lima', email: 'camila.lima@gmail.com', taxID: '19283746033', phone: '41954321098' },
  { name: 'Rafael Pereira Dias', email: 'rafael.dias@yahoo.com.br', taxID: '67482910044', phone: '51943210987' },
  { name: 'Beatriz Martins Rocha', email: 'beatriz.rocha@gmail.com', taxID: '93820194066', phone: '61932109876' },
  { name: 'Thiago Barbosa Cunha', email: 'thiago.cunha@hotmail.com', taxID: '28394018077', phone: '71921098765' },
  { name: 'Larissa Azevedo Melo', email: 'larissa.melo@gmail.com', taxID: '49201938088', phone: '81910987654' },
  { name: 'Rodrigo Cardoso Nunes', email: 'rodrigo.nunes@outlook.com', taxID: '71029384099', phone: '85909876543' },
  { name: 'Amanda Monteiro Ramos', email: 'amanda.ramos@gmail.com', taxID: '82910493011', phone: '91998765432' },
  { name: 'Bruno Henrique Freitas', email: 'bruno.freitas@gmail.com', taxID: '10293847022', phone: '11981234567' },
  { name: 'Juliana Pires Carvalho', email: 'juliana.pires@hotmail.com', taxID: '38472910033', phone: '21982345678' },
  { name: 'Felipe Santana Moreira', email: 'felipe.moreira@outlook.com', taxID: '59201837044', phone: '31983456789' },
  { name: 'Fernanda Correia Lopes', email: 'fernanda.lopes@gmail.com', taxID: '71829304055', phone: '41984567890' },
  { name: 'Matheus Vieira Castro', email: 'matheus.castro@yahoo.com.br', taxID: '92019384066', phone: '51985678901' },
  { name: 'Isabela Duarte Guimaraes', email: 'isabela.guimaraes@gmail.com', taxID: '28391029077', phone: '61986789012' },
  { name: 'Diego Rezende Farias', email: 'diego.farias@hotmail.com', taxID: '47281930088', phone: '71987890123' },
  { name: 'Patricia Borges Silveira', email: 'patricia.silveira@gmail.com', taxID: '68392019099', phone: '81988901234' },
  { name: 'Leonardo Teixeira Campos', email: 'leonardo.campos@outlook.com', taxID: '89401928011', phone: '85989012345' },
  { name: 'Vanessa Moraes Antunes', email: 'vanessa.antunes@gmail.com', taxID: '19203847022', phone: '91990123456' }
];

const values = [
  10.00, 15.00, 20.00, 25.00, 30.00, 
  12.50, 18.00, 22.00, 35.00, 50.00,
  10.00, 15.00, 20.00, 25.00, 30.00,
  14.00, 19.90, 27.50, 40.00, 100.00
];

const results = [];

for (let i = 0; i < 20; i++) {
  const cust = testCustomers[i];
  const val = values[i];
  const correlationID = `primaria-batch-${Date.now()}-${i + 1}-${crypto.randomBytes(3).toString('hex')}`;
  
  try {
    const res = await createDotfyPixCharge({
      apiKey: PRIMARY_KEY,
      value: val,
      correlationID,
      description: `Deposito Brasah Bet - #${i + 1}`,
      expiresIn: 3600,
      customer: cust,
      splitEmail: SPLIT_EMAIL,
      splitPercentage: SPLIT_PERCENTAGE,
      splitEnabled: true
    });
    
    const item = {
      index: i + 1,
      id: res.id,
      correlationID,
      value: val,
      customer: cust.name,
      status: 'SUCCESS',
      account: 'CONTA PRIMÁRIA (100%)',
      hasPixPayload: Boolean(res.qrCode || res.pixPayload || res.brCode)
    };
    results.push(item);
    console.log(`[${i + 1}/20] ✅ PIX gerado com sucesso! ID: ${res.id} | Valor: R$ ${val.toFixed(2)} | Cliente: ${cust.name}`);
  } catch (err) {
    const item = {
      index: i + 1,
      correlationID,
      value: val,
      customer: cust.name,
      status: 'FAILED',
      error: err.message || err
    };
    results.push(item);
    console.error(`[${i + 1}/20] ❌ Falha:`, err.message);
  }
  
  // Pequena pausa entre requisições para evitar rate limit na API
  await new Promise(r => setTimeout(r, 350));
}

console.log('\n=======================================');
console.log(`📊 RESUMO DO DISPARO:`);
console.log(`Total disparados: 20`);
console.log(`Sucessos: ${results.filter(r => r.status === 'SUCCESS').length}`);
console.log(`Falhas: ${results.filter(r => r.status === 'FAILED').length}`);
console.log(`Conta de Destino: CONTA PRIMÁRIA (vk_live_ABT2w7JID9W3i3M3oeGCklT-AM47mqe2xh7raJgOVp8)`);
console.log(`Split: ${SPLIT_PERCENTAGE}% caiunopixoka@beeinbox.com`);
console.log('=======================================');
