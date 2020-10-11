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

ejsdata.editorLibs = `
<link rel="stylesheet" href="/css/editor.css" />
<!-- X-Term.js -->
<link rel="stylesheet" href="/node_modules/xterm/css/xterm.css" />
<script src="/node_modules/xterm/lib/xterm.js"></script>
<script src="/node_modules/xterm-addon-fit/lib/xterm-addon-fit.js"></script>

<!-- Monaco Editor -->
<script src="/monaco-editor/vs/loader.js"></script>
`;

// User scripts
ejsdata.defaultScripts = `
<script src="/js/script.js"></script>
`;

module.exports = ejsdata;
