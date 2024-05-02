import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'

const CloseButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
`

const FADE_IN_CLASS = 'in'

const DURATION = 150

const Dialog = styled.dialog`
  border-radius: 10px;
  background-color: white;
  position: static;
  flex-direction: column;
  border: none;
  display: none;
  padding: 0;

  &&::backdrop {
    background-color: rgba(3, 20, 52, 0.3);
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  &[open],
  &[open]::backdrop {
    display: flex;
    opacity: 0;
    transition: opacity ${DURATION}ms;
  }

  &[open].${FADE_IN_CLASS}, &[open].${FADE_IN_CLASS}::backdrop {
    opacity: 1;
  }
`

const Content = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Modal = ({
  isOpen,
  onRequestClose,
  closeOnBackdropClick,
  children,
}: {
  isOpen: boolean
  onRequestClose: () => void
  closeOnBackdropClick?: boolean
  children: React.ReactNode
}) => {
  const dialogRef = useRef<
    // TS, at least my tsc, does not have the right interface for HTMLDialogElement
    HTMLDialogElement & {
      close: () => void
      open: boolean
      showModal: () => void
      show: () => void
    }
  >(null)

  const close = useCallback(() => {
    dialogRef.current?.classList.remove(FADE_IN_CLASS)

    // it is possible to use dialogRef.current.addEventListener('transitionend')
    // to close the modal after the fade out is completed,
    // but I feel safer with a setTimeout that executes only once and I'm sure is triggered
    // always at the right moment
    setTimeout(() => {
      dialogRef.current?.classList.remove(FADE_IN_CLASS)

      if (dialogRef.current?.open) {
        dialogRef.current?.close()
      }
      if (isOpen) {
        onRequestClose()
      }
    }, DURATION)
  }, [isOpen, onRequestClose])

  useEffect(() => {
    if (!dialogRef.current) {
      return
    }

    if (isOpen) {
      // This is a key instruction, to behave like a modal, with the backdrop and all the rest
      // the dialog element must be open with the showModal method
      // the show method opens it more like a notification
      !dialogRef.current?.open && dialogRef.current?.showModal()
      dialogRef.current?.classList.add(FADE_IN_CLASS)
    } else if (dialogRef.current?.classList.contains(FADE_IN_CLASS)) {
      close()
    }
  }, [isOpen, close])

  return (
    <Dialog
      ref={dialogRef}
      onClick={e => {
        if (!dialogRef.current || !closeOnBackdropClick) {
          return
        }

        // When the backdrop is clicked the e.target is the dialog element itself
        // to distinguish internal and external click we need and internal element
        // that covers all the modal area
        if (e.target === dialogRef.current) {
          close()
        }
      }}
    >
      <Content>
        <CloseButtonWrapper>
          <button className="outline" onClick={close}>
            X
          </button>
        </CloseButtonWrapper>
        {children}
      </Content>
    </Dialog>
  )
}

export default Modal
