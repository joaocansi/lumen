# K6 Lumen

Para o k6, utilizamos o grafana para mostrar as informações e o influxdb para enviar os dados do k6.

### Como rodar os testes k6

Lembre-se de ligar o back-end antes de executar os testes.

1. Acesse a pasta tests/k6
`cd tests/k6`

2. Execute o Grafana e o InfluxDB com docker (configuração do Grafana com InfluxDB deve ser feito por conta própria)
`docker-compose up`

3. Instale as dependencias
`yarn install`

4. Gere os dados (é importante ter pelo menos um usuário cadastrado no banco de dados)
`yarn gen:images`

5. Insira no banco de dados (caso tenha mudado dados do banco de dados, lembre-se de mudar no arquivo seed.js também)
`yarn seed:images`

6. Execute o 1° teste
`node upload_images.js`

6. Execute o 1° teste
`node get_images.js`

