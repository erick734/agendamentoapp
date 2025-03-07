import style from "./HeaderLink.module.css"

export default function HeaderLink({url, children}) {
    return (
        <a href={url} className={style.link} >
            {children}
        </a>
    )
}