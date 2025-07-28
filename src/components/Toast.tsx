"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

export interface ToastProps {
  type: 'success' | 'error';
  title: string;
  message: string;
  position: 'center' | 'bottom-left' | 'bottom-right';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ 
  type, 
  title, 
  message, 
  position, 
  onClose, 
  duration = 5000 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Entrada con animación
    setIsVisible(true);
    
    // Auto-cerrar después del duration
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        onClose();
      }, 300); // Duración de la animación de salida
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300); // Duración de la animación de salida
  };

  const getPositionStyles = () => {
    if (position === 'center') {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: isVisible && !isLeaving 
          ? 'translate(-50%, -50%) scale(1)' 
          : 'translate(-50%, -50%) scale(0.8)',
        zIndex: 9999,
      };
    } else if (position === 'bottom-right') {
      return {
        position: 'fixed' as const,
        bottom: '24px',
        right: '24px',
        transform: isVisible && !isLeaving 
          ? 'translateY(0) scale(1)' 
          : 'translateY(100%) scale(0.95)',
        zIndex: 9999,
      };
    }
  };

  const getBackgroundColor = () => {
    return type === 'success' ? '#FFFFFF' : '#FFFFFF';
  };

  const getBorderColor = () => {
    return type === 'success' ? '#67C076' : '#D23F63';
  };

  const getIcon = () => {
    return type === 'success' 
      ? <CheckCircle sx={{ color: '#67C076', fontSize: 24 }} />
      : <Cancel sx={{ color: '#D23F63', fontSize: 24 }} />;
  };

  return (
    <Box
      sx={{
        ...getPositionStyles(),
        opacity: isVisible && !isLeaving ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, opacity',
      }}
    >
      <Box
        sx={{
          backgroundColor: getBackgroundColor(),
          border: `2px solid ${getBorderColor()}`,
          borderRadius: '12px',
          padding: '16px 20px',
          minWidth: '320px',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          cursor: 'pointer',
        }}
        onClick={handleClose}
      >
        {/* Contenido */}
        <Box sx={{ flex: 1 }}>
          {/* Primera línea: Ícono + Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            {getIcon()}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: '16px',
                color: '#000',
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
          </Box>
          
          {/* Segunda línea: Mensaje */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '14px',
              lineHeight: 1.4,
              ml: 0 // Alineado con el ícono
            }}
          >
            {message}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
