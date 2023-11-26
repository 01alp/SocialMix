import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../modules/Avatar';

function CreateComment(props) {
  const userId = +localStorage.getItem('user_id');
  const first = localStorage.getItem('fname');
  const last = localStorage.getItem('lname');
  const nickname = localStorage.getItem('nname');
  const avatar = localStorage.getItem('avatar');

  const [uploadedCommentImg, setUploadedCommentImg] = useState('');
  const commentInput = useRef();
  // const [commentMsg, setCommentMsg] = useState("");

  function SubmitHandler(event) {
    event.preventDefault();

    const enteredContent = commentInput.current.value;

    const commentData = {
      postId: props.pid,
      userId: userId, // author
      message: enteredContent,
      image: uploadedCommentImg,
    };

    console.log('create comment: ', commentData);

    props.onCreateComment(commentData);

    commentInput.current.value = '';
    setUploadedCommentImg('');
  }

  const CommentImgUploadHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      console.log('comment img', reader.result);
      setUploadedCommentImg(reader.result);
    });
  };

  return (
    <div
      className="makeComment"
      style={{
        padding: 5,
        boxShadow: '3px 3px 5px 5px var(--bs-body-color)',
      }}
    >
      <form style={{ padding: 5 }} onSubmit={SubmitHandler}>
        <div className="d-flex justify-content-between createPostAuthorDiv" style={{ margin: 5 }}>
          <div className="d-flex align-items-lg-center UserDiv" id="userDiv-1">
            <Link className="link-up" to={`/profile/${userId}`}>
              <div id="commentUserDiv-1" className="postUser">
                <div className="d-flex align-items-center">
                  <Avatar id={userId} src={avatar} showStatus={false} alt="" width={'40px'} />
                  <span style={{ marginLeft: '5px' }}>{`${first} ${last}`}</span>
                </div>
              </div>
            </Link>
          </div>
          <span>123</span>
        </div>
        <input
          className="form-control commentContentCreation"
          type="text"
          style={{ margin: 5 }}
          placeholder="Comment min3-max200"
          ref={commentInput}
        />
        <div>
          {/* Start: image */}
          {!uploadedCommentImg && (
            <input
              className="form-control"
              type="file"
              name={`comment-image-${props.pid}`}
              id={`comment-image-${props.pid}`}
              accept=".jpg, .jpeg, .png, .gif"
              onChange={CommentImgUploadHandler}
              style={{ margin: 5 }}
            />
          )}
          {uploadedCommentImg && <img src={uploadedCommentImg} width={'80px'} />}
          {/* End: Image Upload */}
        </div>
        <button className="btn btn-primary" type="submit" style={{ margin: 5 }}>
          Submit
          <i className="far fa-paper-plane" style={{ marginLeft: 5 }} />
        </button>
      </form>
    </div>
  );
}

export default CreateComment;
