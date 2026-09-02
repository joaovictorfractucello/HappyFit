import 'dotenv/config';

import { app } from './app';
import { prisma } from './config/prisma';

const PORT = Number(process.env.PORT || 3333);

async function start() {
    try {
        await prisma.$connect();
        console.log("✅ Conexão com o banco de dados estabelecida com sucesso");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Erro ao conectar ao banco:", error);
        process.exit(1);
    }
}

start();