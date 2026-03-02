import { motion } from 'motion/react';

export default function TitleLogo() {
  const title = "TENEBRISONA";
  
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        whiteSpace: 'nowrap', 
        position: 'relative', // Necessário para a aura de fundo
      }}
    >
      {/* Aura Eldritch de fundo pulsante */}
      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [0.8, 1.2, 0.8],
          filter: ['blur(40px)', 'blur(60px)', 'blur(40px)']
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          width: '120%',
          height: '150%',
          background: 'radial-gradient(ellipse at center, rgba(16, 54, 41, 0.6) 0%, rgba(0, 0, 0, 0) 70%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      {title.split('').map((letter, index) => { 
        const delay = index * 0.15;
        const durationY = 3 + (index % 3); 
        const twitchX = index % 2 === 0 ? 2 : -2;
        const rot = (index % 4) - 1.5;

        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 50, filter: 'blur(20px)', rotate: -10 }}
            animate={{ 
              opacity: [0.8, 1, 0.85], 
              y: [0, -8 - (index % 4) * 2, 0], // Sobe em alturas diferentes
              x: [0, twitchX, 0], // Tremor lateral leve
              rotate: [0, rot, 0], // Leve contorção
              filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'], // Foco e desfoque
              color: ['#d8cbb8', '#a3b19b', '#d8cbb8'] // Cor desbota 
            }}
            transition={{
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
              y: { duration: durationY, repeat: Infinity, ease: "easeInOut", delay },
              x: { duration: durationY * 0.7, repeat: Infinity, ease: "easeInOut", delay },
              rotate: { duration: durationY * 1.2, repeat: Infinity, ease: "easeInOut", delay },
              filter: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay + 1 },
              color: { duration: 6, repeat: Infinity, ease: "easeInOut", delay }
            }}
            style={{
              fontFamily: "'AonCariCeltic', serif",
              fontSize: '9.5rem',
              textShadow: `
                0px 15px 25px rgba(0, 0, 0, 1),
                0px 0px 40px rgba(30, 90, 60, 0.6),  
                3px 3px 0px #081112,
                -2px -2px 0px #081112
              `,
              display: 'inline-block',
              padding: '0 0.2rem', 
              userSelect: 'none',
              transformOrigin: 'bottom center',
            }}
          >
            {letter}
          </motion.span>
        );
      })}
    </div>
  );
}