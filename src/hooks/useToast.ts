"use client";

import { useState, useCallback } from 'react';

export interface ToastData {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
  position: 'center' | 'bottom-left' | 'bottom-right';
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      ...toast,
      id,
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showGameCollected = useCallback((gameName: string) => {
    showToast({
      type: 'success',
      title: 'Game collected',
      message: `${gameName} has been added to your collection`,
      position: 'center'
    });
  }, [showToast]);

  const showGameRemoved = useCallback((gameName: string) => {
    showToast({
      type: 'error',
      title: 'Game removed',
      message: `${gameName} has been removed from your collection`,
      position: 'bottom-right'
    });
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    showGameCollected,
    showGameRemoved,
  };
}
