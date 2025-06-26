'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          maxWidth: '400px',
        },
        success: {
          style: {
            border: '1px solid #10b981',
            background: '#f0fdf4',
            color: '#059669',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#f0fdf4',
          },
        },
        error: {
          style: {
            border: '1px solid #ef4444',
            background: '#fef2f2',
            color: '#dc2626',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fef2f2',
          },
        },
        loading: {
          style: {
            border: '1px solid #f59e0b',
            background: '#fffbeb',
            color: '#d97706',
          },
          iconTheme: {
            primary: '#f59e0b',
            secondary: '#fffbeb',
          },
        },
      }}
    />
  )
} 