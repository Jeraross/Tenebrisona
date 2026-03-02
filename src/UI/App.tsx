import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Balatro from './components/balatro/balatro.tsx';
import KeeperConsole from './components/keeper-console/keeper-console.tsx';
import TitleLogo from './components/title-logo/title-logo.tsx';
import Investigations from './features/investigations/index.tsx'; 
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
    { icon: <GiGearHammer size={28} />, label: 'CONFIGURAÇÕES', onClick: () => setActiveModule('CONFIGURAÇÕES') },
  ];

  // Filtra apenas os botões cruciais para a tela inicial
  const mainItems = allItems.filter(item => 
    ['INVESTIGAÇÕES', 'LIBER AZATHOTH', 'CONFIGURAÇÕES'].includes(item.label)
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

      {/* --- LOGO TENEBRISONA (MENU PRINCIPAL) --- */}
      <AnimatePresence>
        {isMainMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: '6rem', // Deixa espaço para o Console do Guardião em baixo
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none', // Permite clicar "através" da logo
              zIndex: 5
            }}
          >
            <TitleLogo />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* --- HUD DO MÓDULO --- */}
      <AnimatePresence>
        {!isMainMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '2rem',
              right: '2rem',
              bottom: '5rem',
              backgroundColor: 'rgba(26, 22, 20, 0.95)',
              border: '2px solid #4a3b2c',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              zIndex: 10
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            {activeModule === 'INVESTIGAÇÕES' && <Investigations />}
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
