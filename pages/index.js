import React, { useState, useEffect } from 'react'
import CreateProduct from '../components/CreateProduct'
import Product from '../components/Product'
import HeadComponent from '../components/Head'
import { toast } from 'react-hot-toast'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { shortenAddress } from '../lib/util'
import Header from '../components/Header'
import Footer from '../components/footer'

const App = () => {
  const { publicKey } = useWallet()

  const [products, setProducts] = useState([])
  const [creating, setCreating] = useState(false)

  function NotConnectedContainer() {
    return (
      <div>
        <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />

        <div className="button-container">
          <WalletMultiButton className="cta-button connect-wallet-button" />
        </div>
      </div>
    )
  }
  function ItemBuyContainer() {
    return (
      <div className="products-container">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    )
  }

  useEffect(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58()

      toast.success(`connected to wallet: ${shortenAddress({ address: base58 })}`)
    }
  }, [publicKey])

  useEffect(() => {
    if (publicKey) {
      fetch(`/api/fetchProducts`)
        .then((response) => response.json())
        .then((data) => {
          setProducts(data)
          console.log('Products', data)
        })
    }
  }, [publicKey])

  return (
    <div className="App">
      <HeadComponent />
      <Header creating={creating} setCreating={setCreating} />
      <div className="container">
        <header className="header-container">
          <p className="header"> 😳 Solana Emoji Store 😈</p>
          <p className="sub-text">Purchase emoji packs using USDC</p>
        </header>

        {creating ? <CreateProduct /> : publicKey ? <ItemBuyContainer /> : <NotConnectedContainer />}
      </div>
      <Footer />
    </div>
  )
}

export default App
