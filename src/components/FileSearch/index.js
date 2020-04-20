import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import useKeyPress from '../../hooks/useKeyPress';

const FileSearch = ({ title, onFileSearch }) => {
  const [ inputActive, setInputActive ] = useState(false);
  const [value, setValue] = useState('');
  const inputEle = useRef(null);
  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);

  const closeSearch = () => {
    setInputActive(false);
    setValue('');
    onFileSearch('');
  }

  useEffect(() => {
    if (enterPressed && inputActive) {
      onFileSearch(value);
    }
    if (escPressed && inputActive) {
      closeSearch();
    }
  });

  useEffect(() => {
    if (inputActive) {
      inputEle.current.focus();
    }
  }, [inputActive]);

  return <div className="alert alert-primary mb-0">
    <div className="d-flex justify-content-between align-items-center">
      {
        inputActive ?
        <>
          <input
            className="form-control"
            ref={inputEle}
            value={ value }
            onChange={e => setValue(e.target.value)}
          />
          <button
              type="button"
              className="icon-button"
              onClick={closeSearch}
          >
            <FontAwesomeIcon
              title="关闭"
              size="lg"
              icon={faTimes}
            />
          </button>
        </> :
        <>
          <span
            style={{
              height: '38px',
              lineHeight: '38px',
            }}
          >
            {title}
          </span>
          <button
            type="button"
            className="icon-button"
            onClick={() => { setInputActive(true) }}
          >
            <FontAwesomeIcon
              title="搜索"
              size="lg"
              icon={faSearch}
            />
          </button>
        </>
      }
    </div>
  </div>;
}

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired,
};

FileSearch.defaultProps = {
  title: '我的云文档',
};

export default FileSearch;
