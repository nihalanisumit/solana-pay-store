// Constants
const TWITTER_HANDLE = 'nihalanisumit'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

function Footer() {
  return (
    <div className="footer-container">
      <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
      <a
        className="footer-text"
        href={TWITTER_LINK}
        target="_blank"
        rel="noreferrer"
      >{`built by @${TWITTER_HANDLE}`}</a>
    </div>
  )
}

export default Footer
