import './Header.scss'
import desktopLogo from '../assets/images/connect-desktop-header-bi.svg'
import mobileLogo from '../assets/images/connect-bi-primary-high.png'

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <img src={desktopLogo} alt="CONNECT" className="logo-desktop" />
          <img src={mobileLogo} alt="CONNECT" className="logo-mobile" />
        </div>
      </div>
    </header>
  )
}

