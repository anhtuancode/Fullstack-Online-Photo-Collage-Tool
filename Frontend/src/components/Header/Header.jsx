import "./Header.css";

function Header() {
  return (
    <nav class="navbar">
        <div class="navbar-container">
            <div class="navbar-brand">
                <span class="navbar-title">Online Photo Collage</span>
            </div>
            <div class="navbar-actions">
                <button class="contact-btn">Contact</button>
                <button class="signin-btn">Sign In</button>
            </div>
        </div>
    </nav>
  );
}

export default Header;
