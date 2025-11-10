# GitHub Actions - Build Multiplataforma

Este projeto está configurado para gerar builds automáticos para Windows, macOS e Linux usando GitHub Actions.

## Como Funciona

O workflow `.github/workflows/build.yml` é executado automaticamente quando:

1. **Push para branch main/master** - Gera builds de teste
2. **Pull Request** - Valida o código
3. **Tag de versão** (ex: `v0.1.0`) - Gera release oficial
4. **Manualmente** - Via interface do GitHub

## Plataformas Suportadas

O workflow gera executáveis para:

- **Windows** (x64)
  - `.msi` - Instalador Windows
  - `.exe` - Instalador NSIS

- **macOS** (Intel e Apple Silicon)
  - `.dmg` - Instalador macOS
  - `.app` - Aplicação macOS

- **Linux** (x64)
  - `.deb` - Pacote Debian/Ubuntu
  - `.AppImage` - Executável universal

## Como Usar

### 1. Fazer Push do Código

```bash
git add .
git commit -m "feat: adiciona GitHub Actions para builds multiplataforma"
git push origin main
```

### 2. Acompanhar o Build

1. Acesse o repositório no GitHub
2. Vá em **Actions**
3. Veja o progresso do workflow "Build e Release"
4. Aguarde ~10-15 minutos para conclusão

### 3. Baixar os Executáveis

Após o build concluir:

1. Vá em **Actions**
2. Clique no workflow concluído
3. Role até **Artifacts**
4. Baixe os arquivos:
   - `SuperTerminals-windows`
   - `SuperTerminals-macos-intel`
   - `SuperTerminals-macos-arm`
   - `SuperTerminals-linux`

### 4. Criar Release Oficial (Opcional)

Para criar uma release com os executáveis anexados:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Isso irá:
- Executar o build para todas as plataformas
- Criar uma release no GitHub automaticamente
- Anexar todos os executáveis à release

## Estrutura dos Artifacts

```
artifacts/
├── SuperTerminals-windows/
│   ├── *.msi
│   └── *.exe
├── SuperTerminals-macos-intel/
│   ├── *.dmg
│   └── *.app
├── SuperTerminals-macos-arm/
│   ├── *.dmg
│   └── *.app
└── SuperTerminals-linux/
    ├── *.deb
    └── *.AppImage
```

## Requisitos

- Repositório público no GitHub (ou GitHub Pro para privado)
- Actions habilitado no repositório
- Permissões de escrita para o GITHUB_TOKEN (já configurado por padrão)

## Troubleshooting

### Build falha no Windows
- Verifique se todas as dependências estão no `Cargo.toml`
- Confirme que não há código específico de Unix

### Build falha no Linux
- Verifique se as dependências do sistema estão listadas no workflow
- Confirme compatibilidade com Ubuntu 22.04

### Artifacts não aparecem
- Verifique se o build foi concluído com sucesso
- Confirme que os caminhos dos arquivos estão corretos no workflow

## Tempo de Build

Tempo estimado por plataforma:
- Windows: ~8-12 minutos
- macOS: ~10-15 minutos
- Linux: ~6-10 minutos

**Total**: ~15-20 minutos para todas as plataformas em paralelo

## Custos

- **Repositórios públicos**: Gratuito e ilimitado
- **Repositórios privados**: 2.000 minutos/mês no plano gratuito

Cada build completo consome ~40-60 minutos do total.
