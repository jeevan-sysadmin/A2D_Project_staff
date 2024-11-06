import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons'; // Import specific brand icons
import { auth, googleProvider } from '../firebase'; // Import Firebase auth and google provider
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'; // Import auth methods
import { useHistory } from 'react-router-dom'; // React router for navigation
import './Signin.css';

class ModernLoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignUp: false, // To toggle between sign-up and sign-in forms
      email: '',
      password: '',
      name: '',
      resetEmail: '', // For password reset functionality
      showResetForm: false, // Toggle to show the password reset form
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

  handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, name, isSignUp } = this.state;

    if (isSignUp) {
      try {
        // Sign up logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
        // Redirect to home after successful sign-up
        window.location.href = '/home'; 
      } catch (error) {
        console.error("Error during sign up: ", error.message);
        alert("Error during sign up");
      }
    } else {
      try {
        // Sign in logic
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
        // Redirect to home after successful login
        window.location.href = '/home'; 
      } catch (error) {
        console.error("Error during sign in: ", error.message);
        alert("Error during sign in");
      }
    }
  };

  handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      alert("Google login successful!");
      // Redirect to home after Google login
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

  // componentDidMount: Run when the component is mounted
  componentDidMount() {
    // Add event listeners for toggle buttons
    this.registerButton = document.getElementById('register');
    this.loginButton = document.getElementById('login');

    if (this.registerButton && this.loginButton) {
      this.registerButton.addEventListener('click', this.handleRegisterClick);
      this.loginButton.addEventListener('click', this.handleLoginClick);
    }
  }

  // componentWillUnmount: Cleanup before the component is unmounted
  componentWillUnmount() {
    // Remove event listeners to prevent memory leaks
    if (this.registerButton && this.loginButton) {
      this.registerButton.removeEventListener('click', this.handleRegisterClick);
      this.loginButton.removeEventListener('click', this.handleLoginClick);
    }
  }

  // Handle click on register button
  handleRegisterClick = () => {
    this.container.classList.add("active");
  };

  // Handle click on login button
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
              {!isSignUp && <span>or use your email for sign in</span>}
              {isSignUp && <span>or use your email for registration</span>}
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
              <button id="login">
                Sign In
              </button>
            </div>
            <div className={`toggle-panel toggle-right ${isSignUp ? '' : 'hidden'}`}>
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all site features</p>
              <button id="register">
                Sign Up
              </button>
              <div className="social-icons" style={{ display: 'flex', gap: '10px', fontSize: '15px' }}>
                <FontAwesomeIcon icon={faGoogle} onClick={this.handleGoogleLogin} style={{ cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faFacebookF} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModernLoginPage;
