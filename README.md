# Painel de Gestão NextGenXP (Versão Simplificada para Protótipo)

Este repositório contém uma versão simplificada do Painel de Gestão NextGenXP, focada na apresentação de protótipos com seções dedicadas a projetos e fluxogramas interativos.

## Funcionalidades Principais

-   **Listagem de Projetos:** Exibe uma lista de projetos.
-   **Visualização de Projeto Individual:** Cada projeto possui uma página dedicada com um fluxograma interativo.
-   **Edição de Fluxograma:** Permite adicionar novos nós, conectar nós existentes e salvar as alterações no fluxograma de cada projeto.

## Estrutura do Projeto

```
nextgenxp-dashboard-simplified/
├── frontend/             # Aplicação React para o frontend
│   ├── public/
│   ├── src/
│   │   ├── components/   # Componentes React (e.g., ProjectFlowchart)
│   │   ├── App.jsx       # Componente principal da aplicação
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/              # Aplicação Flask para o backend
│   ├── app.py            # Ponto de entrada da aplicação Flask e rotas da API
│   ├── data.json         # Arquivo JSON para armazenamento de dados (projetos e fluxogramas)
│   └── requirements.txt  # Dependências do Python
└── README.md             # Este arquivo
```

## Como Executar o Protótipo

Para executar o protótipo e visualizá-lo em sua totalidade, você precisará iniciar o backend e o frontend separadamente.

### Pré-requisitos

-   **Python 3** e `pip`
-   **Node.js** e `pnpm` (ou `npm`/`yarn`)

### 1. Iniciar o Backend (API Flask)

Abra um terminal e siga os passos:

1.  **Navegue até o diretório `backend`:**
    ```bash
    cd nextgenxp-dashboard/nextgenxp-simplified/backend
    ```
2.  **Crie e ative um ambiente virtual (recomendado):**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # No Linux/macOS
    # ou
    .\venv\Scripts\activate   # No Windows (PowerShell)
    ```
3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Execute o servidor Flask:**
    ```bash
    python3 app.py
    ```
    O servidor estará rodando em `http://127.0.0.1:5000`. Mantenha este terminal aberto.

### 2. Iniciar o Frontend (Aplicação React)

Abra **outro terminal** e siga os passos:

1.  **Navegue até o diretório `frontend`:**
    ```bash
    cd nextgenxp-dashboard/nextgenxp-simplified/nextgenxp-frontend
    ```
2.  **Instale as dependências (se ainda não o fez):**
    ```bash
    pnpm install
    # ou npm install / yarn install
    ```
3.  **Inicie o servidor de desenvolvimento React:**
    ```bash
    pnpm run dev --host
    # ou npm run dev --host / yarn dev --host
    ```
    Isso abrirá o aplicativo no seu navegador, geralmente em `http://localhost:5173/`.

### Visualização Completa

Com ambos, backend e frontend, em execução, o aplicativo React fará requisições à API Flask, permitindo a interação completa com a listagem de projetos e a edição dos fluxogramas.

--- 

**Autor:** Manus AI
**Data:** 29 de Setembro de 2025
