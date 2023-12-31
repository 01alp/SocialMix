import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AllComments from './comments/AllComments';
import CreateComment from './comments/CreateComment';
import Avatar from '../modules/Avatar';

function Post(props) {
  //console.log(props);
  const [showComments, setShowComments] = useState(false);
  const [postPrivacy, setPostPrivacy] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (props != undefined) {
      setPostPrivacy(props.postPrivacy);
    }
  }, [props]);

  console.log('comment for post: ', props.postNum, ' comments: ', props.commentsForThisPost);
  // const onlineStatus = false;
  const postCommentUrl = 'http://localhost:8080/post-comment';

  const showCommentsHandler = useCallback(() => {
    console.log(showComments);
    // !showComments && setShowComments(true);
    // showComments && setShowComments(false);
    setShowComments((prevShowComments) => !prevShowComments);
  }, []);

  const createCommentHandler = (createCommentPayloadObj) => {
    console.log('create comment for Post', createCommentPayloadObj);

    const reqOptions = {
      method: 'POST',
      body: JSON.stringify(createCommentPayloadObj),
    };
    fetch(postCommentUrl, reqOptions)
      .then((resp) => resp.json())
      .then((data) => {
        props.onCreateCommentSuccessful(data.success);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleClick(e) {
    const id = e.target.id;

    console.log('id: ', id);
    navigate('/profile', { state: { id } });
  }

  // Check if `props.createdAt` is a valid date
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

  created = formatDate(props.createdat);

  console.log('created:', created);
  console.log('props.createdAt:', props.createdat);
  let privacy;
  switch (props.privacy) {
    case 1:
      privacy = <span style={{ fontSize: 23 }}> 🔐Prv.</span>;
      break;
    case 2:
      privacy = <span style={{ fontSize: 23 }}>🔓Fans</span>;
      break;
    default:
      privacy = <span style={{ fontSize: 23 }}>🟢Pub.</span>;
      break;
  }

  return (
    <div className="posts" style={{ margin: 5, marginTop: 5 }}>
      {/* Start: postDiv */}
      <div
        className="d-flex flex-column post"
        id="postDiv"
        style={{
          margin: 5,
          marginTop: 10,
          boxShadow: '3px 3px 5px 5px var(--bs-body-color)',
          padding: 5,
        }}
      >
        {/* Start: PostAuthor line */}
        <div className="d-flex justify-content-between postDateUser" style={{ margin: 5 }}>
          <div className="d-flex align-items-lg-center UserDiv">
            <div>
              <Link to={`/profile/${props.authorId}`}>
                <Avatar id={props.authorId} src={props.avatar} alt="" showStatus={false} width={'50px'} />
              </Link>
            </div>
            <div>
              <Link to={`/profile/${props.authorId}`}>
                <div>{`${props.fname} ${props.lname}`}</div>
              </Link>
            </div>
          </div>
          <div>
            <div className="d-lg-flex align-items-lg-center">{privacy}</div>
          </div>
          <div>
            <span>{created}</span>
          </div>
        </div>
        {/* End: PostAuthor line */}
        {/* Start: postContentwrapper */}
        <div className="postContent" style={{ margin: 5 }}>
          {/* Start: postContent */}
          <div>{props.message}</div>
          {/* End: postContent */}
          {/* Start: image */}
          <div style={{ textAlign: 'center' }}>
            {props.image && (
              <div>
                <img src={props.image} alt="" className="img-fluid" style={{ width: 100, margin: 'auto' }} />
              </div>
            )}
          </div>
          {/* End: image */}
          {/* Start: comments */}
          <div style={{ textAlign: 'right' }}>
            <button className="btn btn-primary" type="button" style={{ margin: 5, width: 150 }} onClick={showCommentsHandler}>
              {props.commentsForThisPost.length} comments
            </button>
          </div>
          {showComments && (
            <>
              <AllComments comments={props.commentsForThisPost} />
              <CreateComment pid={props.id} onCreateComment={createCommentHandler} />
            </>
          )}
          {/* End: comments */}
        </div>
        {/* End: postContentwrapper */}
      </div>
      {/* End: postDiv */}
    </div>
  );
}

export default Post;
