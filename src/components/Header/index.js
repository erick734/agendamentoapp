import DeslogaBotao from '../../pages/Logout'
import HeaderLink from '../HeaderLink'
import style from './header.module.css'

export default function Header() {
    return (
        <header className={`${style.header} bg-dark`}>
            <nav>
                <DeslogaBotao>
                    
                </DeslogaBotao>
            </nav>
        </header>
    )
}