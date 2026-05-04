import { useState } from 'react';

// 1. Definição das propriedades (adicionamos a trilha)
interface HomeProps {
  onStartGame: (trilha: 'HTML' | 'CSS' | 'JS') => void;
}

const Home = ({ onStartGame }: HomeProps) => {
  const [imgElfo, setImgElfo] = useState('/elfo-principal.jpg');
  const [balaoTexto, setBalaoTexto] = useState('Saudações! Escolha o caminho que deseja dominar hoje.');

  // Função para mudar o humor do elfo ao passar o mouse nas trilhas
  const mudarHumor = (trilha: string) => {
    setImgElfo('./elfo-feliz.jpg');
    setBalaoTexto(`Ótima escolha! Vamos dominar o ${trilha}?`);
  };

  const resetarHumor = () => {
    setImgElfo('/elfo-principal.jpg');
    setBalaoTexto('Saudações! Escolha o caminho que deseja dominar hoje.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ color: 'var(--gold)', fontSize: '1.8rem', textShadow: '4px 4px #c0392b', fontFamily: 'var(--font-retro)' }}>
          DEV GAMES LOOT
        </h1>
      </header>

      {/* ÁREA DO ELFO AVENTUREIRO */}
      <section style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div style={{
          width: '180px', height: '180px', border: '4px solid var(--gold)',
          backgroundColor: '#fff', display: 'flex', justifyContent: 'center',
          alignItems: 'center', overflow: 'hidden', boxShadow: '0 0 15px var(--gold)'
        }}>
          <img src={imgElfo} alt="Mestre Elfo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        
        <div style={{
          marginTop: '15px', padding: '12px', border: '3px solid #fff',
          backgroundColor: '#000', minHeight: '50px', textAlign: 'center',
          fontSize: '0.7rem', width: '100%', maxWidth: '400px', color: '#fff'
        }}>
          <p>{balaoTexto}</p>
        </div>
      </section>

      {/* NOVO MENU DIVIDIDO */}
      <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '400px', marginTop: '10px' }}>
        <button 
          onMouseEnter={() => mudarHumor('HTML')} 
          onMouseLeave={resetarHumor}
          onClick={() => onStartGame('HTML')}
          className="btn-menu"
          style={{ flex: 1, backgroundColor: '#e67e22', border: '3px solid #d35400' }}
        >
          HTML
        </button>

        <button 
          onMouseEnter={() => mudarHumor('CSS')} 
          onMouseLeave={resetarHumor}
          onClick={() => onStartGame('CSS')}
          className="btn-menu"
          style={{ flex: 1, backgroundColor: '#2980b9', border: '3px solid #2471a3' }}
        >
          CSS
        </button>

        <button 
          onMouseEnter={() => mudarHumor('JS')} 
          onMouseLeave={resetarHumor}
          onClick={() => onStartGame('JS')}
          className="btn-menu"
          style={{ flex: 1, backgroundColor: '#f1c40f', border: '3px solid #f39c12', color: '#000' }}
        >
          JS
        </button>
      </div>

    </div>
  );
};

export default Home;