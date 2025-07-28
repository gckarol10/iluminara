# Como Gerar APK Android - Iluminara

## Pré-requisitos

1. **Conta no Expo**: Crie uma conta em [expo.dev](https://expo.dev)
2. **EAS CLI instalado**: `npm install -g eas-cli`

## Passos para Gerar APK

### 1. Fazer Login no EAS
```bash
eas login
```
Insira suas credenciais do Expo.

### 2. Gerar APK para Teste (Preview)
```bash
npm run build:android
# ou
eas build --platform android --profile preview
```

### 3. Gerar APP Bundle para Play Store
```bash
npm run build:android:production
# ou
eas build --platform android --profile production
```

## Perfis de Build Configurados

### Preview (APK)
- **Arquivo gerado**: `.apk`
- **Uso**: Testes internos, instalação direta
- **Distribuição**: Internal

### Production (AAB)
- **Arquivo gerado**: `.aab` (Android App Bundle)
- **Uso**: Upload para Google Play Store
- **Distribuição**: Store

## Configurações Importantes

### EAS.json
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### App.json - Android
```json
{
  "android": {
    "package": "com.iluminara.app",
    "versionCode": 1,
    "permissions": [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION"
    ]
  }
}
```

## Processo de Build

1. **Início**: O comando inicia o build nos servidores do EAS
2. **Duração**: Geralmente 5-15 minutos
3. **Notificação**: Você receberá um email quando terminar
4. **Download**: Link será fornecido para baixar o arquivo

## Comandos Úteis

```bash
# Ver builds em andamento
eas build:list

# Ver detalhes de um build específico
eas build:view [BUILD_ID]

# Cancelar um build
eas build:cancel [BUILD_ID]

# Ver status da conta
eas whoami

# Configurar credenciais Android
eas credentials
```

## Distribuição

### Para Testes Internos (APK)
1. Baixe o APK do link fornecido
2. Instale diretamente no dispositivo Android
3. Ative "Fontes desconhecidas" se necessário

### Para Play Store (AAB)
1. Baixe o arquivo .aab
2. Faça upload na Google Play Console
3. Configure as informações da loja
4. Publique ou envie para review

## Solução de Problemas

### Erro de Autenticação
```bash
eas logout
eas login
```

### Build Falha
- Verifique os logs do build no terminal ou dashboard
- Confirme se todas as dependências estão corretas
- Verifique se não há erros no código

### Problemas de Permissão
- Confirme que todas as permissões estão em `app.json`
- Verifique plugins do Expo configurados corretamente

## Links Úteis

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Android App Signing](https://docs.expo.dev/app-signing/app-credentials/)
- [Google Play Console](https://play.google.com/console/)

## Primeira Vez?

1. Execute `eas build --platform android --profile preview`
2. Siga as instruções para configurar credenciais
3. O EAS irá gerar automaticamente as chaves de assinatura
4. Aguarde o build completar
5. Baixe e teste o APK

⚠️ **Importante**: Mantenha suas credenciais de assinatura seguras e não as perca!
