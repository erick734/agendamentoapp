import { Link } from "react-router-dom"
import style from "./HeaderLink.module.css"

export default function HeaderLink({url, children}) {
    return (
        <Link to={url} className={style.link} >
            {children}
        </Link>
    )
}