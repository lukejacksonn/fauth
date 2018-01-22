import { h } from 'hyperapp'
import $form from './form'

const firebaseAuth = firebase.auth()

const Identity = (state, actions) =>
  Form({
    key: 'identity-form',
    titleText: 'Identity Required',
    promptText: `New and existing users please enter your email address to continue`,
    submitText: 'Continue',
    errorText: state.error.message,
    inputs: [
      {
        name: 'email',
        type: 'email',
        placeholder: 'Email Address',
        autocomplete: 'email',
      },
    ],
    action: actions.fetchProviders,
  })

const Signin = (state, actions) =>
  Form({
    key: 'signin-form',
    titleText: 'Existing Identity',
    promptText:
      'In order for us to confirm your identity please enter your password.',
    submitText: 'Sign In',
    errorText: state.error.message,
    inputs: [
      { name: 'password', type: 'password', placeholder: 'Password' },
      { name: 'email', type: 'hidden', value: state.user.email },
    ],
    action: actions.signin,
    links: [
      {
        text: 'Sign in with a different identity',
        action: actions.resetIdentity,
      },
      { text: 'Reset password', action: actions.resetPassword },
    ],
  })

const Signup = (state, actions) =>
  Form({
    key: 'signup-form',
    titleText: 'New Identity',
    promptText:
      'Please confirm your email address and a set a secure password.',
    submitText: 'Create User',
    errorText: state.error.message,
    inputs: [
      { name: 'email', type: 'email', value: state.user.email },
      { name: 'password', type: 'password', placeholder: 'Password' },
    ],
    action: actions.signup,
    links: [
      {
        text: 'Sign in with a different identity',
        action: actions.resetIdentity,
      },
    ],
  })

export const Auth = (state, actions) =>
  h('dialog', {}, [
    !model.user.email
      ? Identity(state, actions)
      : model.hasIdentity.length
        ? Signin(state, actions)
        : Signup(state, actions),
  ])

export const auth = {
  state: {
    authed: false,
    checked: false,
    user: null,
    error: {},
    hasIdentity: [],
  },
  actions: {
    setHasIdentity: hasIdentity => ({ hasIdentity }),
    setUser: user => ({ user }),
    setError: (error = {}) => ({ error }),
    userChanged: user => ({
      user: user || {},
      authed: !!user,
      checked: true,
    }),
    resetIdentity: () => ({
      user: {},
      error: {},
    }),
    signout: () => {
      firebaseAuth.signOut()
    },
    signin: ({ email, password }) => ({ setError }) => {
      setError()
      firebaseAuth.signInWithEmailAndPassword(email, password).catch(setError)
    },
    signup: ({ email, password }) => ({ setError, setUser }) => {
      setError()
      setUser({ email })
      firebaseAuth
        .createUserWithEmailAndPassword(email, password)
        .catch(setError)
    },
    fetchProviders: ({ email }) => ({ setError, setUser, setHasIdentity }) => {
      setError()
      firebaseAuth
        .fetchProvidersForEmail(email)
        .then(providers => {
          setUser({ email })
          setHasIdentity(providers)
        })
        .catch(setError)
    },
    resetPassword: _ => ({ email, setError }) =>
      confirm(`Send a password reset email to ${email}?`) &&
      firebaseAuth
        .sendPasswordResetEmail(email)
        .then(_ =>
          alert(
            `A password reset email has been sent to ${email} please check your inbox.`
          )
        )
        .catch(setError),
  },
}
