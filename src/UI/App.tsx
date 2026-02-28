import './App.css'
import Balatro from './components/balatro/balatro.tsx';
import KeeperConsole from './components/keeper-console/keeper-console.tsx'; 
import { 
  GiMagnifyingGlass, 
  GiSecretBook, 
  GiSoundWaves, 
  GiShouting, 
  GiDiceTwentyFacesTwenty,
  GiGearHammer   
} from 'react-icons/gi';

function App() {
const items = [ 
    { 
      icon: <GiMagnifyingGlass size={28} />, 
      label: 'INVESTIGAÇÕES', 
      onClick: () => console.log('Abrir: Gerenciador de Investigações') 
    },
    { 
      icon: <GiSecretBook size={28} />, 
      label: 'LIBER AZATHOTH', 
      onClick: () => console.log('Abrir: Biblioteca e Assets') 
    },
    { 
      icon: <GiSoundWaves size={40} />, 
      label: 'PAINEL DA SESSÃO', 
      onClick: () => console.log('Abrir: Soundboard e Playlists') 
    },
    { 
      icon: <GiShouting size={28} />, 
      label: 'CHAMADO', 
      onClick: () => console.log('Abrir: Modulador de Voz') 
    }, 
    { 
      icon: <GiDiceTwentyFacesTwenty size={28} />, 
      label: 'DESTINO', 
      onClick: () => console.log('Abrir: Gerador de Dados') 
    },
    { 
      icon: <GiGearHammer size={28} />, 
      label: 'MOTOR DE ÁUDIO', 
      onClick: () => console.log('Abrir: Configurações do Engine') 
    },
  ];

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0, 
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#0d1b1e'
    }}>

      {/* O fundo Balatro */}
      <Balatro 
        isRotate={false} 
        mouseInteraction={false} 
        pixelFilter={10000} 
        color1="#0d1b1e" 
        color2="#c0a080" 
        color3="#2f4f4f"
      />

      {/* O Dock posicionado */}
      <div style={{ pointerEvents: 'auto' }}>
        <KeeperConsole items={items} />
      </div>
    </div>
  )
}

export default App
