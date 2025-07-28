"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useToast, ToastData } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';

interface ToastContextType {
  showGameCollected: (gameName: string) => void;
  showGameRemoved: (gameName: string) => void;
  showToast: (toast: Omit<ToastData, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, removeToast, showGameCollected, showGameRemoved, showToast } = useToast();

  const value: ToastContextType = {
    showGameCollected,
    showGameRemoved,
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
