export default function Footer() {
    return (
        <footer
            style={{
                width: "100%",
                backgroundColor: "#f8f9fa",
                color: "#6c757d",
                textAlign: "center",
                padding: "1rem 0",
                borderTop: "1px solid #dee2e6",
                marginTop: "auto"
            }}
        >
            <p className="mb-0">
                &copy; {new Date().getFullYear()} Erick da Silva. Todos os direitos reservados
            </p>
        </footer>
    );
}