import { useState } from 'react';
import Home from './pages/Home';
import DungeonLevel from './pages/DungeonLevel';
import './styles/global.css';

// Definimos os tipos válidos para as trilhas
type Trilha = 'HTML' | 'CSS' | 'JS';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dungeon'>('home');
  // 1. Criamos um estado para armazenar a trilha escolhida
  const [trilhaSelecionada, setTrilhaSelecionada] = useState<Trilha>('HTML');

  // 2. Função para iniciar o jogo já salvando a trilha vinda da Home
  const handleStartGame = (trilha: Trilha) => {
    setTrilhaSelecionada(trilha);
    setCurrentPage('dungeon');
  };

  return (
    <div className="game-container">
      {/* Botão de Saída Rápida quando estiver na Masmorra */}
      {currentPage === 'dungeon' && (
        <button 
          onClick={() => setCurrentPage('home')}
          style={{
            position: 'absolute', top: '10px', left: '10px',
            backgroundColor: 'transparent', color: '#ff4757',
            border: '1px solid #ff4757', fontSize: '0.5rem', cursor: 'pointer',
            zIndex: 10
          }}
        >
          ESC (SAIR)
        </button>
      )}

      {currentPage === 'home' ? (
        // 3. Passamos a nova função handleStartGame para a Home
        <Home onStartGame={handleStartGame} />
      ) : (
        // 4. Passamos a trilha selecionada para o DungeonLevel (isso resolve o erro!)
        <DungeonLevel trilha={trilhaSelecionada} />
      )}
    </div>
  );
}