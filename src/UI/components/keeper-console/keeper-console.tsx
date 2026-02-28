'use client';

import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import './keeper-console.css';

export type ConsoleItemData = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

type KeeperConsoleProps = {
  items: ConsoleItemData[];
  isMain?: boolean;
};

export default function KeeperConsole({ items, isMain = true }: KeeperConsoleProps) {
  return (
    <motion.div
      layout
      className="console-outer"
      initial={false}
      animate={{
        scale: isMain ? 1 : 0.85,
        y: isMain ? 0 : 15,
      }}
      style={{ transformOrigin: 'bottom center' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <motion.div layout className="console-panel" role="toolbar" aria-label="Console do Guardião">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <ConsoleButton key={item.label} item={item} isMain={isMain} />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function ConsoleButton({ item, isMain }: { item: ConsoleItemData, isMain: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      layout="position"
      className={`console-item ${isMain ? 'main-mode' : ''}`}
      onClick={item.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      whileHover={{
        y: -4,
        scale: 1.05,
        borderColor: '#7a8b5e', 
        color: '#b2c28e',
        boxShadow: '0 8px 15px rgba(0,0,0,0.8), inset 0 0 15px rgba(122, 139, 94, 0.4)',
      }}
      whileTap={{
        y: 2,
        scale: 0.95,
        boxShadow: '0 1px 2px rgba(0,0,0,0.9), inset 0 4px 8px rgba(0,0,0,0.8)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div layout="position" className="console-icon">
        {item.icon}
      </motion.div>

      {/* Label Interno (Aparece apenas quando é o Menu Principal) */}
      <AnimatePresence mode="wait">
        {isMain && (
          <motion.div 
            layout="position"
            initial={{ opacity: 0, width: 0 }} 
            animate={{ opacity: 1, width: 'auto' }} 
            exit={{ opacity: 0, width: 0 }} 
            className="console-label-inline"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip Hover Estilo Máquina de Escrever (Apenas Modo Sessão) */}
      {!isMain && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="console-label-container"
              initial={{ opacity: 0, y: 0, x: "-50%", rotate: -2 }}
              animate={{ opacity: 1, y: 0, x: "-50%", rotate: 0 }}
              exit={{ opacity: 0, y: 5, x: "-50%", rotate: 2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="console-label">{item.label}</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.button>
  );
}