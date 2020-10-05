const ejsdata = {};
ejsdata.user = {};

// Libraries
ejsdata.defaultLibs = `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="/css/icons.css" type="text/css" />
<link rel="stylesheet" href="/css/master.css" type="text/css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.1/socket.io.js" integrity="sha512-AcZyhRP/tbAEsXCCGlziPun5iFvcSUpEz2jKkx0blkYKbxU81F+iq8FURwPn1sYFeksJ+sDDrI5XujsqSobWdQ==" crossorigin="anonymous"></script>
`;

// User scripts
ejsdata.defaultScripts = `
<script src="/js/script.js"></script>
`;

module.exports = ejsdata;
