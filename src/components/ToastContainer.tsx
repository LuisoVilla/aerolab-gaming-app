"use client";

import React from 'react';
import Toast from './Toast';
import { ToastData } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          position={toast.position}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </>
  );
}
