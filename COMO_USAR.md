# Como Usar o SuperTerminals

## Aplicação Funcionando! 🎉

A aplicação **SuperTerminals** está rodando e totalmente funcional!

---

## Interface Completa

### Tela Principal

A aplicação possui:

1. **Header**
   - Título "SuperTerminals"
   - Contador de terminais configurados
   - Botão "+ Novo Terminal"

2. **Lista de Terminais**
   - Grid responsivo (1-3 colunas dependendo do tamanho da tela)
   - Cards individuais para cada terminal
   - Mensagem quando não há terminais configurados

### Card de Terminal

Cada terminal exibe:

- **Nome** do terminal
- **Status** visual (bolinha colorida + texto):
  - 🟢 Verde = Rodando
  - ⚪ Cinza = Parado
  - 🔴 Vermelho = Erro
- **Caminho** da pasta
- **Comando** a ser executado
- **Tempo de execução** (atualizado em tempo real)
- **Botões de controle**:
  - ▶️ Play (quando parado)
  - ⏹️ Stop (quando rodando)
  - ✏️ Editar (desabilitado quando rodando)
  - 🗑️ Deletar (desabilitado quando rodando)

### Formulário de Terminal

Ao clicar em "+ Novo Terminal" ou "Editar":

- **Campo Nome**: Nome descritivo do terminal
- **Campo Caminho**: Caminho da pasta do projeto
  - Pode digitar manualmente
  - Ou clicar no ícone de pasta para selecionar
- **Campo Comando**: Comando a ser executado (ex: `pnpm start:dev`)
- **Botões**:
  - Cancelar
  - Salvar

---

## Como Usar

### 1. Adicionar um Novo Terminal

1. Clique no botão **"+ Novo Terminal"**
2. Preencha os campos:
   - **Nome**: Ex: "API Backend"
   - **Caminho**: Ex: "/Users/seu-usuario/projetos/minha-api"
   - **Comando**: Ex: "pnpm start:dev"
3. Clique em **"Salvar"**

### 2. Iniciar um Terminal

1. Localize o card do terminal
2. Clique no botão **"Play"** (▶️)
3. O status mudará para "Rodando" (verde)
4. O tempo de execução começará a contar

### 3. Parar um Terminal

1. Localize o card do terminal rodando
2. Clique no botão **"Stop"** (⏹️)
3. O status mudará para "Parado" (cinza)
4. O tempo de execução será salvo

### 4. Editar um Terminal

1. Certifique-se que o terminal está **parado**
2. Clique no botão **"Editar"**
3. Modifique os campos desejados
4. Clique em **"Salvar"**

### 5. Deletar um Terminal

1. Certifique-se que o terminal está **parado**
2. Clique no botão **"Deletar"**
3. Confirme a exclusão

---

## Recursos Implementados

✅ **CRUD Completo de Terminais**
- Criar novos terminais
- Listar todos os terminais
- Editar terminais existentes
- Deletar terminais

✅ **Controle de Processos**
- Iniciar processos
- Parar processos
- Visualizar status em tempo real

✅ **Interface Moderna**
- Design dark mode
- Ícones SVG
- Animações suaves
- Responsivo (mobile, tablet, desktop)

✅ **Validações**
- Campos obrigatórios
- Verificação de pasta existente
- Não permite editar/deletar terminal rodando
- Confirmação antes de deletar

✅ **Persistência**
- Dados salvos em JSON local
- Configurações mantidas entre sessões
- Localização: `~/.superterminals/terminals.json`

✅ **Feedback Visual**
- Loading states
- Estados de erro
- Indicadores de status
- Contador de tempo em tempo real

---

## Atalhos e Dicas

### Comandos Comuns

- **Node.js**: `npm start`, `pnpm dev`, `yarn dev`
- **Python**: `python app.py`, `uvicorn main:app --reload`
- **Go**: `go run main.go`
- **Rust**: `cargo run`
- **Docker**: `docker-compose up`

### Dicas

1. **Use caminhos absolutos** para evitar problemas
2. **Teste o comando** no terminal antes de adicionar
3. **Nomeie descritivamente** para fácil identificação
4. **Agrupe projetos relacionados** com nomes similares

---

## Estrutura de Dados

Os terminais são salvos em:
```
~/.superterminals/terminals.json
```

Formato:
```json
{
  "version": "1.0.0",
  "terminals": [
    {
      "id": "uuid-aqui",
      "name": "API Backend",
      "path": "/caminho/para/projeto",
      "command": "pnpm start:dev",
      "status": "stopped",
      "created_at": "2025-01-15T10:30:00Z",
      "last_run": "2025-01-15T11:00:00Z",
      "running_time": 3600
    }
  ]
}
```

---

## Troubleshooting

### Terminal não inicia

- Verifique se o caminho existe
- Verifique se o comando está correto
- Teste o comando manualmente no terminal

### Aplicação não abre

```bash
# Reinicie a aplicação
pnpm tauri dev
```

### Porta em uso

```bash
# Mate o processo na porta 1420
lsof -ti:1420 | xargs kill -9

# Reinicie
pnpm tauri dev
```

---

## Próximas Melhorias Possíveis

- [ ] Visualização de logs em tempo real
- [ ] Variáveis de ambiente por terminal
- [ ] Grupos/categorias de terminais
- [ ] Temas claro/escuro
- [ ] Atalhos de teclado
- [ ] Exportar/importar configurações
- [ ] Histórico de execuções
- [ ] Notificações quando processo termina

---

## Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: Tauri 2 + Rust
- **Persistência**: JSON local
- **IPC**: Tauri Commands

---

Aproveite o **SuperTerminals**! 🚀

