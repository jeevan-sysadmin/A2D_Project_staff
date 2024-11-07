import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { auth, googleProvider, db, storage } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Signin.css';

class ModernLoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignUp: false,
      email: '',
      password: '',
      name: '',
      resetEmail: '',
      showResetForm: false,
      profilePic: null, // state for profile picture
    };
  }

  toggleForm = () => {
    this.setState((prevState) => ({
      isSignUp: !prevState.isSignUp,
    }));
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (e) => {
    this.setState({ profilePic: e.target.files[0] });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name, profilePic, isSignUp } = this.state;

    if (isSignUp) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        let profilePicUrl = '';

        if (profilePic) {
          const profilePicRef = ref(storage, `profilePics/${user.uid}`);
          await uploadBytes(profilePicRef, profilePic);
          profilePicUrl = await getDownloadURL(profilePicRef);
        }

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          profilePic: profilePicUrl,
          createdAt: new Date().toISOString(),
        });

        // alert("Account created successfully with profile picture!");
        window.location.href = '/home';
      } catch (error) {
        console.error("Error during sign up: ", error.message);
        alert("Error during sign up");
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // alert("Logged in successfully!");
        window.location.href = '/home';
      } catch (error) {
        console.error("Error during sign in: ", error.message);
        alert("Error during sign in");
      }
    }
  };

  handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
          createdAt: new Date().toISOString(),
        });
      }

      // alert("Google login successful!");
      window.location.href = '/home';
    } catch (error) {
      console.error("Error with Google login: ", error.message);
      alert("Error with Google login");
    }
  };

  handleForgotPassword = async (e) => {
    e.preventDefault();
    const { resetEmail } = this.state;
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Password reset email sent!');
      this.setState({ showResetForm: false });
    } catch (error) {
      console.error('Error during password reset: ', error.message);
      alert('Error during password reset');
    }
  };

  componentDidMount() {
    this.registerButton = document.getElementById('register');
    this.loginButton = document.getElementById('login');

    if (this.registerButton && this.loginButton) {
      this.registerButton.addEventListener('click', this.handleRegisterClick);
      this.loginButton.addEventListener('click', this.handleLoginClick);
    }
  }

  componentWillUnmount() {
    if (this.registerButton && this.loginButton) {
      this.registerButton.removeEventListener('click', this.handleRegisterClick);
      this.loginButton.removeEventListener('click', this.handleLoginClick);
    }
  }

  handleRegisterClick = () => {
    this.container.classList.add("active");
  };

  handleLoginClick = () => {
    this.container.classList.remove("active");
  };

  render() {
    const { isSignUp, email, password, name, showResetForm, resetEmail } = this.state;

    return (
      <div className="container" ref={(ref) => (this.container = ref)}>
        <div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
          {showResetForm ? (
            <form onSubmit={this.handleForgotPassword}>
              <h1>Reset Password</h1>
              <input
                type="email"
                placeholder="Enter your email"
                name="resetEmail"
                value={resetEmail}
                onChange={this.handleChange}
                required
              />
              <button type="submit">Send Reset Email</button>
              <button type="button" onClick={() => this.setState({ showResetForm: false })}>
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={this.handleSubmit}>
              <h1>{isSignUp ? 'Create Account' : 'Sign In'}</h1>
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={this.handleChange}
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={this.handleChange}
                required
              />
              {isSignUp && (
                <input
                  type="file"
                  onChange={this.handleFileChange}
                  accept="image/*"
                />
              )}
              {!isSignUp && (
                <a href="#" onClick={() => this.setState({ showResetForm: true })}>
                  Forgot Your Password?
                </a>
              )}
              <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
            </form>
          )}
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className={`toggle-panel toggle-left ${isSignUp ? 'hidden' : ''}`}>
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all site features</p>
              <button id="login" onClick={this.toggleForm}>Sign In</button>
            </div>
            <div className={`toggle-panel toggle-right ${isSignUp ? '' : 'hidden'}`}>
              <h1>Hello,A2D PC Factory</h1>
              <p>Register with your personal details to use all site features</p>
              <button id="register" onClick={this.toggleForm}>Sign Up</button>
              <div className="social-icons" style={{ display: 'flex', gap: '10px', fontSize: '15px' }}>
                <FontAwesomeIcon icon={faGoogle} onClick={this.handleGoogleLogin} style={{ cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faFacebookF} />
                <FontAwesomeIcon icon={faGithub} />
                <FontAwesomeIcon icon={faLinkedinIn} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModernLoginPage;
