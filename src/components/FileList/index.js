import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import useKeyPress from '../../hooks/useKeyPress';
import useContextMenu from '../../hooks/useContextMenu';
import { getParentNode } from '../../utils/helper';

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

    if (!editItem.title) {
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

  const clickedItem = useContextMenu([
    {
      label: 'Open',
      click: () => {
        const parentElement = getParentNode(clickedItem.current, 'file-item');
        if (parentElement) {
          onFileClick(parentElement.dataset.id);
        }
      },
    },
    {
      label: 'Rename',
      click: () => {
        const parentElement = getParentNode(clickedItem.current, 'file-item');
        if (parentElement) {
          setEditStatus(parentElement.dataset.id);
          setValue(parentElement.dataset.title);
        }
      },
    },
    {
      label: 'Delete',
      click: () => {
        const parentElement = getParentNode(clickedItem.current, 'file-item');
        if (parentElement) {
          onFileDelete(parentElement.dataset.id);
        }
      },
    },
  ], '.file-list');

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
          data-id={file.id}
          data-title={file.title}
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
