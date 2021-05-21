# Aplicação
[![Watch the video](https://cdn.loom.com/sessions/thumbnails/7a2aaea5bd5746ff9ca4f5f277dbd84a-with-play.gif)](https://www.loom.com/share/7a2aaea5bd5746ff9ca4f5f277dbd84a)

# Instalação
  Antes de efetuar a instalação do projeto, remover isso, do arquivo docker-compose.yml:

  ```
  volumes:
      - ~/app/gobarber/src/database:/bitnami/postgresql
  ```

  Execute:

  ```
    docker-compose up -d
  ```  

  Após subir os containers do Redis, Mongo e Postgres, crie no seu postgres um banco de dados com o nome `gostack_gobarber`, executar no terminal o typeORM para instalação das migrations:

  ```
    yarn typeorm migration:run
  ```

  Depois disso apenas iniciar seu projedo com o comando `yarn dev:server`

# Recuperação de senha

**Requisitos Funcionais**

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**Requisitos Não Funcionais**

- Utilizar Mailtrap para testar envios de email em ambiente de desenvolvimento;
- Utilizar o Amazon SES para envios de emails em ambiente de produção;
- O envio de e-mails deve acontecer em segundo plano (background job)

**Regras de Negócios**

- O link enviado por e-mail para resetar a senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização do perfil

**Requisitos Funcionais**

- O usuário deve poder atualizar seu nome, e-mail e senha;

**Regras de Negócios**

- O usuário náo pode alterar seu e-mail para um e-mail já atualizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para confirmar sua senha, o usuário deve informar novamente a nova senha;

# Painel do prestador
**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenadas em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo real utilizando Socket.IO;

**RN**

- A notificação deve ter um status de lida ou nào-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro as 8h, último as 17h);
- O usuário náo pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;