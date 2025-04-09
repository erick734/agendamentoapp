export default function Footer() {
    return (
        <footer
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                backgroundColor: "#343a40",
                color: "#ffffff",
                textAlign: "center",
                padding: "10px 0",

            }}
        >
            <p className="mb-0">
                &copy; {new Date().getFullYear()} Erick da Silva. Todos os direitos reservados
            </p>
        </footer>
    );
}
