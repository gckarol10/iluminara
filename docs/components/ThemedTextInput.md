# ThemedTextInput Component

## Descrição

O `ThemedTextInput` é um componente customizado que estende o `TextInput` nativo do React Native, aplicando automaticamente cores e estilos consistentes para texto e placeholder.

## Características

- **Cor de texto automática**: `#1a1a1a` (cinza escuro)
- **Cor de placeholder automática**: `#999` (cinza médio)
- **Estilos pré-definidos**: Bordas, padding, background e border radius
- **Duas variantes**: `default` e `search`

## Propriedades

Todas as propriedades do `TextInput` padrão, mais:

- `variant?: 'default' | 'search' | 'password'` - Define o estilo do input
  - `default`: Input padrão com bordas e padding completo
  - `search`: Input para busca sem bordas (usado dentro de containers)
  - `password`: Input para senhas dentro de containers com ícone de visibilidade

## Uso

### Input Padrão
```tsx
import { ThemedTextInput } from '../../components/ThemedTextInput';

<ThemedTextInput
  placeholder="Digite seu email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>
```

### Input de Busca
```tsx
<View style={styles.searchContainer}>
  <Ionicons name="search" size={20} color="#666" />
  <ThemedTextInput
    variant="search"
    placeholder="Buscar..."
    value={searchText}
    onChangeText={setSearchText}
  />
</View>
```

### Input de Senha
```tsx
<View style={styles.passwordContainer}>
  <ThemedTextInput
    variant="password"
    placeholder="Digite sua senha"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
  />
  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
    <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} />
  </TouchableOpacity>
</View>
```

### Input com Estilos Customizados
```tsx
<ThemedTextInput
  style={{ marginBottom: 16 }}
  placeholder="Descrição"
  value={description}
  onChangeText={setDescription}
  multiline
  numberOfLines={4}
/>
```

## Vantagens

1. **Consistência**: Todos os inputs têm a mesma aparência
2. **Menos código**: Não precisa definir cores em cada input
3. **Manutenibilidade**: Mudanças de design em um só lugar
4. **Compatibilidade**: Funciona em modo claro/escuro automaticamente

## Migração

### Antes:
```tsx
<TextInput
  style={styles.input}
  placeholder="Digite aqui..."
  placeholderTextColor="#999"
  value={value}
  onChangeText={setValue}
/>
```

### Depois:
```tsx
<ThemedTextInput
  style={styles.input}
  placeholder="Digite aqui..."
  value={value}
  onChangeText={setValue}
/>
```

## Estilos CSS que podem ser removidos

Ao usar o `ThemedTextInput`, você pode remover essas propriedades dos seus estilos:

```tsx
// Não precisa mais definir:
const styles = StyleSheet.create({
  input: {
    // borderWidth: 1,           // ✅ Já definido
    // borderColor: '#e0e0e0',   // ✅ Já definido  
    // borderRadius: 8,          // ✅ Já definido
    // paddingHorizontal: 16,    // ✅ Já definido
    // paddingVertical: 12,      // ✅ Já definido
    // fontSize: 16,             // ✅ Já definido
    // backgroundColor: '#fff',  // ✅ Já definido
    // color: '#1a1a1a',         // ✅ Já definido
    
    // Apenas estilos específicos:
    marginBottom: 16,  // ✅ Mantenha estilos de layout
  }
});
```
