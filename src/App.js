import React, { useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import { faPlus, faFileImport, faSave } from '@fortawesome/free-solid-svg-icons';
import uuid from 'uuid/v4';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import BottomButton from './components/BottomButton';
import TabList from './components/TabList';
import { flattenArr, obj2Arr } from './utils/helper';
import fileHelper from './utils/fileHelper';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'easymde/dist/easymde.min.css';
import './App.css';

// require node.js modules
const { join } = window.require('path');
const { remote } = window.require('electron');
const Store = window.require('electron-store');

const fileStore = new Store({'name': 'Files Data'});
const saveFilesToStore = (files) => {
  const filesStoreObj = obj2Arr(files).reduce((acc, cur)=> {
    const { id, path, title, createdAt } = cur;
    acc[id] = {
      id,
      path,
      title,
      createdAt,
    };

    return acc;
  }, {});

  fileStore.set('files', filesStoreObj);
};

function App() {
  const [files, setFiles] = useState(fileStore.get('files') || {});
  const [searchedFiles, setSearchedFiles] = useState([]);
  const [activeFileID, setActiveFileID] = useState('');
  const [openedFileIDs, setOpenedFileIDs] = useState([]);
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([]);
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID];
  });
  const activeFile = files[activeFileID];
  const filesArr = obj2Arr(files);
  const savedLocation = remote.app.getPath('documents');

  const fileSearch = (keywords) => {
    const newFiles = filesArr.filter(file => file.title.includes(keywords));

    setSearchedFiles(newFiles);
  };
  const fileClick = (fileID) => {
    setActiveFileID(fileID);
    const currentFile = files[fileID];
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then(value => {
        const newFile = { ...files[fileID], body: value, isLoaded: true };
        setFiles({ ...files, [fileID]: newFile });
      });
    }
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID]);
    }
  };
  const tabClick = (fileID) => {
    setActiveFileID(fileID);
  };
  const tabClose = (fileID) => {
    const leftFileIDs = openedFileIDs.filter(id => fileID !== id);
    setOpenedFileIDs(leftFileIDs);
    setActiveFileID(leftFileIDs[0] || '');
  };
  const fileChange = (fileID, value) => {
    const newFile = { ...files[fileID], body
    : value };
    setFiles({ ...files, [fileID]: newFile });

    if (!unsavedFileIDs.includes(fileID)) {
      setUnsavedFileIDs([...unsavedFileIDs, fileID]);
    }
  };
  const deleteFile = (fileID) => {
    const { [fileID]: value, ...restFiles } = files;
    if (files[fileID].isNew) {
      setFiles(restFiles);
    } else {
      fileHelper.deleteFile(files[fileID].path).then(() => {
        setFiles(restFiles);
        saveFilesToStore(restFiles);
        tabClose(fileID);
      });
    }
  };
  const updateFilename = (fileID, title, isNew) => {
    const newPath = join(savedLocation, `${title}.md`);
    const modifiedFile = { ...files[fileID], title, isNew: false, path: newPath };
    const newFiles = { ...files, [fileID]: modifiedFile };

    if (isNew) {
      fileHelper.writeFile(newPath, files[fileID].body).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    } else {
      const originPath = join(savedLocation, `${files[fileID].title}.md`);
      fileHelper.renameFile(originPath, newPath).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    }
    
  };
  const createFile = () => {
    const newID = uuid();
    setFiles({
      ...files,
      [newID]: {
        id: newID,
        title: '',
        body: '## 请输入 Markdown',
        createdAt: new Date().getTime(),
        isNew: true,
      }
    });
  };
  const saveCurrenFile = () => {
    fileHelper.writeFile(join(savedLocation, `${activeFile.title}.md`), activeFile.body).then(() => {
      setUnsavedFileIDs(unsavedFileIDs.filter(id => id !== activeFile.id));
    });
  };
  const importFiles = () => {
    remote.dialog.showOpenDialog({
      title: '选择导入的 Markdown 文件',
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Markdown files', extensions: ['md'] },
      ],
    }).then(res => {
      console.info(res.filePaths);
    });
  };

  const filesListArr = searchedFiles.length > 0 ? searchedFiles : filesArr;

  return (
    <div className="App contianer-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch
            title='我的云文档'
            onFileSearch={ fileSearch }
          />
          <FileList
            files={ filesListArr }
            onFileClick={ fileClick }
            onFileDelete={ deleteFile }
            onSaveEdit={ updateFilename }
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomButton
                text="新建"
                colorClass="btn-primary"
                icon={ faPlus }
                onBtnClick={ createFile }
              />
            </div>
            <div className="col">
              <BottomButton
                text="导入"
                colorClass="btn-success"
                icon={ faFileImport }
                onBtnClick={ importFiles }
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
        {
          !activeFile ?
          <div className="start-page">
            选择或者创建新的 Markdown 文档
          </div> :
          <>
            <TabList
              files={ openedFiles }
              activeId={ activeFileID }
              unsaveIds={ unsavedFileIDs }
              onTabClick={ tabClick }
              onTabClose={ tabClose }
            />
            <SimpleMDE
              key={ activeFile && activeFile.id }
              value={ activeFile && activeFile.body }
              onChange={ (value) => fileChange(activeFile.id, value) }
              options={{
                minHeight: '800px'
              }}
            />
            <BottomButton
              text="保存"
              colorClass="btn-success"
              icon={ faSave }
              onBtnClick={ saveCurrenFile }
            />
          </>
        }
        </div>
      </div>
    </div>
  );
}

export default App;
