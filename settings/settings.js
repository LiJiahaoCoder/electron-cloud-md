const { remote } = require('electron');
const Store = require('electron-store');

const settingsStore = new Store({ name: 'Settings' });

const $ = (id) => {
  return document.getElementById(id);
};

document.addEventListener('DOMContentLoaded', () => {
  let savedLocation = settingsStore.get('savedFileLocation');
  if (savedLocation) {
    $('save-file-location').value = savedLocation;
  }

  $('select-new-location').addEventListener('click', () => {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
      message: 'Select the path to store files',
    }).then(res => {
      if (!res.canceled) {
        $('save-file-location').value = savedLocation =  res.filePaths[0];
      }
    });
  });

  $('settings-form').addEventListener('submit', () => {
    settingsStore.set('savedFileLocation', savedLocation);
    remote.getCurrentWindow().close();
  });
});
