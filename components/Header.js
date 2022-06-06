import { Stack, Button, Tooltip, Flex, Box, Link as ChakraLink, Text } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { toast } from 'react-hot-toast'
import PropTypes from 'prop-types'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import { rem, shortenAddress } from '../lib/util'
import { isUndefined } from 'lodash'
import { useRouter } from 'next/router'

function ConnectWallet({ connectWallet }) {
  const handleOpenInPhantom = useCallback(() => {
    window.location = 'itms-apps://apps.apple.com/us/app/phantom-solana-wallet/1598432977'
  }, [])

  const { wallets } = useWallet()

  const phantomWallet = first(wallets)
  const isPhantomWalletInstalled = phantomWallet.adapter.readyState === WalletReadyState.Installed

  const showOpenInPhantom = isIOS && !isPhantomWalletInstalled

  const text = showOpenInPhantom ? 'open in phantom' : 'connect wallet'
  const onClick = showOpenInPhantom ? handleOpenInPhantom : connectWallet

  return (
    <Button variant="primary" onClick={onClick} data-test="btn-connect-wallet">
      {text}
    </Button>
  )
}
ConnectWallet.propTypes = {
  connectWallet: PropTypes.func.isRequired,
}

function Auth(props) {
  const wallet = useWallet()
  //   const { setVisible: setShowWalletModal } = useWalletModal()

  //   const connectWallet = useCallback(() => setShowWalletModal(true), [setShowWalletModal])
  const disconnectWallet = useCallback(() => {
    if (!wallet.connected) {
      return
    }

    wallet
      .disconnect()
      .then(() => {
        toast.success('wallet disconnected.')
      })
      .catch(() => {})
  }, [wallet])

  return (
    <AnimatePresence exitBeforeEnter>
      <Stack isInline justify="flex-end" align="center" {...props}>
        {!wallet.connected ? (
          <div className="button-container">
            <WalletMultiButton className="cta-button connect-wallet-button" />
          </div>
        ) : (
          <div className="button-container">
            <button className="cta-button connect-wallet-button" onClick={disconnectWallet}>
              disconnect{' '}
            </button>
          </div>
        )}
      </Stack>
    </AnimatePresence>
  )
}

function Header({ creating, setCreating, ...props }) {
  const router = useRouter()
  const { publicKey } = useWallet()

  const isOwner = publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false

  function navigate(e) {
    e.preventDefault()
    // Don't push another page if already on homepage
    if (!isUndefined(router.query.slug)) {
      router.push('/', undefined, { shallow: true })
    }
  }

  return (
    <Box
      pt={{ base: 5, lg: 8 }}
      pb={{ base: 5, lg: 10 }}
      px={{ base: 4, lg: '8vw', xl: '12vw', '2xl': '15vw', '3xl': '20vw' }}
      {...props}
      data-test="cryptoisreal"
    >
      <Stack direction="row" align="center" justify="flex-end" spacing={8}>
        {isOwner && (
          <Button color="white" bg="none" border="none" fontSize={rem(18)} onClick={() => setCreating(!creating)}>
            {creating ? 'Close' : 'Create Product'}
          </Button>
        )}

        <Auth flexBasis={{ md: rem(220) }} />
      </Stack>
    </Box>
  )
}

export default Header
