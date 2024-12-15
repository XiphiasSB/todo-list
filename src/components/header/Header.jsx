import crown from '../../assets/crown.png'
import './Header.css'

export function Header() {
  return (
    <header>
      <img src={crown} alt="Princess crown" className="crown-logo" />
      <h1 className="header-title">The Princess To-Do List</h1>
    </header>
  )
}
