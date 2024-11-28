# Getting Started

## Instalar as dependências
```bash
npm install
```
ou
```bash
yarn install
```

## Subir container do banco de dados
```bash
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=toor -e MYSQL_USER=root -p 3306:3306 mysql:8.0.20
```

## Rodar a aplicação
```bash
npm run dev
```
ou
```bash
yarn dev
```