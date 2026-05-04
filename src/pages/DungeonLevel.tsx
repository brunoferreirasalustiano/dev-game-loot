import { useState, useEffect, useRef, memo } from 'react';
import DOMPurify from 'dompurify';

// ==========================================
// CONTRATO DE DADOS E MISSÕES
// ==========================================
interface Missao {
  nível: number;
  inimigo: string;
  objetivo: string;
  comoFazer: string;
  teoria: string;
  tagAbertura: string;
  tagFechamento: string;
  hpMonstro: number;
  observacao?: string;
  dicaRodape: string;
}

const MISSÕES_DATA: Record<'HTML' | 'CSS' | 'JS', Missao[]> = {
  HTML: [
    { nível: 1, inimigo: "Goblin de Sintaxe", objetivo: "Crie o título principal.", comoFazer: "<h1>Hero</h1>", teoria: "O <h1> é a bússola da página. O Google o usa para entender o tema central. Nunca pule níveis de título.", tagAbertura: "<h1>", tagFechamento: "</h1>", hpMonstro: 100, dicaRodape: "🔍 SEO: Use apenas um <h1> por página para não confundir os buscadores." },
    { nível: 2, inimigo: "Slime de Texto", objetivo: "Crie um parágrafo.", comoFazer: "<p>Início</p>", teoria: "A tag <p> organiza blocos de ideias. O navegador adiciona um espaço automático entre eles.", tagAbertura: "<p>", tagFechamento: "</p>", hpMonstro: 110, dicaRodape: "📖 UX: Parágrafos curtos aumentam a retenção do usuário no seu site." },
    { nível: 3, inimigo: "Esqueleto Forte", objetivo: "Negrito semântico.", comoFazer: "<strong>Força</strong>", teoria: "Enquanto o <b> apenas 'engrossa', o <strong> avisa aos leitores de tela que o texto é importante.", tagAbertura: "<strong>", tagFechamento: "</strong>", hpMonstro: 120, dicaRodape: "♿ ACESSIBILIDADE: Use <strong> para ênfase real, não apenas visual." },
    { nível: 4, inimigo: "Orc de Ênfase", objetivo: "Texto em itálico.", comoFazer: "<em>Aviso</em>", teoria: "O <em> (emphasis) muda o tom de voz do texto. É a diferença entre ler e sentir a urgência.", tagAbertura: "<em>", tagFechamento: "</em>", hpMonstro: 130, dicaRodape: "🗣️ SEMÂNTICA: Use para destacar termos técnicos ou pensamentos do herói." },
    { nível: 5, inimigo: "Verme de Quebra", objetivo: "Quebra de linha.", comoFazer: "A <br> B", teoria: "O <br> é uma interrupção brusca. Ele não cria um novo parágrafo, apenas desce uma linha.", tagAbertura: "<br", tagFechamento: ">", hpMonstro: 140, dicaRodape: "⚠️ LAYOUT: Jamais use <br> para criar espaço entre botões. Use Margins no CSS." },
    { nível: 6, inimigo: "Gárgula de Linha", objetivo: "Divisória horizontal.", comoFazer: "<hr>", teoria: "O <hr> representa uma mudança de assunto ou o fim de uma lição. É uma barreira temática.", tagAbertura: "<hr", tagFechamento: ">", hpMonstro: 150, dicaRodape: "🎨 DESIGN: Você pode estilizar a linha com CSS para parecer uma espada ou corrente." },
    { nível: 7, inimigo: "Serpente de Link", objetivo: "Link em nova aba.", comoFazer: "<a href='https://www.linkedin.com/in/bfs-bruno/' target='_blank'>LinkedIn</a>", teoria: "O 'href' é o portal. O atributo 'target=\"_blank\"' garante que esse portal abra em uma nova aba, sem fechar o jogo!", tagAbertura: "<a", tagFechamento: "</a>", hpMonstro: 160, dicaRodape: "🔗 NETWORKING: Sempre use target='_blank' para links externos. Assim você não perde o usuário que estava navegando no seu site." },
    { nível: 8, inimigo: "Aranha de Lista", objetivo: "Lista não ordenada.", comoFazer: "<ul>Lista</ul>", teoria: "O <ul> cria uma coleção de itens que não possuem uma ordem lógica (como um inventário).", tagAbertura: "<ul>", tagFechamento: "</ul>", hpMonstro: 170, dicaRodape: "📋 MENU: Quase todos os menus de sites famosos são construídos com <ul>." },
    { nível: 9, inimigo: "Verme de Item", objetivo: "Item de lista.", comoFazer: "<li>Poção</li>", teoria: "O <li> (List Item) é o soldado da lista. Ele só pode viver dentro de um <ul> ou <ol>.", tagAbertura: "<li>", tagFechamento: "</li>", hpMonstro: 180, dicaRodape: "🧱 REGRA: Colocar um <li> solto é erro grave de estrutura HTML." },
    { nível: 10, inimigo: "Golem de Imagem", objetivo: "Invoque o Elfo.", comoFazer: "<img src='/elfo-principal.jpg'>", teoria: "Imagens não têm tag de fechamento. O 'src' indica o caminho exato do arquivo para o navegador.", tagAbertura: "<img", tagFechamento: ">", hpMonstro: 190, dicaRodape: "♿ ACESSIBILIDADE: Imagens sem atributo 'alt' são invisíveis para deficientes visuais." },
    { nível: 11, inimigo: "Besta de Span", objetivo: "Isolamento inline.", comoFazer: "<span>Status</span>", teoria: "O <span> é um container 'invisível' usado para aplicar estilos em palavras específicas dentro de um texto.", tagAbertura: "<span>", tagFechamento: "</span>", hpMonstro: 200, dicaRodape: "🖌️ CSS: Use para mudar a cor de apenas uma palavra no meio da frase." },
    { nível: 12, inimigo: "Mago da Divisão", objetivo: "Bloco container.", comoFazer: "<div>Caixa</div>", teoria: "A <div> é a caixa básica da internet. Ela agrupa elementos para formar o esqueleto do layout.", tagAbertura: "<div>", tagFechamento: "</div>", hpMonstro: 220, dicaRodape: "📦 ESTRUTURA: Evite a 'Divite' (usar div para tudo). Prefira tags com nome e significado." },
    { nível: 13, inimigo: "Cavaleiro Input", objetivo: "Campo de texto.", comoFazer: "<input type='text'>", teoria: "O <input> é o ouvido do site. O atributo 'type' define se ele vai ouvir texto, senha ou e-mail.", tagAbertura: "type='text'", tagFechamento: ">", hpMonstro: 250, dicaRodape: "📱 MOBILE: O tipo 'email' abre o teclado com o '@' automático no celular." },
    { nível: 14, inimigo: "Grifo de Header", objetivo: "Cabeçalho semântico.", comoFazer: "<header>Topo</header>", teoria: "O <header> avisa que ali estão a logo e o menu. É o 'rosto' do seu documento.", tagAbertura: "<header>", tagFechamento: "</header>", hpMonstro: 280, dicaRodape: "🧭 SEO: Buscadores priorizam o que está no cabeçalho para entender o site." },
    { nível: 15, inimigo: "Titã de Footer", objetivo: "Rodapé semântico.", comoFazer: "<footer>Fim</footer>", teoria: "O <footer> é o fim da linha. Contém créditos, redes sociais e avisos legais importantes.", tagAbertura: "<footer>", tagFechamento: "</footer>", hpMonstro: 320, dicaRodape: "📜 PADRÃO: O usuário espera encontrar seu contato sempre no rodapé." },
    { nível: 16, inimigo: "Dragão Section", objetivo: "Seção temática.", comoFazer: "<section>A</section>", teoria: "Uma <section> é um capítulo de um livro. Agrupa conteúdos que pertencem ao mesmo assunto.", tagAbertura: "<section>", tagFechamento: "</section>", hpMonstro: 350, dicaRodape: "📁 ORGANIZAÇÃO: Ideal para dividir 'Sobre', 'Serviços' e 'Contato' na página." },
    { nível: 17, inimigo: "Lorde de Main", objetivo: "Conteúdo principal.", comoFazer: "<main>Coração</main>", teoria: "O <main> é o herói da página. Ele contém o que é único naquele endereço, excluindo menus.", tagAbertura: "<main>", tagFechamento: "</main>", hpMonstro: 400, dicaRodape: "🎯 REGRA: Existe apenas um <main> por página. Não repita!" },
    { nível: 18, inimigo: "Sacerdote Label", objetivo: "Legenda de input.", comoFazer: "<label>Nome</label>", teoria: "O <label> não é apenas texto; ele é o 'irmão' do input. Ajuda a clicar e dá significado ao campo.", tagAbertura: "<label>", tagFechamento: "</label>", hpMonstro: 450, dicaRodape: "👆 UX: Clicar no texto do label deve focar o campo de texto automaticamente." },
    { nível: 19, inimigo: "Dragão Article", objetivo: "Artigo autônomo.", comoFazer: "<article>Post</article>", teoria: "O <article> é conteúdo independente. Se você o remover do site e postar em outro lugar, ele ainda faz sentido.", tagAbertura: "<article>", tagFechamento: "</article>", hpMonstro: 700, dicaRodape: "📰 BLOGS: Use para cada post individual no seu feed de notícias." },
    { nível: 20, inimigo: "Lorde do Código", objetivo: "Container form.", comoFazer: "<form>Login</form>", teoria: "O <form> é a mochila que carrega os dados dos inputs até o servidor. Sem ele, os dados se perdem.", tagAbertura: "<form>", tagFechamento: "</form>", hpMonstro: 1200, dicaRodape: "🛡️ BACKEND: É aqui que a mágica da programação se conecta com o banco de dados." }
  ],

  CSS: [
    { nível: 1, inimigo: "Slime Cor", objetivo: "Cor vermelha.", comoFazer: "{ color: red; }", teoria: "A propriedade 'color' define o tom do texto. Pode usar nomes, Hex (#ff0) ou RGB.", tagAbertura: "color:", tagFechamento: ";", hpMonstro: 100, dicaRodape: "🎨 DESIGN: Mantenha um bom contraste para que o herói consiga ler a missão." },
    { nível: 2, inimigo: "Fantasma Fundo", objetivo: "Fundo azul.", comoFazer: "{ background-color: blue; }", teoria: "O 'background-color' pinta a parede atrás do elemento. Define a atmosfera do bloco.", tagAbertura: "background-color:", tagFechamento: ";", hpMonstro: 110, dicaRodape: "🖼️ PERFORMANCE: Cores sólidas são leves. Imagens de fundo pesam o carregamento." },
    { nível: 3, inimigo: "Gigante Fonte", objetivo: "Tamanho 20px.", comoFazer: "{ font-size: 20px; }", teoria: "Controla o tamanho visual. 16px é o padrão mundial para leitura confortável.", tagAbertura: "font-size:", tagFechamento: "px;", hpMonstro: 120, dicaRodape: "📏 ACESSIBILIDADE: Em projetos reais, use 'rem' para respeitar o zoom do navegador." },
    { nível: 4, inimigo: "Arqueiro Alinha", objetivo: "Centralizar texto.", comoFazer: "{ text-align: center; }", teoria: "Alinha o texto dentro da caixa. Funciona apenas em elementos que ocupam a linha toda.", tagAbertura: "text-align:", tagFechamento: ";", hpMonstro: 130, dicaRodape: "📐 UI: Títulos centralizados passam autoridade e ordem no layout." },
    { nível: 5, inimigo: "Família Fonte", objetivo: "Fonte Arial.", comoFazer: "{ font-family: Arial; }", teoria: "Define a 'personalidade' do texto. Cada fonte transmite uma emoção diferente.", tagAbertura: "font-family:", tagFechamento: ";", hpMonstro: 140, dicaRodape: "🖋️ WEB SAFE: Sempre forneça fontes alternativas caso a principal falhe." },
    { nível: 6, inimigo: "Peso de Ferro", objetivo: "Texto bold.", comoFazer: "{ font-weight: bold; }", teoria: "O 'font-weight' controla a espessura. Bold (700) destaca o que é vital no texto.", tagAbertura: "font-weight:", tagFechamento: ";", hpMonstro: 150, dicaRodape: "💪 HIERARQUIA: Use o peso para guiar o olho do usuário para o que importa." },
    { nível: 7, inimigo: "Golem Borda", objetivo: "Borda sólida.", comoFazer: "{ border: 1px solid; }", teoria: "A borda é o escudo do elemento. Exige três valores: largura, estilo (solid) e cor.", tagAbertura: "border:", tagFechamento: "solid;", hpMonstro: 160, dicaRodape: "🔲 BOX MODEL: Lembre-se que a borda aumenta o tamanho total do seu herói." },
    { nível: 8, inimigo: "Verme Padding", objetivo: "Espaço interno.", comoFazer: "{ padding: 10px; }", teoria: "Padding é o respiro interno. Ele afasta o texto das bordas, trazendo elegância.", tagAbertura: "padding:", tagFechamento: ";", hpMonstro: 170, dicaRodape: "🎈 RESPIRO: Um design 'premium' sempre tem paddings generosos." },
    { nível: 9, inimigo: "Orc Margin", objetivo: "Espaço externo.", comoFazer: "{ margin: 20px; }", teoria: "Margin é a distância social. Ela empurra os vizinhos para longe do elemento.", tagAbertura: "margin:", tagFechamento: ";", hpMonstro: 180, dicaRodape: "↔️ FLUXO: Use 'margin: auto' para centralizar blocos inteiros na tela." },
    { nível: 10, inimigo: "Besta Width", objetivo: "Largura 100px.", comoFazer: "{ width: 100px; }", teoria: "Controla a largura horizontal. É a base da estrutura responsiva.", tagAbertura: "width:", tagFechamento: ";", hpMonstro: 190, dicaRodape: "📱 RESPONSIVO: Em celulares, prefira usar '%' ou 'max-width' para não quebrar a tela." },
    { nível: 11, inimigo: "Esqueleto Height", objetivo: "Altura 50px.", comoFazer: "{ height: 50px; }", teoria: "Define a altura. Atenção: travar a altura em blocos com texto pode causar vazamentos.", tagAbertura: "height:", tagFechamento: ";", hpMonstro: 200, dicaRodape: "↕️ DINÂMICO: Deixe o 'height' automático para o container crescer com o texto." },
    { nível: 12, inimigo: "Mago Radius", objetivo: "Arredondar.", comoFazer: "{ border-radius: 50%; }", teoria: "Corta as quinas. 50% em um quadrado perfeito cria um círculo.", tagAbertura: "border-radius:", tagFechamento: ";", hpMonstro: 220, dicaRodape: "⏺️ PSICOLOGIA: Formas curvas parecem mais amigáveis e aumentam cliques." },
    { nível: 13, inimigo: "Lobo Display", objetivo: "Modo bloco.", comoFazer: "{ display: block; }", teoria: "O modo 'block' faz o elemento ser egoísta: ele ocupa a linha inteira sozinho.", tagAbertura: "display:", tagFechamento: "block;", hpMonstro: 250, dicaRodape: "🧱 COMPORTAMENTO: Links (<a>) são inline; mude para block para criar botões." },
    { nível: 14, inimigo: "Vigia Flex", objetivo: "Ative Flexbox.", comoFazer: "{ display: flex; }", teoria: "O Flexbox ativa superpoderes de alinhamento. Itens viram elásticos dentro do container.", tagAbertura: "display:", tagFechamento: "flex;", hpMonstro: 280, dicaRodape: "🤸 FLEX: É o padrão moderno para criar menus e alinhar cards lateralmente." },
    { nível: 15, inimigo: "Hidra Direction", objetivo: "Alinhar coluna.", comoFazer: "{ flex-direction: column; }", teoria: "No Flexbox, você decide se os itens seguem como uma linha (row) ou pilha (column).", tagAbertura: "flex-direction:", tagFechamento: ";", hpMonstro: 320, dicaRodape: "🔄 MOBILE FIRST: Quase todo layout mobile vira uma coluna vertical." },
    { nível: 16, inimigo: "Titã Justify", objetivo: "Centro principal.", comoFazer: "{ justify-content: center; }", teoria: "Alinha os itens no eixo principal (horizontal no flex padrão). Acabou com os cálculos manuais.", tagAbertura: "justify-content:", tagFechamento: ";", hpMonstro: 360, dicaRodape: "🎯 ALINHAMENTO: Use 'space-between' para afastar a logo dos links no menu." },
    { nível: 17, inimigo: "Espírito Opacity", objetivo: "Transparência.", comoFazer: "{ opacity: 0.5; }", teoria: "Controla o fantasma. 0 é invisível, 1 é totalmente sólido.", tagAbertura: "opacity:", tagFechamento: ";", hpMonstro: 400, dicaRodape: "👻 CUIDADO: Reduzir a opacidade do pai deixa os filhos (textos) transparentes também." },
    { nível: 18, inimigo: "Sombra Noite", objetivo: "Sombra texto.", comoFazer: "{ text-shadow: 1px 1px; }", teoria: "Cria um clone do texto atrás dele. Ótimo para ler em cima de fundos poluídos.", tagAbertura: "text-shadow:", tagFechamento: ";", hpMonstro: 450, dicaRodape: "🌟 UX: Sombras sutis dão um ar de profundidade 3D ao seu título." },
    { nível: 19, inimigo: "Titã Grid", objetivo: "Ative Grid.", comoFazer: "{ display: grid; }", teoria: "O Grid é o arquiteto supremo. Permite controlar linhas e colunas ao mesmo tempo.", tagAbertura: "display:", tagFechamento: "grid;", hpMonstro: 800, dicaRodape: "🧮 GRID: Ideal para criar galeria de fotos ou layouts de jornal complexos." },
    { nível: 20, inimigo: "Mestre Sombras", objetivo: "Sombra caixa.", comoFazer: "{ box-shadow: 5px 5px; }", teoria: "Eleva o elemento da tela. É o segredo por trás do 'Material Design' do Google.", tagAbertura: "box-shadow:", tagFechamento: ";", hpMonstro: 1500, dicaRodape: "☁️ CAMADAS: Use sombras suaves para dar a sensação de que o card está flutuando." }
  ],

  JS: [
    { nível: 1, inimigo: "Espectro Var", objetivo: "Declare const.", comoFazer: "const n = 1; console.log(n);", teoria: "Constantes são cofres trancados. Uma vez que você guarda um valor, ninguém pode mudar.", tagAbertura: "const", tagFechamento: ");", hpMonstro: 100, dicaRodape: "🔒 ESTABILIDADE: Use const por padrão. Só mude para let se precisar reatribuir." },
    { nível: 2, inimigo: "Slime Let", objetivo: "Mude let.", comoFazer: "let v = 1; v = 2;", teoria: "O 'let' é uma caixa aberta. Você pode trocar o conteúdo dela quantas vezes quiser.", tagAbertura: "let", tagFechamento: ";", hpMonstro: 110, dicaRodape: "♻️ ESCOPO: O let respeita as chaves {}. O que nasce nelas, morre nelas." },
    { nível: 3, inimigo: "Fantasma String", objetivo: "Log texto.", comoFazer: "console.log('Oi');", teoria: "Strings são cadeias de caracteres. No JS, texto sem aspas é erro de variável.", tagAbertura: "log('", tagFechamento: "');", hpMonstro: 120, dicaRodape: "📝 DEBUG: O console.log é seu melhor amigo para descobrir erros ocultos." },
    { nível: 4, inimigo: "Gárgula Num", objetivo: "Log número.", comoFazer: "console.log(10);", teoria: "Números não usam aspas. JS sabe fazer matemática neles automaticamente.", tagAbertura: "log(", tagFechamento: ");", hpMonstro: 130, dicaRodape: "🔢 MATH: Base para barras de vida, dano de ataque e tempo de jogo." },
    { nível: 5, inimigo: "Verme Boole", objetivo: "Valor true.", comoFazer: "const v = true;", teoria: "Booleanos são interruptores de luz: ligado (true) ou desligado (false).", tagAbertura: "true", tagFechamento: ";", hpMonstro: 140, dicaRodape: "⚖️ LÓGICA: Essencial para saber se o herói está vivo ou se o mapa está aberto." },
    { nível: 6, inimigo: "Limo Concaten", objetivo: "Junte textos.", comoFazer: "console.log('A' + 'B');", teoria: "O sinal '+' em textos não soma, ele cola (concatena) as strings.", tagAbertura: "'+'", tagFechamento: ");", hpMonstro: 150, dicaRodape: "🔗 DINÂMICO: Una o nome do jogador com a frase de boas-vindas." },
    { nível: 7, inimigo: "Lobo Template", objetivo: "Use crases.", comoFazer: "console.log(`${1}`);", teoria: "Template Strings usam crases. Permitem injetar variáveis direto no texto com ${}.", tagAbertura: "${", tagFechamento: "}", hpMonstro: 160, dicaRodape: "💉 CLEAN CODE: Torna o código muito mais fácil de ler que o sinal de '+'." },
    { nível: 8, inimigo: "Golem Soma", objetivo: "Some 5+5.", comoFazer: "console.log(5 + 5);", teoria: "Operadores matemáticos básicos: +, -, *, /. Respeitam a ordem das expressões.", tagAbertura: "+", tagFechamento: ");", hpMonstro: 170, dicaRodape: "🧮 CUIDADO: Somar o número 5 com o texto '5' resulta no texto '55'." },
    { nível: 9, inimigo: "Besta Compar", objetivo: "Igual estrito.", comoFazer: "console.log(1 === 1);", teoria: "O operador '===' é o juiz rigoroso: ele checa se o valor E o tipo são idênticos.", tagAbertura: "===", tagFechamento: ");", hpMonstro: 190, dicaRodape: "🕵️ REGRA: No JavaScript moderno, nunca use '=='. Ele tenta adivinhar e gera bugs." },
    { nível: 10, inimigo: "Espectro AND", objetivo: "Operador &&.", comoFazer: "console.log(1 && 1);", teoria: "O operador 'E' (&&) só dá vitória se TODOS os lados forem verdadeiros.", tagAbertura: "&&", tagFechamento: ");", hpMonstro: 200, dicaRodape: "🧠 REACT: Usamos muito o && para mostrar algo na tela apenas se o usuário logou." },
    { nível: 11, inimigo: "Cavaleiro If", objetivo: "Use if.", comoFazer: "if(1){ console.log(1); }", teoria: "O 'if' é a encruzilhada. Se a condição for verdade, ele segue o caminho das chaves.", tagAbertura: "if", tagFechamento: "}", hpMonstro: 250, dicaRodape: "🚦 FLUXO: Se o dano for maior que a vida, o inimigo deve morrer." },
    { nível: 12, inimigo: "Gigante Else", objetivo: "Use else.", comoFazer: "if(0){}else{ log(1); }", teoria: "O 'else' é o plano B. Se o 'if' falhar, ele é executado obrigatoriamente.", tagAbertura: "else", tagFechamento: "}", hpMonstro: 280, dicaRodape: "🔀 FALLBACK: Sempre tenha um caminho alternativo para evitar travamentos no app." },
    { nível: 13, inimigo: "Mago Função", objetivo: "Crie function.", comoFazer: "function a(){}", teoria: "Funções são receitas de bolo. Você as escreve uma vez e as usa quando quiser.", tagAbertura: "function", tagFechamento: "}", hpMonstro: 320, dicaRodape: "⚙️ DRY: Don't Repeat Yourself. Se está repetindo código, transforme em função." },
    { nível: 14, inimigo: "Arqueiro Return", objetivo: "Retorne valor.", comoFazer: "function a(){return 1}", teoria: "O 'return' é o resultado da função. Ele envia o dado de volta para quem chamou.", tagAbertura: "return", tagFechamento: "}", hpMonstro: 360, dicaRodape: "📤 SAÍDA: Uma função sem return é como uma fábrica que não entrega o produto." },
    { nível: 15, inimigo: "Troll Param", objetivo: "Passe param.", comoFazer: "function a(p){}", teoria: "Parâmetros são as entradas da receita. Tornam a função flexível para vários dados.", tagAbertura: "a(p)", tagFechamento: "}", hpMonstro: 400, dicaRodape: "📥 ENTRADA: Permite que a mesma função calcule danos diferentes para armas diferentes." },
    { nível: 16, inimigo: "Vigia Array", objetivo: "Crie lista.", comoFazer: "const l = [1,2];", teoria: "Arrays são estantes de livros. Guardam vários valores em uma única variável.", tagAbertura: "[", tagFechamento: "]", hpMonstro: 450, dicaRodape: "📦 DATA: Fundamental para listar produtos de uma loja ou nomes de usuários." },
    { nível: 17, inimigo: "Ladrão Índice", objetivo: "Acesse l[0].", comoFazer: "log(l[0]);", teoria: "No JS, a contagem começa no 0. O primeiro item da lista vive no índice zero.", tagAbertura: "[", tagFechamento: "]", hpMonstro: 500, dicaRodape: "⚠️ ALERTA: Tentar acessar l[1] em uma lista de um item dará 'undefined'." },
    { nível: 18, inimigo: "Espírito Len", objetivo: "Use .length.", comoFazer: "log(l.length);", teoria: "A propriedade .length conta quantos itens existem na lista. É o tamanho da estante.", tagAbertura: ".length", tagFechamento: ");", hpMonstro: 550, dicaRodape: "📏 LOOP: Use .length para saber até onde o seu loop 'for' deve ir." },
    { nível: 19, inimigo: "Empurra Array", objetivo: "Use .push().", comoFazer: "l.push(1);", teoria: "O método .push() empurra um novo item para o final da lista. A estante cresce.", tagAbertura: "push(", tagFechamento: ");", hpMonstro: 600, dicaRodape: "📥 DINÂMICO: Adicione novos heróis ao clã conforme eles entram no jogo." },
    { nível: 20, inimigo: "Ciclope Loop", objetivo: "Use for.", comoFazer: "for(let i=0;i<1;i++){}", teoria: "O loop 'for' repete uma tarefa enquanto a condição for verdadeira. O motor do JS.", tagAbertura: "for", tagFechamento: "}", hpMonstro: 700, dicaRodape: "🔁 AUTOMAÇÃO: Use para percorrer e exibir todos os itens de um inventário." },
    { nível: 21, inimigo: "Hidra Objeto", objetivo: "Crie objeto.", comoFazer: "const o = {a:1};", teoria: "Objetos guardam dados em etiquetas (chaves). Como a ficha técnica de um herói.", tagAbertura: "{", tagFechamento: "}", hpMonstro: 800, dicaRodape: "🗃️ MODELAGEM: Use objetos para organizar HP, Nível e Nome em um só lugar." },
    { nível: 22, inimigo: "Titã Ponto", objetivo: "Acesse o.a.", comoFazer: "log(o.a);", teoria: "O ponto '.' é a chave que abre a gaveta do objeto para pegar um valor específico.", tagAbertura: ".", tagFechamento: ");", hpMonstro: 850, dicaRodape: "🔑 ACESSO: 'heroi.vida' é muito mais legível que acessar por índices manuais." },
    { nível: 23, inimigo: "Arqueiro Arrow", objetivo: "Arrow Function.", comoFazer: "const a=()=>{}", teoria: "Funções de seta são o padrão moderno. Sintaxe curta e comportamento estável de escopo.", tagAbertura: "=>", tagFechamento: "}", hpMonstro: 900, dicaRodape: "🏹 MODERNO: É a forma que você usará 90% do tempo no React e Node.js." },
    { nível: 24, inimigo: "Mago Map", objetivo: "Use .map().", comoFazer: "l.map(x=>x);", teoria: "O .map() percorre a lista e cria uma NOVA lista com os itens transformados.", tagAbertura: ".map(", tagFechamento: ");", hpMonstro: 1000, dicaRodape: "🗺️ REACT: É a ferramenta número 1 para mostrar listas na tela do navegador." },
    { nível: 25, inimigo: "Filtro Element", objetivo: "Use .filter().", comoFazer: "l.filter(x=>1);", teoria: "O .filter() cria uma nova lista apenas com os itens que passam no seu teste.", tagAbertura: ".filter(", tagFechamento: ");", hpMonstro: 1100, dicaRodape: "🧹 PESQUISA: Perfeito para criar sistemas de busca ou remover itens de um carrinho." },
    { nível: 26, inimigo: "Sacerdote DOM", objetivo: "QuerySelector.", comoFazer: "document.querySelector('x')", teoria: "O JS entra no HTML para procurar um elemento. É como o herói procurando um item no mapa.", tagAbertura: "querySelector", tagFechamento: ")", hpMonstro: 1200, dicaRodape: "🕷️ DOM: A árvore de objetos que permite ao JS 'enxergar' o seu site." },
    { nível: 27, inimigo: "Lorde Texto", objetivo: "InnerText.", comoFazer: "x.innerText='A';", teoria: "A propriedade .innerText permite reescrever o que está escrito no HTML via código.", tagAbertura: "innerText", tagFechamento: ";", hpMonstro: 1300, dicaRodape: "🛡️ SEGURANÇA: Sempre prefira innerText ao invés de innerHTML para evitar ataques hackers." },
    { nível: 28, inimigo: "Ilusão Style", objetivo: "Mude style.", comoFazer: "x.style.color='red';", teoria: "O JS pode forçar estilos CSS diretamente. Útil para feedbacks imediatos (ex: tela piscar vermelho).", tagAbertura: "style", tagFechamento: ";", hpMonstro: 1400, dicaRodape: "🎨 DINÂMICO: Mude o visual do site conforme as ações do jogador ocorrem." },
    { nível: 29, inimigo: "Dragão Event", objetivo: "Simule clique.", comoFazer: "x.click();", teoria: "Eventos são as reações do site. O clique é o gatilho mais comum para disparar magias.", tagAbertura: "click", tagFechamento: "()", hpMonstro: 1500, dicaRodape: "⚡ INTERAÇÃO: Adicionar um 'EventListener' é como dar vida aos botões do jogo." },
    { nível: 30, inimigo: "Guarda Tempo", objetivo: "SetTimeout.", comoFazer: "setTimeout(()=>{},1)", teoria: "Permite agendar uma ação para o futuro. O código espera os milissegundos passarem.", tagAbertura: "setTimeout", tagFechamento: ")", hpMonstro: 1800, dicaRodape: "⏱️ DELAY: Use para dar tempo do jogador ver uma animação antes do jogo fechar." },
    { nível: 31, inimigo: "Devora Chave", objetivo: "Desestruturar.", comoFazer: "const {a}=o;", teoria: "Tira as joias da caixa direto para o seu bolso. Pega propriedades de objetos com rapidez.", tagAbertura: "{", tagFechamento: "}", hpMonstro: 2000, dicaRodape: "✂️ CLEAN CODE: Evita repetir 'objeto.propriedade' dezenas de vezes no código." },
    { nível: 32, inimigo: "Clonador Espac", objetivo: "Spread [...].", comoFazer: "const b=[...l];", teoria: "O 'Spread' (espalhar) tira os itens de um balde e joga em outro. Copia sem quebrar referências.", tagAbertura: "...", tagFechamento: "]", hpMonstro: 2500, dicaRodape: "🧬 IMUTABILIDADE: Regra de ouro no React: nunca altere o original, sempre crie uma cópia." },
    { nível: 33, inimigo: "Arauto Falha", objetivo: "Try/Catch.", comoFazer: "try{}catch(e){}", teoria: "O escudo protetor. Tente rodar o código perigoso; se quebrar, o 'catch' segura o tombo.", tagAbertura: "try", tagFechamento: "}", hpMonstro: 3000, dicaRodape: "🧯 RESILIÊNCIA: Essencial para chamadas de servidor que podem falhar a qualquer momento." },
    { nível: 34, inimigo: "Esfinge Prom", objetivo: "Promise.", comoFazer: "Promise.resolve();", teoria: "Uma promessa de dados. O JS sabe que o dado vai chegar, ele só não sabe EXATAMENTE quando.", tagAbertura: "Promise", tagFechamento: ")", hpMonstro: 4000, dicaRodape: "🤝 ASYNC: A base da internet moderna. Tudo o que vem de fora do seu PC é uma Promise." },
    { nível: 35, inimigo: "Rei Assíncro", objetivo: "Async/Await.", comoFazer: "async function a(){}", teoria: "A evolução final. Faz código assíncrono parecer síncrono. Espera o dado chegar antes de seguir.", tagAbertura: "async", tagFechamento: "}", hpMonstro: 9999, dicaRodape: "👑 MASTER: Se você domina Async/Await, você está pronto para o mercado profissional sênior." }
  ]
};

// ==========================================
// PREVIEW TERMINAL
// ==========================================
const PreviewTerminal = memo(({ playerCode, trilha }: { playerCode: string; trilha: string }) => {
  const mentorship: Record<string, string> = {
    '<h1>': 'H1: O topo da hierarquia! O navegador agora sabe o assunto principal.',
    '<p>': 'P: Texto organizado! Parágrafos criam blocos de leitura amigáveis.',
    '<strong>': 'STRONG: Isso não é só negrito; você avisou ao Google que isso é vital.',
    '<em>': 'EM: Ênfase aplicada. O tom de voz do texto mudou.',
    '<br>': 'BR: Quebra de linha forçada. Cuidado para não usar como margem!',
    '<hr>': 'HR: Linha divisória. Uma quebra temática de conteúdo.',
    '<a ': 'A (Anchor): Um portal criado! Hiperlinks são a base da internet.',
    '<ul>': 'UL: Lista não ordenada. A estante para seus itens.',
    '<li>': 'LI: Soldado da lista. Sempre vive dentro de UL ou OL.',
    '<img>': 'IMG: Buscando imagem... Lembre-se do atributo "alt" para acessibilidade!',
    '<span>': 'SPAN: Container inline. Ótimo para pintar partes de um texto isolado.',
    '<div>': 'DIV: Você criou uma caixa de layout. Organize seu mundo aqui dentro.',
    '<input': 'INPUT: Campo de entrada. O site agora pode escutar dados do usuário.',
    '<header>': 'HEADER: O topo semântico do site. Excelente para motores de busca.',
    '<footer>': 'FOOTER: O rodapé da página. Final da jornada estrutural.',
    '<section>': 'SECTION: Capítulo criado. Organização perfeita de temas.',
    '<main>': 'MAIN: O coração da página. O conteúdo principal único vive aqui.',
    '<label>': 'LABEL: Legenda conectada ao input! Aumenta muito a área de clique.',
    '<article>': 'ARTICLE: Conteúdo autônomo. Faria sentido até fora desta página.',
    '<form>': 'FORM: A mochila de dados. Pronta para viajar ao servidor backend.',
    'color:': 'COLOR: Pigmentando pixels! Alterando a cor da fonte.',
    'background-color:': 'BACKGROUND: Pintando as paredes internas do elemento.',
    'font-size:': 'FONT-SIZE: Ajustando a escala de leitura do herói.',
    'text-align:': 'TEXT-ALIGN: Movendo o texto dentro de sua caixa delimitadora.',
    'font-family:': 'FONT-FAMILY: Trocando a personalidade e emoção da tipografia.',
    'font-weight:': 'FONT-WEIGHT: Engrossando ou afinando os traços da letra.',
    'border:': 'BORDER: Escudo ativado! O elemento agora tem limites físicos visíveis.',
    'padding:': 'PADDING: Respiro interno. Afastando o conteúdo do seu próprio escudo.',
    'margin:': 'MARGIN: Distância social. Empurrando fisicamente os elementos vizinhos.',
    'width:': 'WIDTH: Definindo a dimensão de largura do alvo.',
    'height:': 'HEIGHT: Definindo a dimensão de altura da caixa.',
    'border-radius:': 'RADIUS: Curvando a geometria. Quinas quadradas arredondando...',
    'display: block': 'BLOCK: Comportamento egoísta. O elemento toma a linha inteira para si.',
    'display: flex': 'FLEX: Super-poder ativado! Os itens filhos agora fluem elasticamente.',
    'flex-direction:': 'FLEX-DIRECTION: Mudando o eixo gravitacional (linha ou coluna).',
    'justify-content:': 'JUSTIFY: Distribuindo e alinhando itens no eixo principal.',
    'opacity:': 'OPACITY: Modo fantasma. Controlando a transparência do elemento.',
    'text-shadow:': 'TEXT-SHADOW: Clonando o texto nas sombras para dar profundidade.',
    'display: grid': 'GRID: O arquiteto supremo de tabelas e layouts complexos.',
    'box-shadow:': 'BOX-SHADOW: Levitação! O elemento aparenta flutuar sobre a tela.',
    'setTimeout': 'SETTIMEOUT: O Guardião do Tempo! Sua função foi agendada para o futuro.',
    'querySelector': 'DOM: Conexão JS-HTML estabelecida! Você selecionou um alvo na página.',
    'Promise.': 'PROMISE: Você criou um pacto assíncrono. O dado chegará em breve...',
    'async': 'ASYNC: O poder de pausar o tempo! Sua função agora pode aguardar (await).',
    'innerText': 'INNERTEXT: Manipulação de DOM! Você alterou o texto visível da página.',
    'console.log': 'LOG: Canal aberto! Imprimindo rastros de dados no terminal.',
    'function': 'FUNCTION: Receita de feitiço registrada! Pronta para ser invocada.',
    'return': 'RETURN: O entregador! A função agora finaliza e devolve um resultado.',
    '.length': 'LENGTH: A fita métrica do JS. Contando itens de uma lista ou texto.',
    'filter': 'FILTER: A peneira mágica. Removendo as impurezas da sua coleção.',
    '.push': 'PUSH: Empurrando um novo recruta para o final do seu Array.',
    'style.': 'STYLE: Ilusão acionada! Injetando CSS em tempo real via JavaScript.',
    'click()': 'CLICK: Gatilho puxado! Simulando a interação física do usuário.',
    'const': 'CONST: Cofre criado! Este espaço de memória está trancado e imutável.',
    'let': 'LET: Caixa mutável aberta. O valor pode fluir e mudar com o tempo.',
    'true': 'BOOLEAN: Verdadeiro! A base da lógica das máquinas.',
    '===': 'ESTRITO: Checando valor E tipo. O juiz mais implacável do código.',
    '&&': 'AND: A porta blindada. Só abre se TODOS os lados forem verdadeiros.',
    'else': 'ELSE: Plano B acionado. Se o caminho principal falhar, siga por aqui.',
    'try': 'TRY/CATCH: Escudo anti-falhas ativado. Se quebrar, o catch absorve o dano.',
    'for': 'FOR: Ciclope ativado! O motor do JS fará o trabalho repetitivo em loop.',
    'map': 'MAP: Transformação em massa! Gerando uma nova lista purificada.',
    '...': 'SPREAD: Clonagem das sombras! Espalhando dados sem quebrar a referência.',
    '=>': 'ARROW FUNCTION: A flecha moderna! Uma função ágil e de sintaxe letal.',
    'if': 'IF: Encruzilhada! O fluxo agora toma decisões baseadas na realidade.',
    '{a': 'DESESTRUTURAÇÃO: Extraindo joias específicas diretamente da caixa (objeto).',
    '${': 'TEMPLATE: Injetando magia (variáveis) diretamente no sangue do texto.',
    '+': 'OPERADOR: Fundindo variáveis aritméticas ou colando correntes de texto.'
  };

  const mentorKey = Object.keys(mentorship)
    .sort((a, b) => b.length - a.length)
    .find(key => playerCode.includes(key));

  if (trilha === 'HTML') {
    const scopedStyle = `
      .preview-html-container img {
        max-width: 100%;
        max-height: 150px;
        object-fit: contain;
        border-radius: 8px;
      }
    `;

    return (
      <div className="preview-html-container" style={{ backgroundColor: '#fff', height: '100%', padding: '10px', color: '#000', overflow: 'auto' }}>
        <style>{scopedStyle}</style>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(playerCode) }} />
      </div>
    );
  }

  if (trilha === 'CSS') {
    const cleanStyle = playerCode.replace(/{|}/g, '');
    const styleEntries = cleanStyle.split(';').map(s => s.split(':').map(t => t.trim())).filter(a => a.length === 2);
    const styleObject = Object.fromEntries(styleEntries);

    return (
      <div style={{ backgroundColor: '#fff', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#000', fontSize: '1.2rem', ...styleObject }}>TEXTO ALVO</span>
      </div>
    );
  }

  let output: string[] = [];
  const mockConsole = {
    log: (...args: any[]) => output.push(args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ')),
    error: (val: any) => output.push(`❌ ${val}`)
  };

  try {
    if (playerCode.trim()) {
      const execute = new Function('console', `
        var x = { click: () => console.log('Simulou um clique no elemento X!'), innerText: '', style: {} };
        var document = { querySelector: () => x };
        var o = { a: 1, b: 2 }; 
        var l = [1, 2];          
        var v = 1;              
        var n = 1;              
        
        try {
          {
            ${playerCode}
            if (!${playerCode.includes('console.log')}) {
              if (typeof v !== 'undefined' && v !== 1) console.log('Variável [v]:', v);
              else if (typeof n !== 'undefined' && n !== 1) console.log('Variável [n]:', n);
              else if (typeof o !== 'undefined') console.log('Objeto [o]:', JSON.stringify(o));
              else if (typeof l !== 'undefined') console.log('Lista [l]:', JSON.stringify(l));
            }
          }
        } catch (e) { 
          console.error(e.message); 
        }
      `);

      execute(mockConsole);

      if (output.length === 0) {
        output.push('⚡ Feitiço lido e executado silenciosamente pelo motor.');
      }
    }
  } catch (e: any) {
    output.push(`❌ Erro Estrutural: Verifique a sintaxe (vírgulas, chaves ou aspas fechadas).`);
  }

  return (
    <div style={{ backgroundColor: '#1e1e1e', height: '100%', padding: '15px', fontFamily: 'Consolas, monospace', overflowY: 'auto' }}>
      <div style={{ color: '#aaa', fontSize: '0.6rem', marginBottom: '10px', borderBottom: '1px solid #333' }}>DEBUG CONSOLE</div>

      {mentorKey && playerCode.trim() && (
        <div style={{ color: '#569cd6', fontSize: '0.75rem', marginBottom: '12px', fontStyle: 'italic', borderLeft: '2px solid #569cd6', paddingLeft: '8px' }}>
          💡 Mentor: {mentorship[mentorKey]}
        </div>
      )}

      {output.map((line, i) => (
        <div key={i} style={{ color: line.startsWith('❌') ? '#ff4757' : '#0f0', fontSize: '0.8rem', marginBottom: '4px' }}>
          <span style={{ color: '#569cd6' }}>{'>'}</span> {line}
        </div>
      ))}
    </div>
  );
});

PreviewTerminal.displayName = 'PreviewTerminal';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const DungeonLevel = ({ trilha = 'HTML' }: { trilha: 'HTML' | 'CSS' | 'JS' }) => {
  // --- LÓGICA DE PERSISTÊNCIA INTEGRADA ---
  const [fase, setFase] = useState(() => {
    const savedFase = localStorage.getItem(`dev-game-fase-${trilha}`);
    return savedFase ? parseInt(savedFase) : 0;
  });

  const [playerCode, setPlayerCode] = useState('');
  const [derrotado, setDerrotado] = useState(false);
  const [imgElfo, setImgElfo] = useState('/elfo-principal.jpg');
  const [fimDeTrilha, setFimDeTrilha] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const listaAtual = MISSÕES_DATA[trilha];
  const m = listaAtual[fase] || listaAtual[listaAtual.length - 1];

  const [feedback, setFeedback] = useState(m.comoFazer);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Efeito para salvar a fase no navegador sempre que ela mudar
  useEffect(() => {
    localStorage.setItem(`dev-game-fase-${trilha}`, fase.toString());
  }, [fase, trilha]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!fimDeTrilha) {
      setFeedback(m.comoFazer);
      setPlayerCode('');
      setDerrotado(false);
      setImgElfo('/elfo-principal.jpg');
    }
  }, [fase, trilha, fimDeTrilha]);

  const verificarSintaxe = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    let isValido = false;

    if (trilha === 'HTML') {
      const tagLimpaAbertura = m.tagAbertura.replace(/[<>]/g, '').trim().split(' ')[0].toLowerCase();
      const tagLimpaFechamento = m.tagFechamento.replace(/[<>\/]/g, '').trim();
      const tagsOrfas = ['br', 'hr', 'img', 'input'];

      if (tagsOrfas.includes(tagLimpaAbertura)) {
        isValido = playerCode.toLowerCase().includes(`<${tagLimpaAbertura}`);
      } else {
        const regex = new RegExp(`<${tagLimpaAbertura}.*?>.*?</${tagLimpaFechamento}>`, 'i');
        isValido = regex.test(playerCode);
      }
    } else {
      const codLimpo = playerCode.toLowerCase().replace(/\s+/g, '');
      const aberturaLimpa = m.tagAbertura.toLowerCase().replace(/\s+/g, '');
      const fechamentoLimpa = m.tagFechamento.toLowerCase().replace(/\s+/g, '');
      isValido = codLimpo.includes(aberturaLimpa) && codLimpo.includes(fechamentoLimpa);
    }

    if (isValido) {
      setDerrotado(true);
      setImgElfo('/elfo-feliz.jpg');
      setFeedback(`✨ CONHECIMENTO: ${m.teoria}`);
    } else {
      setImgElfo('/elfo-raiva.jpg');
      setFeedback(`❌ ERRO: Verifique se usou a estrutura correta: ${m.comoFazer}`);
      timerRef.current = setTimeout(() => {
        setFeedback(m.comoFazer);
        setImgElfo('/elfo-principal.jpg');
      }, 3000);
    }
  };

  const proximo = () => {
    if (fase < listaAtual.length - 1) setFase(fase + 1);
    else setFimDeTrilha(true);
  };

  const voltarAoMenu = () => window.location.reload();

  return (
    <div style={{ width: '95%', maxWidth: '1100px', margin: '0 auto', position: 'relative', display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '20px' }}>

      {/* SIDEBAR */}
      {isSidebarOpen && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '200px', backgroundColor: '#111', borderRight: '2px solid gold', zIndex: 1000, padding: '10px', overflowY: 'auto', color: 'white', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button onClick={() => setIsSidebarOpen(false)} style={{ backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', marginBottom: '10px' }}>FECHAR MAPA</button>
          {listaAtual.map((item, index) => (
            <button key={index} onClick={() => { setFase(index); setIsSidebarOpen(false); }} style={{ textAlign: 'left', padding: '8px', cursor: 'pointer', backgroundColor: fase === index ? 'gold' : '#222', color: fase === index ? '#000' : '#fff', border: '1px solid #444' }}>
              Lvl {item.nível}: {item.inimigo}
            </button>
          ))}
        </div>
      )}

      {/* STATUS BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '2px solid rgba(255, 215, 0, 0.3)', marginBottom: '10px' }}>
        <button onClick={() => setIsSidebarOpen(true)} style={{ backgroundColor: '#222', color: 'gold', border: '2px solid gold', padding: '8px 15px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '4px', boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)' }}>
          🗺️ MAPA MÚNDI
        </button>

        <div style={{ display: 'flex', gap: '25px', color: 'gold', fontSize: '0.85rem' }}>
          <div style={{ textAlign: 'center', borderRight: '1px solid #444', paddingRight: '20px' }}>
            <span style={{ color: '#888', display: 'block', fontSize: '0.6rem', marginBottom: '3px' }}>TRILHA ATUAL</span>
            <span style={{ letterSpacing: '1px' }}>{trilha}</span>
          </div>
          <div style={{ textAlign: 'center', borderRight: '1px solid #444', paddingRight: '20px' }}>
            <span style={{ color: '#888', display: 'block', fontSize: '0.6rem', marginBottom: '3px' }}>NÍVEL</span>
            <span>LVL {m.nível}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#888', display: 'block', fontSize: '0.6rem', marginBottom: '3px' }}>VIDA DO INIMIGO</span>
            <span style={{ color: derrotado ? '#555' : '#ff4757' }}>❤️ {derrotado ? 0 : m.hpMonstro} HP</span>
          </div>
        </div>
      </div>

      {/* DIÁLOGO */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ width: '100px', height: '100px', border: '4px solid gold', overflow: 'hidden', flexShrink: 0 }}>
          <img src={imgElfo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ backgroundColor: '#000', border: '2px solid #fff', padding: '15px', flex: 1, minWidth: '200px' }}>
          <p style={{ color: 'gold', fontWeight: 'bold', fontSize: '0.7rem', marginBottom: '8px' }}>⚔️ OBJETIVO: {m.objetivo}</p>
          <p style={{ color: '#ccc', fontSize: '0.7rem', lineHeight: '1.4' }}>{feedback}</p>
          {m.observacao && !fimDeTrilha && (
            <p style={{ color: '#ffcc00', fontSize: '0.7rem', marginTop: '10px', fontStyle: 'italic', borderTop: '1px solid #333', paddingTop: '8px' }}>💡 {m.observacao}</p>
          )}
        </div>
      </div>

      {/* EDITOR */}
      <div style={{ display: 'flex', gap: '15px', height: '230px', flexWrap: 'wrap' }}>
        <textarea
          style={{ flex: 1, minWidth: '280px', backgroundColor: '#111', color: '#0f0', padding: '15px', border: '2px solid gold', fontFamily: 'monospace', fontSize: '0.9rem' }}
          value={playerCode}
          onChange={(e) => setPlayerCode(e.target.value)}
          placeholder="// Digite seu feitiço aqui..."
        />
        <div style={{ flex: 1, minWidth: '250px', border: '2px solid #fff', overflow: 'hidden', borderRadius: '4px' }}>
          <PreviewTerminal playerCode={playerCode} trilha={trilha} />
        </div>
      </div>

      {/* DICA DE RODAPÉ */}
      <div style={{ backgroundColor: '#1a1a2e', borderLeft: '5px solid gold', padding: '15px', color: '#ddd', fontSize: '0.65rem', lineHeight: '1.5' }}>
        {m.dicaRodape}
      </div>

      {/* AÇÕES */}
      <div style={{ display: 'flex', gap: '15px' }}>
        {fimDeTrilha ? (
          <button onClick={voltarAoMenu} style={{ flex: 2, padding: '15px', backgroundColor: '#8e44ad', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>RETORNAR AO MENU 🏠</button>
        ) : !derrotado ? (
          <button onClick={verificarSintaxe} style={{ flex: 2, padding: '15px', backgroundColor: '#c0392b', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>ATACAR ⚔️</button>
        ) : (
          <button onClick={proximo} style={{ flex: 2, padding: '15px', backgroundColor: '#27ae60', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>PRÓXIMA MISSÃO ➔</button>
        )}
        <button onClick={voltarAoMenu} style={{ flex: 1, backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}>SAIR (ESC)</button>
      </div>

      <footer style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.6rem' }}>
        Desenvolvido por <strong style={{ color: 'gold' }}>Bruno Ferreira Salustiano</strong> |
        <a href="https://www.linkedin.com/in/bfs-bruno/" target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', textDecoration: 'none', marginLeft: '5px' }}>🔗 LinkedIn</a>
      </footer>
    </div>
  );
};

export default DungeonLevel;