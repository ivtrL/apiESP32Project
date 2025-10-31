# Sistema de Controle de Acesso RFID + Reconhecimento Facial

Sistema completo de controle de acesso integrado, combinando autenticação por cartão RFID e reconhecimento facial. Composto por uma API REST em NestJS e firmware para ESP32.

## 📋 Visão Geral

O sistema é dividido em dois componentes principais:

1. **API Backend (NestJS)**: Gerencia autenticação, usuários, dispositivos e logs de acesso
2. **Firmware ESP32**: Controla o leitor RFID e comunica-se com a API para validação

## 🏗️ Arquitetura

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   ESP32 + RFID  │────────▶│   API NestJS     │────────▶│   PostgreSQL    │
│   + LEDs        │  HTTP   │   + Firebase     │         │   + Firebase    │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

---

## 🖥️ Parte 1: API Backend

### Requisitos

- Node.js (v16 ou superior)
- PostgreSQL 16.3
- Docker e Docker Compose (opcional, recomendado)
- Conta Firebase (para armazenamento de imagens)

### Tecnologias

- **NestJS** - Framework Node.js
- **Prisma ORM** - Gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Firebase Storage** - Armazenamento de imagens
- **JWT** - Autenticação e autorização
- **TypeScript** - Linguagem de programação

### Instalação

#### 1. Clonar o repositório

```bash
git clone https://github.com/ivtrL/apiESP32Project.git
cd apiESP32Project
```

#### 2. Instalar dependências

```bash
npm install
```

#### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"

# JWT Secrets
ACCESS_SECRET_TOKEN="seu_access_token_secret_aqui"
REFRESH_SECRET_TOKEN="seu_refresh_token_secret_aqui"

# Firebase Configuration
FIREBASE_API_KEY="sua_api_key"
FIREBASE_AUTH_DOMAIN="seu_auth_domain"
FIREBASE_PROJECT_ID="seu_project_id"
FIREBASE_STORAGE_BUCKET="seu_storage_bucket"
FIREBASE_MESSAGING_SENDER_ID="seu_messaging_sender_id"
FIREBASE_APP_ID="seu_app_id"

# Server
PORT=3000
```

#### 4. Iniciar banco de dados com Docker

```bash
docker-compose up -d
```

Isso iniciará:
- PostgreSQL na porta `5432`
- PgAdmin na porta `5050` (acesso: `admin@gmail.com` / `admin`)

#### 5. Executar migrações do Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

#### 6. Iniciar a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3000`

### 🎨 Gerenciamento de Dados

Como a API não possui frontend, use o **Prisma Studio** para visualizar e gerenciar os dados:

```bash
npx prisma studio
```

Acesse `http://localhost:5555` para ter uma interface visual completa do banco de dados.

**Funcionalidades do Prisma Studio:**
- ✅ Visualizar todas as tabelas e dados
- ✅ Criar, editar e deletar registros facilmente
- ✅ Ver relacionamentos entre entidades
- ✅ Filtrar e buscar dados
- ✅ Exportar dados em JSON

### 📡 Endpoints Principais

#### Autenticação de Dispositivos (ESP32)

```
POST /api/device/login
POST /api/auth/refresh-token/device
POST /api/card/check
```

#### Administração

```
POST /api/admin/login
POST /api/admin/create
PUT  /api/admin/update/:id
```

#### Gerenciamento de Usuários

```
POST   /api/user/create
GET    /api/user?id=&name=&email=
PUT    /api/user/update/:id
DELETE /api/user/delete/:id
POST   /api/user/login/facial
```

#### Gerenciamento de Dispositivos

```
POST   /api/device/create
GET    /api/device?deviceName=&deviceUid=
PUT    /api/device/update/:id
DELETE /api/device/delete/:id
```

#### Gerenciamento de Cartões

```
POST /api/card/create
POST /api/card/check
```

### 🗃️ Modelo de Dados

```prisma
User (usuários do sistema)
  ├── Card (cartões RFID vinculados)
  
Device (dispositivos ESP32)
  ├── Log (registros de acesso)
  
Card
  ├── Log (histórico de acessos)
      └── Time (entrada/saída)

Admin (administradores do sistema)
```

---

## 🔧 Parte 2: Firmware ESP32

### Requisitos de Hardware

- **ESP32 DevKit V1**
- **Leitor RFID MFRC522**
- **2 LEDs** (vermelho e verde)
- **2 Resistores** (220Ω para LEDs)
- **Jumpers e protoboard**
- **Cartões/tags RFID**

### Requisitos de Software

- [PlatformIO IDE](https://platformio.org/) - Extension para VS Code
- [Código do ESP32](https://github.com/ivtrL/RFIDAttendance)
- Visual Studio Code

### Instalação do PlatformIO

#### Via VS Code (Recomendado)

1. Abra o Visual Studio Code
2. Vá em **Extensions** (Ctrl+Shift+X)
3. Procure por "PlatformIO IDE"
4. Clique em **Install**
5. Reinicie o VS Code

#### Via CLI

```bash
pip install -U platformio
```

### Importar Projeto do ESP32

1. Abra o VS Code
2. Clique no ícone do PlatformIO na barra lateral
3. Selecione **Open Project**
4. Navegue até a pasta do firmware ESP32

### Conexões do Hardware

#### MFRC522 → ESP32

| MFRC522 Pin | ESP32 Pin | Descrição |
|-------------|-----------|-----------|
| SDA/SS      | GPIO 5    | Chip Select |
| SCK         | GPIO 18   | Clock |
| MOSI        | GPIO 23   | Master Out Slave In |
| MISO        | GPIO 19   | Master In Slave Out |
| RST         | GPIO 2    | Reset |
| 3.3V        | 3.3V      | Alimentação |
| GND         | GND       | Terra |

#### LEDs → ESP32

| Componente | ESP32 Pin | Observação |
|------------|-----------|------------|
| LED Verde  | GPIO 4    | Via resistor 220Ω |
| LED Vermelho | GPIO 21 | Via resistor 220Ω |

### Diagrama de Conexão

```
ESP32                    MFRC522
┌─────────────┐         ┌─────────────┐
│             │         │             │
│  GPIO 5  ───┼────────▶│  SDA        │
│  GPIO 18 ───┼────────▶│  SCK        │
│  GPIO 23 ───┼────────▶│  MOSI       │
│  GPIO 19 ◀──┼─────────│  MISO       │
│  GPIO 2  ───┼────────▶│  RST        │
│  3.3V    ───┼────────▶│  3.3V       │
│  GND     ───┼────────▶│  GND        │
│             │         └─────────────┘
│  GPIO 4  ───┼────▶ 🟢 LED Verde (+ resistor)
│  GPIO 21 ───┼────▶ 🔴 LED Vermelho (+ resistor)
│             │
└─────────────┘
```

### Configuração do Firmware

Edite o arquivo `src/main.cpp` e configure:

```cpp
// 1. Credenciais WiFi
const char *ssid = "SEU_WIFI";
const char *passwordWifi = "SUA_SENHA";

// 2. URL da API (substitua pela URL onde sua API está rodando)
char httpLoginServer[] = "http://SEU_IP:3000/api/device/login";
char httpRefreshTokenServer[] = "http://SEU_IP:3000/api/auth/refresh-token/device";
char httpCheckCardServer[] = "http://SEU_IP:3000/api/card/check";

// 3. Credenciais do dispositivo (criar via API primeiro)
authLoginRequest.email = "admin@exemplo.com";
authLoginRequest.password = "senha_admin";
authLoginRequest.deviceName = "ESP32-ENTRADA";
authLoginRequest.deviceUid = "uid_do_dispositivo"; // Obter via API
```

### Compilar e Upload

#### Via Interface PlatformIO

1. Conecte o ESP32 via USB
2. Abra o projeto no VS Code
3. Na barra inferior, clique no ícone **Upload** (→)
4. Aguarde a compilação e upload

#### Via Terminal

```bash
# Compilar
pio run

# Upload
pio run --target upload

# Monitor Serial (para debug)
pio device monitor
```

### Porta Serial

O projeto está configurado para `COM3`. Para alterar:

1. Abra `platformio.ini`
2. Modifie: `upload_port = COM3` 
3. Exemplos: `COM4` (Windows), `/dev/ttyUSB0` (Linux), `/dev/cu.usbserial-*` (Mac)

### Bibliotecas Utilizadas

- **ArduinoJson** v6.21.3 - Serialização JSON
- **MFRC522** v1.4.10 - Controle do leitor RFID
- **ESPAsyncWebServer** v3.2.2 - Servidor HTTP assíncrono

---

## 🚀 Fluxo de Funcionamento

### 1. Inicialização

```
ESP32 inicia
  ↓
Conecta ao WiFi (LEDs piscam alternadamente)
  ↓
Faz login na API com credenciais do admin
  ↓
Recebe Access Token e Refresh Token
  ↓
Inicia servidor HTTP local
  ↓
Aguarda leitura de cartões
```

### 2. Leitura de Cartão RFID

```
Usuário aproxima cartão
  ↓
ESP32 lê UID do cartão
  ↓
Envia UID + deviceUid para API (/api/card/check)
  ↓
API valida o cartão e retorna status
  ↓
┌─────────────────────┬──────────────────────┐
│   Autorizado ✓      │    Bloqueado ✗       │
├─────────────────────┼──────────────────────┤
│ LED Verde pisca 5x  │ LED Vermelho pisca 5x│
│ Registra entrada/   │ Registra tentativa   │
│ saída no log        │ bloqueada no log     │
└─────────────────────┴──────────────────────┘
```

### 3. Reconhecimento Facial (Opcional)

```
Usuário envia foto via app
  ↓
API recebe imagem e envia para serviço de reconhecimento
  ↓
Resposta retorna status (0: sem face, 1: não reconhecida, 2: reconhecida)
  ↓
API envia comando HTTP para ESP32 (/open ou /closed)
  ↓
ESP32 executa ação correspondente (LED verde ou vermelho)
```

### 4. Endpoints HTTP do ESP32

O ESP32 cria um servidor web local com endpoints:

```
GET http://<IP_DO_ESP32>/open
  → Simula abertura (LED verde pisca 5x)

GET http://<IP_DO_ESP32>/closed
  → Simula bloqueio (LED vermelho pisca 5x)
```

---

## 🔐 Configuração Inicial do Sistema

### 🎯 Método Recomendado: Prisma Studio

A forma mais fácil de gerenciar os dados é usando o **Prisma Studio**:

#### 1. Abrir Prisma Studio

```bash
npx prisma studio
```

O Prisma Studio abrirá em `http://localhost:5555`

#### 2. Criar Admin

1. Clique na tabela **Admin**
2. Clique em **Add record**
3. Preencha os campos:
   - `email`: admin@exemplo.com
   - `password`: senha_segura
   - `name`: Administrador
   - `AdminId`: será gerado automaticamente
4. Clique em **Save 1 change**

#### 3. Criar Dispositivo

1. Clique na tabela **Device**
2. Clique em **Add record**
3. Preencha:
   - `deviceName`: ESP32-ENTRADA
   - `deviceUid`: será gerado automaticamente (anote esse valor!)
4. Salve

**⚠️ IMPORTANTE**: Copie o `deviceUid` gerado - você precisará dele no firmware do ESP32

#### 4. Criar Usuário

1. Clique na tabela **User**
2. Clique em **Add record**
3. Preencha:
   - `email`: usuario@exemplo.com
   - `password`: senha123
   - `name`: João Silva
   - `userId`: será gerado automaticamente (anote!)
4. Salve

#### 5. Vincular Cartão RFID

1. Aproxime um cartão no ESP32 e veja o UID no monitor serial
2. No Prisma Studio, vá na tabela **Card**
3. Clique em **Add record**
4. Preencha:
   - `cardUid`: (cole o UID lido, ex: ` 04 2E A6 42`)
   - `userId`: (cole o userId do usuário criado)
5. Salve

### 📡 Método Alternativo: Via API

Se preferir usar requisições HTTP (útil para automação):

#### Passo 1: Criar Admin

```bash
POST http://localhost:3000/api/admin/create
Content-Type: application/json

{
  "email": "admin@exemplo.com",
  "password": "senha_segura",
  "name": "Administrador"
}
```

#### Passo 2: Criar Dispositivo

```bash
POST http://localhost:3000/api/device/create
Content-Type: application/json

{
  "deviceName": "ESP32-ENTRADA"
}

# Resposta contém o deviceUid - anote para configurar no ESP32
{
  "deviceList": [
    {
      "deviceUid": "8b7bd2787758f8f2f922c51d8fcfeb86",
      "deviceName": "ESP32-ENTRADA"
    }
  ]
}
```

#### Passo 3: Criar Usuário

```bash
POST http://localhost:3000/api/user/create
Content-Type: multipart/form-data

email: usuario@exemplo.com
password: senha123
name: João Silva
image: [arquivo de imagem para reconhecimento facial]
```

#### Passo 4: Vincular Cartão RFID

```bash
POST http://localhost:3000/api/card/create
Content-Type: application/json

{
  "cardUid": " 04 2E A6 42",  # UID lido pelo ESP32
  "userId": "abc123..."        # ID do usuário criado
}
```

**💡 Dica**: Use ferramentas como **Postman**, **Insomnia** ou **Thunder Client** (extensão do VS Code) para testar as requisições da API.

---

## 🐛 Troubleshooting

### API Backend

**Erro ao conectar no banco de dados**
- Verifique se o PostgreSQL está rodando: `docker-compose ps`
- Verifique a `DATABASE_URL` no `.env`
- Execute: `docker-compose restart database`

**Erro nas migrações do Prisma**
```bash
# Limpar e recriar banco
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

**Prisma Studio não abre**
```bash
# Verifique se a porta 5555 está livre
# Tente especificar outra porta
npx prisma studio --port 5556

# Se der erro de schema
npx prisma generate
npx prisma studio
```

**Erro no Firebase**
- Verifique todas as credenciais no `.env`
- Certifique-se de que o Storage está habilitado no Firebase Console

**Como ver os logs em tempo real**
```bash
# Ver todos os registros de acesso
# Abra Prisma Studio → Tabela "Log"

# Ver entradas/saídas
# Abra Prisma Studio → Tabela "Time"

# Ver usuários e cartões vinculados
# Abra Prisma Studio → Tabela "User" → Clique em um usuário → Ver "cards"
```

### ESP32 Firmware

**Erro ao conectar WiFi**
- Verifique SSID e senha no código do firmware
- Certifique-se de usar rede 2.4GHz (ESP32 não suporta 5GHz)
- Verifique se a rede não possui portal captivo
- Consulte o README do repositório do firmware para mais detalhes

**Erro ao fazer upload**
- Verifique a porta serial correta
- Pressione e segure o botão **BOOT** durante o upload
- Tente outra porta USB ou cabo
- Veja a seção de troubleshooting no README do firmware

**RFID não detecta cartões**
- Verifique todas as conexões conforme diagrama no README do firmware
- Confirme alimentação de 3.3V (não use 5V!)
- Teste com diferentes cartões
- Use o monitor serial para debug: `pio device monitor`

**Erro de autenticação na API**
- Verifique se o admin existe no banco (via Prisma Studio)
- Confirme que o `deviceUid` configurado no firmware está correto
- Verifique se a API está acessível na rede
- Use o IP correto da máquina (não use `localhost` no ESP32)
- Teste o endpoint manualmente: `http://<IP_DA_API>:3000/api/device/login`

**Para problemas específicos do hardware ou firmware**, consulte o README do repositório do ESP32.

---

## 📊 Logs e Monitoramento

### Ver logs da API

```bash
# Modo desenvolvimento (já mostra logs)
npm run start:dev

# Ver logs do Docker
docker-compose logs -f database
```

### Ver logs do ESP32

Consulte o README do repositório do firmware para instruções de monitoramento.

```bash
# Comando básico PlatformIO
pio device monitor
```

### Visualizar Banco de Dados com Prisma Studio

**Prisma Studio** é a interface visual recomendada para gerenciar os dados:

```bash
npx prisma studio
```

Isso abrirá automaticamente `http://localhost:5555` no navegador com uma interface intuitiva para:
- ✅ Visualizar todos os dados das tabelas
- ✅ Criar, editar e deletar registros
- ✅ Filtrar e buscar dados
- ✅ Ver relacionamentos entre tabelas

### Alternativa: PgAdmin (Opcional)

Se preferir usar PgAdmin:

1. Abra `http://localhost:5050`
2. Login: `admin@gmail.com` / `admin`
3. Adicione servidor:
   - Host: `database`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: `postgres`

---

## 🧪 Testes

### Testes da API

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

### Testar ESP32

Consulte o README do repositório do firmware para testes detalhados.

**Fluxo básico de teste:**

1. Certifique-se de que a API está rodando
2. Use o monitor serial para ver logs do ESP32
3. Aproxime um cartão e observe o UID no serial
4. Registre o cartão via **Prisma Studio**:
   - Vá na tabela **Card**
   - Crie novo registro com o `cardUid` lido e `userId` do usuário
5. Aproxime o cartão novamente para validar autorização
6. Verifique o log na tabela **Log** do Prisma Studio

### Verificar Logs de Acesso

**Via Prisma Studio** (Recomendado):

```bash
npx prisma studio
```

1. Abra a tabela **Log** para ver todos os acessos
2. Abra a tabela **Time** para ver entradas/saídas com timestamp
3. Use os filtros para buscar por:
   - `cardUid`: Ver histórico de um cartão específico
   - `deviceUid`: Ver acessos de um dispositivo
   - `Authorized`: Filtrar apenas acessos autorizados/bloqueados

**Relacionamentos úteis no Prisma Studio:**
- Clique em um **Log** → Veja o **Card** relacionado → Veja o **User** dono do cartão
- Clique em um **User** → Veja todos os **Cards** vinculados
- Clique em um **Device** → Veja todos os **Logs** registrados nele

---

## 📚 Estrutura do Projeto

```
.
├── src/                          # Backend NestJS (este repositório)
│   ├── base/
│   │   ├── controllers/         # Controllers da API
│   │   ├── repositories/        # Camada de dados
│   │   └── database/           # Configuração DB
│   ├── common/
│   │   ├── dtos/               # Data Transfer Objects
│   │   ├── middleware/         # Middlewares JWT
│   │   ├── modules/            # Módulos NestJS
│   │   └── services/           # Serviços (Firebase, etc)
│   └── main.ts                 # Entry point
│
├── prisma/schema.prisma        # Schema do banco
├── docker-compose.yml          # Docker services
└── package.json                # Dependências Node

[Repositório separado do Firmware ESP32]
├── lib/RFIDAuth/               # Biblioteca customizada
│   ├── RFIDAuth.h
│   └── RFIDAuth.cpp
├── src/main.cpp                # Código principal ESP32
└── platformio.ini              # Configuração PlatformIO
```

## 🎨 Interfaces Disponíveis

### Gerenciamento de Dados
- **Prisma Studio** (`http://localhost:5555`) - Interface visual do banco ⭐ **Recomendado**
- **PgAdmin** (`http://localhost:5050`) - Cliente PostgreSQL tradicional

### APIs
- **REST API** (`http://localhost:3000`) - Backend NestJS (este repositório)
- **ESP32 HTTP Server** (`http://<IP_DO_ESP32>`) - Servidor local do dispositivo (ver repositório do firmware)

### Ferramentas de Desenvolvimento
- **Monitor Serial** - Debug do ESP32 em tempo real (ver repositório do firmware)
- **VS Code + PlatformIO** - IDE para desenvolvimento do firmware (ver repositório do firmware)

---

## 🔒 Segurança

- ✅ Autenticação JWT com Access e Refresh Tokens
- ✅ Senhas devem ser hasheadas em produção (implementar bcrypt)
- ✅ HTTPS recomendado para produção
- ✅ Variáveis sensíveis em `.env` (nunca commitar)
- ✅ CORS configurado conforme necessário
- ✅ Rate limiting recomendado em produção

## 🚀 Deploy em Produção

### Backend

```bash
# Build
npm run build

# Iniciar
npm run start:prod
```

Recomendado usar:
- **Heroku**, **Railway** ou **AWS** para hospedagem
- **Neon** ou **Supabase** para PostgreSQL
- **PM2** para gerenciar processo Node

### ESP32

- Mantenha credenciais seguras
- Use IP fixo para o dispositivo
- Implemente watchdog para reiniciar em caso de falhas
