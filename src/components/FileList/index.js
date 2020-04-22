import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import useKeyPress from '../../hooks/useKeyPress';

const { remote } = window.require('electron');
const { Menu, MenuItem } = remote;

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState(null);
  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);
  const closeSearch = (editItem) => {
    setEditStatus(false);
    setValue('');

    if (editItem) {
      onFileDelete(editItem.id);
    }
  }

  useEffect(() => {
    const newFile = files.find(file => file.isNew);

    if (newFile) {
      setEditStatus(newFile.id);
      setValue(newFile.title);
    }
  }, [files]);

  useEffect(() => {
    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Open',
      click: () => { console.info('Opening'); },
    }));
    menu.append(new MenuItem({
      label: 'Rename',
      click: () => { console.info('Renaming'); },
    }));
    menu.append(new MenuItem({
      label: 'Delete',
      click: () => { console.info('Deleting'); },
    }));
    const handleContextMenu = (e) => {
      menu.popup({ window: remote.getCurrentWindow() });
    };
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  });

  useEffect(() => {
    const editItem = files.find(file => file.id === editStatus);

    if (enterPressed && editStatus && value.trim() !== '') {
      onSaveEdit(editItem.id, value, editItem.isNew);
      setEditStatus(false);
      setValue('');
    }
    if (escPressed && editStatus) {
      closeSearch(editItem);
    }
  });
  
  return <ul className="list-group list-group-flush file-list">
    {
      files.map(file => 
        <li
          key={file.id}
          className="row list-group-item bg-light d-flex align-items-center file-item mx-0"
        >
          {
            ((file.id !== editStatus) && !file.isNew) ?
            <>
              <span className="col-2">
                <FontAwesomeIcon
                  size="lg"
                  icon={faMarkdown}
                />
              </span>
              <span 
                className="col-6 c-link"
                onClick={() => { onFileClick(file.id) }}
              >
                {file.title}
              </span>
              <button
                type="button"
                className="icon-button col-2"
                onClick={() => {
                  setEditStatus(file.id);
                  setValue(file.title);
                }}
              >
                <FontAwesomeIcon
                  title="编辑"
                  size="lg"
                  icon={faEdit}
                />
              </button>
              <button
                type="button"
                className="icon-button col-2"
                onClick={() => { onFileDelete(file.id) }}
              >
                <FontAwesomeIcon
                  title="删除"
                  size="lg"
                  icon={faTrash}
                />
              </button>
            </> :
            <>
              <input
                className="form-control col-10"
                placeholder="请输入文件名称"
                value={ value }
                onChange={e => setValue(e.target.value)}
              />
              <button
                  type="button"
                  className="icon-button col-2"
                  onClick={() => { closeSearch(file) }}
              >
                <FontAwesomeIcon
                  title="关闭"
                  size="lg"
                  icon={faTimes}
                />
              </button>
            </>
          }
        </li>
      )
    }
  </ul>
}

FileList.propTypes = {
  files: PropTypes.array.isRequired,
  onFileClick: PropTypes.func,
  onFileDelete: PropTypes.func,
  onSaveEdit: PropTypes.func,
};

export default FileList
