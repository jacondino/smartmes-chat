import { createConnection, Connection, ConnectionOptions } from 'mysql2/promise';
import { DataSource } from 'typeorm';
import { Message } from './entities/Message';
import 'reflect-metadata';

const DATABASE_NAME = 'chat_db';

export const checkAndCreateDatabase = async () => {
  const connection = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: 'root',
    password: 'toor',
  });

  try {
    const [rows] = await connection.query(`SHOW DATABASES LIKE "${DATABASE_NAME}"`);

    if ((rows as any[]).length === 0) {
      console.log('Banco de dados não encontrado. Criando banco...');
      await connection.query('CREATE DATABASE chat_db');
    }
  } finally {
    await connection.end();
  }
};

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    username: 'root',
    password: 'toor',
    database: DATABASE_NAME,
    synchronize: true,
    logging: true,
    entities: [Message],
    migrations: [],
    subscribers: [],
});

export const initializeDataSource = async () => {
    try {
        await checkAndCreateDatabase();
        console.log('Banco de dados verificado/criado com sucesso.');
        await AppDataSource.initialize();
        console.log('Conexão com o banco de dados estabelecida.');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
};
