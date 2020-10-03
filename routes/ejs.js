const ejsdata = {};

ejsdata.navbar = `
<header class = "navbar">
  <span class = "navbar-title">
    <a href="/">ClearCode<span class = "domain">.tk</span></a>
  </span>
  
  <nav class = "nav-items">
    <a href = "#" class = "nav-item">Home</a>
    <a href = "#" class = "nav-item">About</a>
    <a href = "#" class = "nav-item">Resources</a>
    <a href = "#" class = "nav-item">Profile</a>
  </nav>
</header>
`;

ejsdata.mobilelinks = `
<section id="mobile-links">
  <a href="/home">home</a>
  <a href="/downloads">Downloads</a>
  <a href="/faq">FAQ</a>
  <a href="/resources">Resources</a>
</section>
`;

module.exports = ejsdata;
