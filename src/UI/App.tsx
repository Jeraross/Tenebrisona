import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './App.css'
import Balatro from './components/balatro/balatro.tsx';
import KeeperConsole from './components/keeper-console/keeper-console.tsx'; 
import { 
  GiMagnifyingGlass, 
  GiSecretBook,  
  GiGearHammer   
} from 'react-icons/gi';

function App() {
// Guarda o estado global. null = Menu Principal
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // Lista com os botões do sistema
  const allItems = [ 
    { icon: <GiMagnifyingGlass size={28} />, label: 'INVESTIGAÇÕES', onClick: () => setActiveModule('INVESTIGAÇÕES') },
    { icon: <GiSecretBook size={28} />, label: 'LIBER AZATHOTH', onClick: () => setActiveModule('LIBER AZATHOTH') },
    //{ icon: <GiSoundWaves size={28} />, label: 'PAINEL DA SESSÃO', onClick: () => setActiveModule('PAINEL DA SESSÃO') },
    //{ icon: <GiShouting size={28} />, label: 'CHAMADO', onClick: () => setActiveModule('CHAMADO') }, 
    //{ icon: <GiDiceTwentyFacesTwenty size={28} />, label: 'DESTINO', onClick: () => setActiveModule('DESTINO') },
    { icon: <GiGearHammer size={28} />, label: 'MOTOR DE ÁUDIO', onClick: () => setActiveModule('MOTOR DE ÁUDIO') },
  ];

  // Filtra apenas os botões cruciais para a tela inicial
  const mainItems = allItems.filter(item => 
    ['INVESTIGAÇÕES', 'LIBER AZATHOTH', 'MOTOR DE ÁUDIO'].includes(item.label)
  );

  const isMainMenu = activeModule === null;

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        margin: 0, 
        padding: 0, 
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#0d1b1e'
      }}
      // Este clique garante que ao clicar no fundo, voltamos ao Menu Principal
      onClick={() => setActiveModule(null)} 
    >
      <Balatro 
        isRotate={false} 
        mouseInteraction={false} 
        pixelFilter={10000} 
        color1="#0d1b1e" 
        color2="#c0a080" 
        color3="#2f4f4f"
      />

      {/* --- HUD DO MÓDULO --- */}
      <AnimatePresence>
        {!isMainMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: '2rem',
              left: '2rem',
              right: '2rem',
              bottom: '7rem', // Espaço reservado para o console minimizado abaixo
              backgroundColor: 'rgba(26, 22, 20, 0.95)',
              border: '2px solid #4a3b2c',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              zIndex: 10
            }}
            // Evita que clicar dentro da janela do módulo a feche
            onClick={(e) => e.stopPropagation()} 
          >
            <h1 style={{ color: '#d8cbb8', fontFamily: 'Courier New' }}>
              Interface do Módulo: {activeModule}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONSOLE DO GUARDIÃO --- */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingBottom: '2rem',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      >
        <div style={{ pointerEvents: 'auto' }} onClick={(e) => e.stopPropagation()}>
          <KeeperConsole
            items={isMainMenu ? mainItems : allItems}
            isMain={isMainMenu}
          />
        </div>
      </div>
    </div>
  )
}

export default App
