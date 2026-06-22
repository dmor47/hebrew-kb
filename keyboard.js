(function () {
  var ID = 'heb-kb-overlay';
  var existing = document.getElementById(ID);
  if (existing) { existing.remove(); return; }

  var savedInput = document.activeElement;

  function insertChar(ch) {
    if (!savedInput || !savedInput.tagName.match(/INPUT|TEXTAREA/i)) return;
    savedInput.focus();
    if (!document.execCommand('insertText', false, ch)) {
      var s = savedInput.selectionStart != null ? savedInput.selectionStart : savedInput.value.length;
      savedInput.value = savedInput.value.slice(0, s) + ch + savedInput.value.slice(s);
      savedInput.selectionStart = savedInput.selectionEnd = s + ch.length;
      savedInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function deleteChar() {
    if (!savedInput || !savedInput.tagName.match(/INPUT|TEXTAREA/i)) return;
    savedInput.focus();
    if (!document.execCommand('delete')) {
      var s = savedInput.selectionStart;
      if (s > 0) {
        savedInput.value = savedInput.value.slice(0, s - 1) + savedInput.value.slice(s);
        savedInput.selectionStart = savedInput.selectionEnd = s - 1;
        savedInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  function submitForm() {
    if (!savedInput) return;
    savedInput.focus();
    var form = savedInput.closest('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    } else {
      savedInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      savedInput.dispatchEvent(new KeyboardEvent('keyup',  { key: 'Enter', keyCode: 13, bubbles: true }));
    }
  }

  var letters = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];
  var finals  = ['ך','ם','ן','ף','ץ'];

  var overlay = document.createElement('div');
  overlay.id = ID;
  overlay.style.cssText = [
    'position:fixed', 'bottom:0', 'left:0', 'right:0',
    'background:#1e1e1e', 'border-top:3px solid #444',
    'padding:10px 8px 14px', 'z-index:2147483647',
    'direction:rtl', 'font-family:Arial,sans-serif',
    'box-shadow:0 -4px 20px rgba(0,0,0,0.6)'
  ].join(';');

  function makeKey(label, action, bg, color, flex) {
    var b = document.createElement('button');
    b.textContent = label;
    b.style.cssText = [
      'background:' + (bg || '#3a3a3a'),
      'color:' + (color || '#fff'),
      'border:1px solid #555',
      'border-radius:7px',
      'font-size:20px',
      'padding:12px 6px',
      'min-width:42px',
      'cursor:pointer',
      'flex:' + (flex || '0 0 auto'),
      'font-family:Arial,sans-serif',
      'line-height:1'
    ].join(';');
    b.addEventListener('mousedown', function (e) { e.preventDefault(); });
    b.addEventListener('click', action);
    return b;
  }

  var closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = 'position:absolute;top:8px;left:8px;background:#555;color:#fff;border:none;border-radius:5px;padding:5px 10px;font-size:14px;cursor:pointer;';
  closeBtn.addEventListener('click', function () { overlay.remove(); });
  overlay.appendChild(closeBtn);

  var title = document.createElement('div');
  title.textContent = 'מקלדת עברית';
  title.style.cssText = 'font-size:12px;color:#888;text-align:center;margin-bottom:8px;';
  overlay.appendChild(title);

  // Letter rows
  var row1 = document.createElement('div');
  row1.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin-bottom:6px;justify-content:center;';
  letters.forEach(function (l) {
    row1.appendChild(makeKey(l, function () { insertChar(l); }));
  });
  overlay.appendChild(row1);

  // Finals + space + backspace
  var row2 = document.createElement('div');
  row2.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin-bottom:6px;justify-content:center;';
  finals.forEach(function (l) {
    row2.appendChild(makeKey(l, function () { insertChar(l); }, '#2e3a2e', '#aaddaa'));
  });
  row2.appendChild(makeKey('רווח', function () { insertChar(' '); }, '#333', '#aaa', '1 1 80px'));
  row2.appendChild(makeKey('⌫', deleteChar, '#5a2020', '#fff'));
  row2.appendChild(makeKey('⏎ חפש', submitForm, '#1a4a8a', '#fff', '0 0 auto'));
  overlay.appendChild(row2);

  document.body.appendChild(overlay);
})();
