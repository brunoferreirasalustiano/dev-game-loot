# ⚔️ Dev Game Loot

Um RPG interativo focado no ensino prático de programação Web (HTML, CSS e JavaScript). Desenvolvido para transformar o aprendizado de sintaxe e lógica em uma jornada gamificada, onde o jogador derrota monstros escrevendo código real.

## 📖 Sobre o Projeto

O **Dev Game Loot** simula um ambiente de desenvolvimento (Terminal/Preview) integrado a uma mecânica de RPG. O jogador avança por 75 níveis divididos em 3 trilhas de conhecimento, enfrentando desafios que vão desde a estrutura básica de uma página Web até o domínio de código JavaScript assíncrono.

## 🚀 Destaques Técnicos e Arquitetura

Este projeto não é apenas uma interface visual; ele lida com execução de código em tempo real do lado do cliente, exigindo soluções arquiteturais seguras e eficientes:

* **Isolamento de Escopo JS:** Implementação de um motor de execução customizado usando `new Function`. O código do jogador roda em um bloco de escopo isolado (`{}`), evitando conflitos de redeclaração de variáveis (SyntaxErrors com `const` e `let`) entre as fases.
* **Mocks de DOM Temporários:** Criação de "dublês" de objetos globais (`document`, `querySelector`, eventos de `click`) para permitir que o usuário treine manipulação de DOM de forma simulada, sem quebrar a árvore de elementos real do React.
* **Validação Regex Escalável:** Sistema de parsing e expressões regulares para validar a sintaxe HTML do jogador em tempo real, com suporte a tratamento diferenciado para *self-closing tags* (tags órfãs).
* **Mentor Interativo Dinâmico:** Um dicionário de dicas de performance, acessibilidade (a11y) e boas práticas de mercado que reage instantaneamente aos comandos digitados no terminal.
* **Sanitização de Dados:** Uso de `DOMPurify` para limpar as entradas do usuário no terminal HTML, prevenindo vulnerabilidades de injeção de código (XSS).

## 🛠️ Tecnologias Utilizadas

* **React** (Componentização e gerenciamento de estado)
* **TypeScript** (Tipagem estática para maior previsibilidade do código)
* **Vite** (Build tool e ambiente de desenvolvimento ultrarrápido)
* **DOMPurify** (Segurança)
* **CSS in JS / Styled Objects** (Dinâmica de renderização de estilos em tempo real)

## 🎮 Como rodar o projeto localmente

1. Clone o repositório:
```bash
git clone [https://github.com/brunoferreirasalustiano/dev-game-loot.git](https://github.com/brunoferreirasalustiano/dev-game-loot.git)
