# SuperTerminals

<div align="center">
  <h3>Gerenciador de Terminais e Comandos</h3>
  <p>Interface gráfica moderna para gerenciar múltiplos terminais, similar ao Docker Desktop</p>
</div>

---

## Sobre

**SuperTerminals** é uma aplicação desktop que permite gerenciar múltiplos terminais/comandos de forma visual e intuitiva. Você pode adicionar, configurar e executar comandos em diferentes diretórios, tudo através de uma interface amigável.

### Características

- Interface gráfica moderna e intuitiva
- Gerenciamento de múltiplos terminais
- Controles Play/Stop para cada terminal
- Visualização de tempo de execução
- Logs em tempo real
- Persistência de configurações em JSON
- Executável standalone (cross-platform)
- Leve e performático

### Stack Tecnológica

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Tauri + Rust
- **Persistência**: JSON local

---

## Início Rápido

### Pré-requisitos

1. **Node.js** >= 18
2. **Rust** >= 1.70
3. **pnpm**

### Instalação

```bash
# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm tauri dev

# Build para produção
pnpm tauri build
```

Para instruções detalhadas de instalação, veja [SETUP.md](./SETUP.md)

---

## Documentação

- [README](./docs/README.md) - Visão geral completa
- [ARCHITECTURE](./docs/ARCHITECTURE.md) - Arquitetura detalhada
- [API](./docs/API.md) - Referência da API
- [DEVELOPMENT](./docs/DEVELOPMENT.md) - Guia de desenvolvimento
- [SETUP](./SETUP.md) - Instruções de instalação

---

## Estrutura do Projeto

```
superTerminals/
├── docs/              # Documentação
├── src/               # Frontend React
├── src-tauri/         # Backend Rust
└── package.json
```

---

## Status do Projeto

- [x] Documentação completa
- [x] Setup inicial do projeto
- [x] Estrutura de pastas
- [x] Backend Rust (comandos completos)
- [x] Componentes React (todos implementados)
- [x] Integração frontend-backend (funcionando)
- [x] Interface completa e funcional
- [x] Toggle de visualização Grid/Lista
- [x] Sistema de logs em tempo real
- [x] Build de produção
- [ ] Testes automatizados

**Status**: ✅ **APLICAÇÃO FUNCIONANDO COMPLETAMENTE!**

---

## Screenshots

### Interface Principal - Visualização em Cards
![Interface Principal](./imagens/f1.jpeg)

### Visualização em Lista
![Visualização em Lista](./imagens/f2.jpeg)

### Adicionar Novo Terminal
![Adicionar Terminal](./imagens/f3.jpeg)

### Logs em Tempo Real
![Logs em Tempo Real](./imagens/f4.jpeg)

### Gerenciamento de Processos
![Gerenciamento de Processos](./imagens/f5.jpeg)

---

## Licença

MIT

## Autor

Henrique
