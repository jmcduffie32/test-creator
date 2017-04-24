const {ipcRenderer} = require('electron');

document.documentElement.addEventListener('click', (e) => {

  var rightArrowParents = [],
      elm,
      entry;

  for (elm = e.target; elm; elm = elm.parentNode) {
    entry = elm.tagName.toLowerCase();
    if (entry === "html") {
      break;
    }
    if (elm.className) {
      entry += "." + elm.className.replace(/ /g, '.');
    }
    rightArrowParents.push(entry);
  }
  const path = rightArrowParents.reverse().join(' ').replace(/\.ng[-\w]+/g, '');

  ipcRenderer.send('test', path);
});
