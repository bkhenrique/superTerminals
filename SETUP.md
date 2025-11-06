# Setup do SuperTerminals

## Pré-requisitos

### 1. Instalar Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Após a instalação, reinicie o terminal e verifique:

```bash
rustc --version
cargo --version
```

### 2. Instalar Xcode Command Line Tools (macOS)

```bash
xcode-select --install
```

### 3. Verificar Node.js e pnpm

```bash
node --version  # Deve ser >= 18
pnpm --version  # Já instalado
```

## Instalação do Projeto

### 1. Instalar dependências do frontend

```bash
pnpm install
```

### 2. Verificar compilação do Rust

```bash
cd src-tauri
cargo check
cd ..
```

## Executar o Projeto

### Modo Desenvolvimento

```bash
pnpm tauri dev
```

Isso irá:
- Compilar o backend Rust
- Iniciar o servidor Vite (frontend)
- Abrir a aplicação desktop
- Habilitar hot reload

### Build de Produção

```bash
pnpm tauri build
```

O executável estará em: `src-tauri/target/release/bundle/macos/`

## Estrutura do Projeto

```
superTerminals/
├── docs/                   # Documentação completa
│   ├── README.md          # Visão geral
│   ├── ARCHITECTURE.md    # Arquitetura detalhada
│   ├── API.md             # Referência da API
│   └── DEVELOPMENT.md     # Guia de desenvolvimento
│
├── src/                   # Frontend React
│   ├── components/        # Componentes React
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript types
│   ├── utils/            # Utilitários
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Entry point
│   └── index.css         # Estilos globais (Tailwind)
│
├── src-tauri/            # Backend Rust
│   ├── src/
│   │   ├── main.rs       # Entry point
│   │   ├── lib.rs        # Biblioteca principal
│   │   ├── commands.rs   # Comandos Tauri (IPC)
│   │   ├── process.rs    # Gerenciamento de processos
│   │   ├── storage.rs    # Persistência JSON
│   │   └── models.rs     # Estruturas de dados
│   ├── Cargo.toml        # Dependências Rust
│   └── tauri.conf.json   # Configuração Tauri
│
├── package.json          # Dependências Node.js
├── tailwind.config.js    # Configuração Tailwind
├── postcss.config.js     # Configuração PostCSS
└── SETUP.md             # Este arquivo
```

## Próximos Passos

1. **Instalar Rust** (se ainda não instalou)
2. **Executar `pnpm tauri dev`** para testar
3. **Começar a implementar os componentes React**
4. **Testar a integração frontend-backend**

## Troubleshooting

### Erro: "cargo: command not found"

Instale o Rust conforme instruções acima e reinicie o terminal.

### Erro: "Failed to compile Rust"

```bash
cd src-tauri
cargo clean
cargo check
```

### Erro: "Port already in use"

```bash
lsof -ti:1420 | xargs kill -9
```

## Recursos

- [Documentação Tauri](https://tauri.app/v1/guides/)
- [Documentação React](https://react.dev/)
- [Documentação Rust](https://doc.rust-lang.org/book/)
- [Documentação TailwindCSS](https://tailwindcss.com/docs)

