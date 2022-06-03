import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import products from './products.json'

const sellerAddress = '4p18VmWNKaeLkhAQUXUYf5kpuh77n4kf73WKvhWZ6DXZ'
const sellerPublicKey = new PublicKey(sellerAddress)

const createTransaction = async (req, res) => {
  try {
    // Extract the transaction data from the request body
    const { buyer, orderID, itemID } = req.body

    // If we don't have something we need, stop!
    if (!buyer) {
      return res.status(400).json({
        message: 'Missing buyer address',
      })
    }

    if (!orderID) {
      return res.status(400).json({
        message: 'Missing order ID',
      })
    }

    // Fetch item price from products.json using itemID
    const itemPrice = products.find((item) => item.id === itemID).price

    if (!itemPrice) {
      return res.status(404).json({
        message: 'Item not found. please check item ID',
      })
    }

    // Convert our price to the correct format
    const bigAmount = BigNumber(itemPrice)
    const buyerPublicKey = new PublicKey(buyer)
    const network = WalletAdapterNetwork.Devnet
    const endpoint = clusterApiUrl(network)
    const connection = new Connection(endpoint)

    const { blockhash } = await connection.getLatestBlockhash('finalized')

    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    })

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: buyerPublicKey,
      lamports: bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
      toPubkey: sellerPublicKey,
    })

    transferInstruction.keys.push({
      pubkey: new PublicKey(orderID),
      isSigner: false,
      isWritable: false,
    })

    tx.add(transferInstruction)

    // Formatting our transaction
    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    })
    const base64 = serializedTransaction.toString('base64')

    res.status(200).json({
      transaction: base64,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({ error: 'error creating tx' })
    return
  }
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    createTransaction(req, res)
  } else {
    res.status(405).end()
  }
}
