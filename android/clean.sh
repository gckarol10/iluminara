#!/bin/bash

# Script de limpeza personalizada para React Native
echo "🧹 Limpando projeto React Native..."

cd "$(dirname "$0")"

# Parar daemons do Gradle
echo "Parando daemons do Gradle..."
./gradlew --stop 2>/dev/null || true

# Limpar diretórios de build manualmente
echo "Removendo diretórios de build..."
rm -rf app/build 2>/dev/null || true
rm -rf app/.cxx 2>/dev/null || true
rm -rf .gradle 2>/dev/null || true
rm -rf build 2>/dev/null || true

# Limpar cache do node_modules se necessário
echo "Limpando cache de node_modules..."
cd ..
rm -rf node_modules/.cache 2>/dev/null || true

echo "✅ Limpeza concluída!"
echo "💡 Para fazer build: cd android && ./gradlew assembleRelease"
