# 🌳 TreeCraft AI

> Transforme estruturas de árvore ASCII geradas por IAs em diretórios reais instantaneamente

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![npm version](https://img.shields.io/npm/v/treecraft-ai.svg)](https://www.npmjs.com/package/treecraft-ai)
[![npm downloads](https://img.shields.io/npm/dm/treecraft-ai.svg)](https://www.npmjs.com/package/treecraft-ai)

## 🚀 Visão Geral

**TreeCraft AI** é uma ferramenta poderosa que permite transformar estruturas de árvore ASCII (frequentemente geradas por assistentes de IA como ChatGPT, Claude ou GitHub Copilot) em estruturas de diretórios reais com um único comando.

Quando você pede para uma IA sugerir uma estrutura de projeto, ela geralmente responde com uma representação em árvore ASCII. Com o TreeCraft AI, você pode copiar essa saída diretamente para um arquivo de texto e gerar instantaneamente toda a estrutura de diretórios e arquivos, economizando tempo e evitando erros manuais.

<p align="center">
  <a href="https://github.com/MarcosBrendonDePaula/TreeCraftAI">
    <img src="https://opengraph.githubassets.com/1/MarcosBrendonDePaula/TreeCraftAI" alt="TreeCraft AI GitHub" width="800">
  </a>
</p>

## ✨ Características

- 🔍 **Detecção Inteligente**: Extrai automaticamente estruturas de árvore ASCII de textos maiores
- 🗂️ **Criação Precisa**: Gera a estrutura exata de diretórios e arquivos conforme especificado
- 📝 **Suporte a Comentários**: Preserva comentários (após o símbolo #) para referência
- 🧠 **Análise Contextual**: Determina automaticamente se um item é um arquivo ou diretório
- 🔄 **Flexibilidade**: Funciona com diversos formatos de árvore ASCII comumente usados por IAs

## 🛠️ Instalação

```bash
# Instalar globalmente
npm install -g treecraft-ai

# Ou diretamente do diretório do projeto
npm install -g .
```

## 📋 Uso

### Básico

```bash
# Se instalado globalmente
treecraft example-tree.txt

# Ou diretamente com Node.js
node treecraft.js example-tree.txt
```

### Especificando um diretório de saída

```bash
treecraft example-tree.txt ./meus-projetos
```

### Fluxo de trabalho com IA

1. Peça a uma IA (como ChatGPT) para sugerir uma estrutura de projeto
2. Copie a saída da árvore ASCII para um arquivo de texto
3. Execute `treecraft arquivo.txt`
4. Pronto! Sua estrutura de projeto está criada

## 📊 Exemplos

### Exemplo de saída de IA para um projeto React

```
meu-app-react/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   └── Sidebar.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── About.js
│   │   └── Contact.js
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── utils/
│   │   └── helpers.js
│   ├── App.js
│   └── index.js
├── package.json
├── README.md
└── .gitignore
```

### Exemplo com texto ao redor (como em uma conversa com IA)

```
Para um projeto de API REST com Node.js, recomendo a seguinte estrutura:

api-node/
├── src/
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── helpers.js
│   └── app.js
├── config/
│   └── database.js
├── tests/
│   └── api.test.js
├── .env
└── package.json

Esta estrutura segue as melhores práticas para organização de código em projetos Node.js.
```

## 🧪 Testes

```bash
npm test
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## 📦 Pacote npm

Este projeto está disponível como um pacote npm:

- **Pacote**: [treecraft-ai](https://www.npmjs.com/package/treecraft-ai)
- **Versão**: 1.0.1
- **Instalação Global**: `npm install -g treecraft-ai`
- **Uso**: `treecraft arquivo.txt [diretório-de-saída]`
