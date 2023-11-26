import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/auth-context';
import backgroundImage from '../assets/img/dogs/image2.jpeg';

const RegForm = () => {
  const ctx = useContext(AuthContext);

  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPw, setEnteredPw] = useState('');
  const [enteredFName, setEnteredFName] = useState('');
  const [enteredLName, setEnteredLName] = useState('');
  const [enteredDob, setEnteredDob] = useState('');
  const [uploadedImg, setUploadedImg] = useState('');
  const [enteredNickname, setEnteredNickname] = useState('');
  const [enteredAbout, setEnteredAbout] = useState('');
  const [regErrMsg, setRegErrMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    ctx.regSuccess && navigate('/login', { replace: true });
  }, [ctx.regSuccess]);

  useEffect(() => {
    setRegErrMsg(ctx.errMsg);
    // navigate("/reg", { replace: true });
  }, [ctx.errMsg]);

  const emailChangeHandler = (e) => {
    setEnteredEmail(e.target.value);
    console.log(enteredEmail);
  };
  const pwChangeHandler = (e) => {
    setEnteredPw(e.target.value);
    console.log(enteredPw);
  };
  const fNameChangeHandler = (e) => {
    setEnteredFName(e.target.value);
    console.log(enteredFName);
  };
  const lNameChangeHandler = (e) => {
    setEnteredLName(e.target.value);
    console.log(enteredLName);
  };
  const dobChangeHandler = (e) => {
    setEnteredDob(e.target.value);
    console.log(enteredDob);
  };
  const avatarHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      console.log(reader.result);
      setUploadedImg(reader.result);
    });

    setUploadedImg(e.target.value);
    console.log(uploadedImg);
  };
  const nicknameChangeHandler = (e) => {
    setEnteredNickname(e.target.value);
    console.log(enteredNickname);
  };
  const aboutChangeHandler = (e) => {
    setEnteredAbout(e.target.value);
    console.log(enteredAbout);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const regPayloadObj = {
      email: enteredEmail,
      pw: enteredPw,
      fname: enteredFName,
      lname: enteredLName,
      Dob: enteredDob,
      avatar: uploadedImg,
      nname: enteredNickname,
      about: enteredAbout,
    };
    console.log(regPayloadObj);

    ctx.onReg(regPayloadObj);

    setEnteredEmail('');
    setEnteredPw('');
    setEnteredFName('');
    setEnteredLName('');
    setEnteredDob('');
    setUploadedImg('');
    setEnteredNickname('');
    setEnteredAbout('');
    // navigate("/login", {replace: true});

    ctx.setErrMsg('');
  };

  return (
    <div className="container-fluid" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="card shadow-lg o-hidden border-0 my-5">
          <div className="card-body p-0">
            <div className="row">
              <div className="col-lg-5 d-none d-lg-flex">
                <div className="flex-grow-1 bg-register-image" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
              </div>
              <div className="col-lg-7">
                <div className="p-5">
                  <div className="text-center">
                    <h4 className="text-dark mb-4">Create an Account!</h4>
                    <h2>{regErrMsg}</h2>
                  </div>
                  <form className="user" onSubmit={submitHandler}>
                    <div className="row mb-3">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          className="form-control form-control-user"
                          type="text"
                          id="exampleFirstName"
                          placeholder="First Name"
                          name="first_name"
                          value={enteredFName}
                          onChange={fNameChangeHandler}
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control form-control-user"
                          type="text"
                          id="exampleLastName"
                          placeholder="Last Name"
                          name="last_name"
                          value={enteredLName}
                          onChange={lNameChangeHandler}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <input
                        className="form-control form-control-user"
                        type="email"
                        id="exampleInputEmail"
                        aria-describedby="emailHelp"
                        placeholder="Email Address"
                        name="email"
                        value={enteredEmail}
                        onChange={emailChangeHandler}
                        required
                      />
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          className="form-control form-control-user"
                          type="password"
                          id="examplePasswordInput"
                          placeholder="Password"
                          name="password"
                          value={enteredPw}
                          onChange={pwChangeHandler}
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <input className="form-control form-control-user" type="password" placeholder="Repeat Password" />
                      </div>
                    </div>
                    <div style={{ margin: '10px', padding: '5px' }}>
                      <p>Date of Birth</p>
                      <input
                        className="border rounded-pill form-control"
                        type="date"
                        name="Dob"
                        value={enteredDob}
                        onChange={dobChangeHandler}
                        required
                      />
                    </div>
                    <div style={{ margin: '10px', padding: '5px' }}>
                      <p>Choose Avatar:</p>
                      <div className="text-center">
                        <img
                          className="rounded-circle img-fluid"
                          style={{ width: '150px', margin: '10px' }}
                          src={uploadedImg || require('../images/default_avatar.jpg')}
                          alt="Avatar Preview"
                        />
                      </div>
                      <input className="form-control" type="file" name="avatar" onChange={avatarHandler} />
                    </div>
                    <div style={{ margin: '10px', padding: '5px' }}>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Nick Name"
                        name="nname"
                        value={enteredNickname}
                        onChange={nicknameChangeHandler}
                      />
                    </div>
                    <div style={{ margin: '10px', padding: '5px' }}>
                      <textarea
                        className="form-control"
                        name="about"
                        placeholder="About me..."
                        value={enteredAbout}
                        onChange={aboutChangeHandler}
                      ></textarea>
                    </div>
                    <button className="btn btn-primary d-block btn-user w-100" type="submit">
                      Register Account
                    </button>
                    <hr />
                  </form>
                  <div className="text-center">
                    <Link to="/login" className="small">
                      Already have an account? Login!
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegForm;
