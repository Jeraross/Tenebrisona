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
};

export default function KeeperConsole({ items }: KeeperConsoleProps) {
  return (
    <div className="console-outer">
      <div className="console-panel" role="toolbar" aria-label="Console do Guardião">
        {items.map((item, index) => (
          <ConsoleButton key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

function ConsoleButton({ item }: { item: ConsoleItemData }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="console-item"
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
      // Animação de clique (botão físico afundando)
      whileTap={{
        y: 2,
        scale: 0.95,
        boxShadow: '0 1px 2px rgba(0,0,0,0.9), inset 0 4px 8px rgba(0,0,0,0.8)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="console-icon">{item.icon}</div>

      {/* Rótulo de Máquina de Escrever */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="console-label-container"
            initial={{ opacity: 0, y: 10, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 5, rotate: 2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="console-label">{item.label}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}