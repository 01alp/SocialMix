import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../modules/Avatar';

function Comment(props) {
  let created;

  // Custom function to parse and format the date
  function formatDate(dateString) {
    const parts = dateString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
    if (parts) {
      return `${parts[1]}-${parts[2]}-${parts[3]} ${parts[4]}:${parts[5]}`;
    } else {
      return 'Date not available';
    }
  }

  created = formatDate(props.createdAt);

  console.log('created:', created);
  console.log('props.createdAt:', props.createdAt);

  return (
    <div className="commenting" style={{ margin: '25px', boxShadow: '3px 3px 5px 5px var(--bs-body-color)', padding: '15px' }}>
      <div className="d-flex justify-content-between align-items-lg-center">
        <div className="d-flex align-items-lg-center">
          <div>
            <Link to={`/profile/${props.authorId}`}>
              <Avatar id={props.authorId} src={props.avatar} alt="" showStatus={true} width={'32px'} />
            </Link>
          </div>
          <div className="commentUser">
            <Link to={`/profile/${props.authorId}`}>
              <div>{`${props.fname} ${props.lname}`}</div>
            </Link>
          </div>
        </div>
        <div className="text-end commentDate">
          <span>{created}</span>
        </div>
      </div>
      <div className="commentContent" style={{ margin: '5px' }}>
        <span>{props.message}</span>
      </div>
      {props.image && (
        <div className="d-flex justify-content-center">
          <img src={props.image} alt="" width={'100px'} />
        </div>
      )}
    </div>
  );
}

export default Comment;
