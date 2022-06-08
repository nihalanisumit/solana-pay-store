import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Heading,
  Box,
  Button,
} from '@chakra-ui/react'
import { create } from 'ipfs-http-client'
import styles from '../styles/CreateProduct.module.css'
import toast from 'react-hot-toast'
import CustomModal from './Modal'
import { rem } from '../lib/util'

const client = create('https://ipfs.infura.io:5001/api/v0')

const CreateProduct = ({ open, setOpenModal }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image_url: '',
    description: '',
  })
  const [file, setFile] = useState({})
  const [uploading, setUploading] = useState(false)

  async function onChange(e) {
    setUploading(true)
    const files = e.target.files
    try {
      console.log(files[0])
      const added = await client.add(files[0])
      setFile({ filename: files[0].name, hash: added.path })
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
    setUploading(false)
  }

  const createProduct = async () => {
    try {
      // Combine product data and file.name
      if (!newProduct.name || !newProduct.price || !newProduct.image_url) {
        toast.error('Please input the required fields.')
        return
      }
      const product = { ...newProduct, ...file }
      console.log('Sending product to api', product)
      const response = await fetch('../api/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
      const data = await response.json()
      if (response.status === 200) {
        toast.success('Product added!')
        setOpenModal(false)
      } else {
        toast.error('Unable to add product: ', data.error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal isOpen={open} onClose={setOpenModal} isCentered={true} scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
      <ModalContent key="modal" bg="none">
        <ModalBody>
          <ModalCloseButton
            color="#fff"
            outline="unset"
            bg="none"
            border="none"
            right={'30vw'}
            top={'10vh'}
            position="absolute"
          />
          <Stack direction={'column'} align="center" justify={'center'} py={10} mx="20vw" bg="none">
            <Heading borderRadius="10px 10px 0 0" color="white">
              Create Product
            </Heading>

            <Stack direction="column" px="20px" bg="#202020" py={10} borderRadius="20px">
              <input
                type="file"
                className={styles.input}
                accept=".zip,.rar,.7zip"
                placeholder="Emojis*"
                onChange={onChange}
              />
              {file.name != null && <p className="file-name">{file.filename}</p>}
              <input
                className={styles.input}
                type="text"
                placeholder="*Product Name"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, name: e.target.value })
                }}
              />
              <input
                className={styles.input}
                type="text"
                placeholder="*0.01 USDC"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, price: e.target.value })
                }}
              />
              <input
                className={styles.input}
                type="url"
                placeholder="*Image URL ex: https://i.imgur.com/rVD8bjt.png"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, image_url: e.target.value })
                }}
              />
              \
              <textarea
                className={styles.text_area}
                placeholder="Description here..."
                onChange={(e) => {
                  setNewProduct({ ...newProduct, description: e.target.value })
                }}
              />
              <Button
                px={4}
                py={8}
                borderRadius="8px"
                fontSize={rem(18)}
                bg="rgb(46, 46, 46)"
                color="#eee"
                _hover={{ bg: 'rgb(90,90,90)' }}
                border="none"
                onClick={() => {
                  createProduct()
                }}
                disabled={uploading}
              >
                Create Product
              </Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreateProduct
