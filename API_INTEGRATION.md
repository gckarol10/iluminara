# Integração da API - Iluminara App

Este documento descreve como a integração da API foi implementada no aplicativo Iluminara.

## 📋 O que foi implementado

### ✅ Autenticação
- Login e registro de usuários
- Gerenciamento de tokens JWT
- Armazenamento seguro de credenciais
- Verificação de autenticação no layout principal

### ✅ Relatórios
- Criação de relatórios com fotos
- Listagem de relatórios com filtros
- Visualização de detalhes do relatório
- Votação em relatórios
- Comentários (para prefeitura)
- Atualização de status (para prefeitura)

### ✅ Perfil do Usuário
- Exibição de dados do usuário
- Estatísticas de relatórios
- Logout seguro

### ✅ Interface Integrada
- Tela inicial com relatórios recentes
- Estados de loading e erro
- Refresh pull-to-refresh
- Navegação entre telas

## 🛠️ Estrutura de Arquivos

```
├── constants/
│   ├── Api.ts              # Tipos, constantes e enums da API
│   └── Environment.ts      # Configurações de ambiente
├── services/
│   └── ApiService.ts       # Serviço principal da API
├── hooks/
│   ├── useAuth.ts          # Hook para autenticação
│   └── useReports.ts       # Hook para relatórios
└── app/
    ├── _layout.tsx         # Layout principal com verificação de auth
    ├── auth/
    │   ├── login.tsx       # Tela de login integrada
    │   └── register.tsx    # Tela de registro integrada
    ├── (tabs)/
    │   ├── index.tsx       # Home com relatórios da API
    │   └── profile.tsx     # Perfil com dados reais
    └── report/
        ├── problem-type.tsx # Tipos de problema da API
        └── details.tsx     # Criação de relatórios
```

## ⚙️ Configuração

### 1. URL da API

Edite o arquivo `constants/Environment.ts`:

```typescript
export const ENV = {
  // Para desenvolvimento local
  API_BASE_URL: __DEV__ ? 'http://localhost:3000' : 'https://your-production-api.com',
  
  // Para usar com Expo Go (substitua pelo seu IP local)
  // API_BASE_URL: __DEV__ ? 'http://192.168.1.100:3000' : 'https://your-production-api.com',
};
```

### 2. Dependências

As seguintes dependências foram utilizadas (já estão no package.json):

```json
{
  "@react-native-async-storage/async-storage": "2.1.2",
  "expo-image-picker": "^16.1.4",
  "expo-location": "^18.1.6"
}
```

## 🚀 Como usar

### 1. Iniciar o servidor da API

Certifique-se de que sua API está rodando na URL configurada.

### 2. Executar o aplicativo

```bash
npm start
# ou
yarn start
```

### 3. Testar a integração

1. **Registro**: Crie uma nova conta
2. **Login**: Faça login com as credenciais
3. **Relatórios**: Crie novos relatórios
4. **Visualização**: Veja os relatórios na tela inicial

## 📱 Fluxo de Autenticação

1. O app verifica se há um token válido no AsyncStorage
2. Se não houver, redireciona para `/auth/login`
3. Após login/registro bem-sucedido, armazena o token e dados do usuário
4. Redireciona para a tela principal

## 🔧 Funcionalidades da API

### Autenticação
- `POST /auth/signup` - Registro de usuário
- `POST /auth/signin` - Login
- `GET /auth/profile` - Dados do usuário
- `POST /auth/logout` - Logout

### Relatórios
- `GET /reports` - Listar relatórios (com filtros)
- `POST /reports` - Criar relatório
- `GET /reports/:id` - Detalhes do relatório
- `POST /reports/:id/vote` - Votar no relatório
- `POST /reports/:id/comments` - Adicionar comentário (prefeitura)
- `PATCH /reports/:id/status` - Atualizar status (prefeitura)

## 🎨 Tipos de Problemas Suportados

- `POTHOLE` - Buracos
- `STREETLIGHT` - Iluminação Pública
- `GARBAGE` - Lixo
- `TRAFFIC_SIGN` - Sinalização
- `SIDEWALK` - Calçada
- `OTHER` - Outros

## 📊 Status dos Relatórios

- `OPEN` - Aberto
- `IN_PROGRESS` - Em Andamento
- `RESOLVED` - Resolvido
- `REJECTED` - Rejeitado

## 🔐 Segurança

- Tokens JWT armazenados de forma segura no AsyncStorage
- Headers de autorização automáticos em todas as requisições
- Logout limpa todos os dados locais
- Verificação de autenticação em todas as telas protegidas

## 🛠️ Desenvolvimento

### Adicionando novos endpoints

1. Adicione a constante em `constants/Api.ts`
2. Implemente o método em `services/ApiService.ts`
3. Use nos componentes através dos hooks

### Exemplo:

```typescript
// 1. Adicionar em Api.ts
ENDPOINTS: {
  NEW_ENDPOINT: '/new-endpoint'
}

// 2. Adicionar em ApiService.ts
async newEndpoint(data) {
  return this.request(API_CONFIG.ENDPOINTS.NEW_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 3. Usar no componente
const { data } = await ApiService.newEndpoint(formData);
```

## 🐛 Problemas Comuns

### 1. Erro de conexão
- Verifique se a API está rodando
- Confirme a URL correta em `Environment.ts`
- Para Expo Go, use o IP local ao invés de localhost

### 2. Problemas de autenticação
- Limpe o AsyncStorage: `AsyncStorage.clear()`
- Verifique se o token não expirou

### 3. Imagens não carregam
- Verifique as permissões de câmera e galeria
- Confirme se o upload de arquivos está funcionando na API

## 📝 Próximos Passos

- [ ] Implementar cache offline
- [ ] Adicionar notificações push
- [ ] Implementar busca de relatórios
- [ ] Adicionar mapa interativo
- [ ] Sistema de notificações in-app

## 🤝 Contribuição

Para contribuir com melhorias na integração da API:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste a integração
5. Abra um Pull Request

---

**Nota**: Esta integração foi implementada seguindo as melhores práticas de React Native e está pronta para produção após configurar a URL da API corretamente.
