import { useState } from 'react'

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [resolver, setResolver] = useState<(value: boolean) => void>()

  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve)
      setIsOpen(true)
    })
  }

  const handleClose = () => {
    setIsOpen(false)
    resolver?.(false)
  }

  const handleConfirm = () => {
    setIsOpen(false)
    resolver?.(true)
  }

  return {
    isOpen,
    confirm,
    handleClose,
    handleConfirm
  }
} 