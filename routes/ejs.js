const ejsdata = {};

ejsdata.navbar = `
<header class = "navbar">
  <span class = "navbar-title">
    <a href="/">ClearCode<span class = "domain">.tk</span></a>
  </span>
  
  <nav class = "nav-items">
    <a href="#" class="nav-item">Home</a>
    <a href="#" class="nav-item">About</a>
    <a href="#" class="nav-item">Resources</a>
    <a href="/signup" class="signin-btn nav-item">Sign Up/In</a>
  </nav>
  <a class="nav-burger"><i class="material-icons">menu</i></a>
</header>
`;

ejsdata.mobilelinks = `
<section id="mobile-links">
  <a href="/">Home</a>
  <a href="#">About</a>
  <a href="#">Resources</a>
  <a href="/signup" class="signin-btn">Sign Up/In</a>
</section>
`;

ejsdata.defaultLibs = `
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <link rel="stylesheet" href="/css/icons.css" type="text/css" />
 <link rel="stylesheet" href="/css/master.css" type="text/css" />
`;

ejsdata.defaultScripts = `
<script src="/js/script.js"></script>
`;

module.exports = ejsdata;
