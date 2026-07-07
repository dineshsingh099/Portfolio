export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo">
          DS<span>.</span>
        </div>
        <p>
          Designed & Built by <strong>Dinesh Singh</strong> &copy; {new Date().getFullYear()}
        </p>
        <nav className="footer-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
