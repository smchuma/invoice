export function printElement(elementId: string, title = 'Invoice') {
  const el = document.getElementById(elementId);
  if (!el) return;

  const win = window.open('', '_blank', 'width=900,height=750');
  if (!win) return;

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media print {
      @page { margin: 0; }
      body { margin: 0; }
    }
  </style>
</head>
<body>
  ${el.innerHTML}
  <script>
    // Wait for fonts to load then print
    document.fonts.ready.then(function () {
      setTimeout(function () {
        window.print();
        setTimeout(function () { window.close(); }, 500);
      }, 300);
    });
  </script>
</body>
</html>`);

  win.document.close();
}
