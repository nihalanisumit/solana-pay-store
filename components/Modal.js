import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { forwardRef, useState, useEffect } from 'react'

const CustomModal = forwardRef(
  (
    {
      isOpen,
      onClose,
      children,
      isLazy = false,
      motionPreset = 'scale',
      showModalCloseButton = true,
      isCentered = true,
      ...props
    },
    ref,
  ) => {
    const [shouldRenderChildren, setShouldRenderChildren] = useState(!isLazy)

    useEffect(() => {
      if (isLazy && isOpen) {
        setTimeout(() => setShouldRenderChildren(true), 100)
      }

      return () => {
        if (isLazy && isOpen) {
          setShouldRenderChildren(false)
        }
      }
    }, [isOpen, isLazy])

    function handleClose() {
      if (isLazy) {
        setShouldRenderChildren(false)
      }
      onClose()
    }

    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        scrollBehavior="inside"
        motionPreset={motionPreset}
        isCentered={isCentered}
      >
        <ModalOverlay />
        <ModalContent
          key="modal"
          // maxHeight={{ base: 'auto', md: '85vh' }}
          maxWidth="95%"
          width="auto"
          bg="none"
          {...props}
        >
          {showModalCloseButton && shouldRenderChildren && <ModalCloseButton color="#aaa" outline="unset" />}
          <ModalBody m={0} p={0} overflowX="hidden" ref={ref} display="flex" justifyContent="center" borderRadius="lg">
            {shouldRenderChildren ? children : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  },
)
CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  isLazy: PropTypes.bool,
  motionPreset: PropTypes.string,
  showModalCloseButton: PropTypes.bool,
  isCentered: PropTypes.bool,
}

export default CustomModal
