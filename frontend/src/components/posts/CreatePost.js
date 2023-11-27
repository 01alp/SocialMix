import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../modules/Avatar';

function CreatePost(props) {
  const contentInput = useRef();
  const privacyInputRef = useRef();

  const userId = +localStorage.getItem('user_id');
  const first = localStorage.getItem('fname');
  const last = localStorage.getItem('lname');
  const nickname = localStorage.getItem('nname');
  const avatar = localStorage.getItem('avatar');

  const [uploadedImg, setUploadedImg] = useState('');

  function SubmitHandler(event) {
    event.preventDefault();

    const enteredContent = contentInput.current.value;
    const chosenPrivacy = +privacyInputRef.current.value;

    const postData = {
      author: userId,
      message: enteredContent,
      image: uploadedImg,
      privacy: chosenPrivacy,
    };

    console.log('create post data', postData);

    props.onCreatePost(postData);

    contentInput.current.value = '';
    privacyInputRef.current.value = 0;
    setUploadedImg('');
  }
  const imgUploadHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      console.log(reader.result);
      setUploadedImg(reader.result);
    });
  };

  //   const privacyOptions = [
  //     { value: 0, text: 'Public Post' },
  //     { value: 1, text: `Private Post` },
  //     { value: 2, text: 'Close Friends' },
  //   ];

  return (
    <div>
      {/* Start: makePostDiv */}
      <div
        className="makePost"
        style={{
          boxShadow: '3px 3px 5px 5px var(--bs-body-color)',
          padding: 5,
        }}
      >
        {/* Start: Create post form */}
        <form style={{ padding: 5 }} onSubmit={SubmitHandler}>
          {/* Start: createPostAuthorDiv */}
          <div className="d-flex justify-content-between createPostAuthorDiv" style={{ margin: 5 }}>
            <div className="d-flex align-items-lg-center UserDiv" id="userDiv-1">
              <Link className="link-up" to={`/profile/${userId}`}>
                <div id="postUserDiv-1" className="postUser">
                  <div className="d-flex align-items-center">
                    <Avatar id={userId} src={avatar} showStatus={false} alt="" width={'40px'} />
                    <span style={{ marginLeft: '5px' }}>{`${first} ${last}`}</span>
                  </div>
                </div>
              </Link>
            </div>
            <span>123</span>
          </div>
          {/* End: createPostAuthorDiv */}
          {/* Start: Select private */}
          <div>
            <select className="form-select dropdown" style={{ margin: 5 }} defaultValue="0" ref={privacyInputRef}>
              <optgroup label="This is a group">
                <option value="0">Public 🟢</option>
                <option value="2">OnlyFans 🔓</option>
                <option value="1">Private 🔐</option>
              </optgroup>
            </select>
          </div>
          {/* End: Select private */}
          {/* Start: create post text */}
          <div>
            <textarea
              className="form-control postContentCreation"
              placeholder="Content min3-max200"
              style={{ margin: 5 }}
              required=""
              minLength={3}
              maxLength={200}
              rows={3}
              data-bs-theme="light"
              defaultValue={''}
              ref={contentInput}
            />
          </div>
          {/* End: create post text */}
          {/* Start: adImage */}
          <div className="d-flex d-lg-flex flex-column justify-content-between" style={{ margin: 5 }}>
            {/* Start: imagePoster */}
            <div>
              {/* Start: image */}
              {uploadedImg && <img src={uploadedImg} width={'80px'} />}
              <input
                className="form-control"
                type="file"
                name="image"
                accept="image/*"
                required=""
                style={{ margin: 5 }}
                onChange={imgUploadHandler}
              />
              {/* End: image */}
            </div>
            {/* End: imagePoster */}
          </div>
          {/* End: adImage */}
          <button className="btn btn-primary" type="submit" style={{ margin: 5 }}>
            Submit
            <i className="far fa-paper-plane" style={{ marginLeft: 5 }} />
          </button>
        </form>
        {/* End: Create post form */}
      </div>
      {/* End: makePostDiv */}
    </div>
  );
}

export default CreatePost;
