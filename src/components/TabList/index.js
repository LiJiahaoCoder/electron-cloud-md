import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './index.scss';

const TabList = ({ files, activeId, unsaveIds, onTabClick, onTabClose }) => {
  return <ul className="nav nav-pills tablist-component">
    {
      files.map(file => {
        const withUnsavedMark = unsaveIds.includes(file.id);
        const className = classNames({
          'nav-link': true,
          'active': file.id === activeId,
          'unsaved': withUnsavedMark,
        });
        
        return <li
          key={file.id}
          className="nav-item"
        >
          <a
            href="#"
            className={className}
            onClick={e => {
              e.preventDefault();
              onTabClick(file.id);
            }}
          >
            {file.title}
            <span
              className="ml-2 close-icon"
              onClick={e => {
                e.stopPropagation();
                onTabClose(file.id);
              }}
            >
              <FontAwesomeIcon icon={faTimes}/>
            </span>
            { withUnsavedMark && <span className="rounded-circle ml-2 unsaved-icon"></span> }
          </a>
        </li>
      }
      )
    }
  </ul>
};

TabList.propTypes = {
  files: PropTypes.array,
  activeId: PropTypes.string,
  unsaveIds: PropTypes.array,
  onTabClick: PropTypes.func,
  onTabClose: PropTypes.func,
};

TabList.defaultProps = {
  unsaveIds: [],
};

export default TabList;
