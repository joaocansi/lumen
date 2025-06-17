# lumen

Como iniciar a aplicação:

1. Iniciar o banco mysql via Docker
```docker-compose up```

2. Instalar dependências
```yarn add```

3. Sincronizar (adicionar) tabelas no banco
```npx prisma db push```

4. Executar a aplicação
```yarn dev```