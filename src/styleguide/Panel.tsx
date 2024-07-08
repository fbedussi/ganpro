import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { CloseIcon } from './icons/CloseIcon'

const CloseButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
`

const IN_CLASS = 'in'

const DURATION = 150

const Dialog = styled.dialog`
  background-color: white;
  position: fixed;
  top: 0;
  bottom: 0;
  left: auto;
  right: 0;
  height: 100%;
  flex-direction: column;
  border: none;
  display: none;
  padding: 0;
  transition: transform ${DURATION}ms;
  display: flex;
  transform: translate(100%, 0);

  &[open].${IN_CLASS} {
    transform: translate(0, 0);
  }
`

const Content = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Panel = ({
  id,
  isOpen,
  onRequestClose,
  children,
}: {
  id?: string
  isOpen: boolean
  onRequestClose: () => void
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
    dialogRef.current?.classList.remove(IN_CLASS)

    // it is possible to use dialogRef.current.addEventListener('transitionend')
    // to close the modal after the fade out is completed,
    // but I feel safer with a setTimeout that executes only once and I'm sure is triggered
    // always at the right moment
    setTimeout(() => {
      dialogRef.current?.classList.remove(IN_CLASS)

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
      !dialogRef.current?.open && dialogRef.current?.show()
      dialogRef.current?.classList.add(IN_CLASS)
    } else if (dialogRef.current?.classList.contains(IN_CLASS)) {
      close()
    }
  }, [isOpen, close])

  return (
    <Dialog
      id={id}
      ref={dialogRef}
      onClick={e => {
        if (!dialogRef.current) {
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
          <button data-testid="panel-close-button" className="outline" onClick={close}>
            <CloseIcon />
          </button>
        </CloseButtonWrapper>
        {children}
      </Content>
    </Dialog>
  )
}

export default Panel
