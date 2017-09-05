# hyperapp-firebase-auth

> Drop in authentication for hyperapps using firebase

![ezgif com-gif-maker](https://user-images.githubusercontent.com/1457604/29901861-6cf8c5d4-8df2-11e7-9611-e2800e7bde96.gif)

This project exports a [hyperapp](https://github.com/hyperapp/hyperapp) [mixin](https://github.com/hyperapp/hyperapp/blob/master/docs/mixins.md) that wraps the [Firebase authentication API](https://firebase.google.com/docs/auth/). It manages the application state and renders appropriate views for the authentication flows `Sign In` and `Create User`.

Out of the box features include:

- No server setup or backend code
- Human readable error messages
- Email validation and confirmation
- Reset password by email
- Compatible with [@hyperapp/router](https://github.com/hyperapp/router)


## Usage

> If you have not already initialized firebase on your frontend see [Firebase Setup](#firebase-setup)

Install the package from npm or include from [CDN](https://unpkg.com/hyperapp-firebase-auth):

```
npm i hyperapp-firebase-auth
```

Import `firebaseAuth` and add it to mixins, then add `{ auth: true }` prop to the root view:

```js
import { app, h } from 'hyperapp'
import { firebaseAuth } from 'hyperapp-firebase-auth'

app({
  state: {},
  view: state => h('main', { auth: true }, `Hello ${state.firebaseAuth.user.uid}!`),
  mixins: [firebaseAuth]
})
```
**DEMO:** https://codepen.io/lukejacksonn/pen/xLBJoN


## How it works

- The mixin will check the view root for the prop `{ auth: true }`
- If the view requires auth then the mixin prevents the view from rendering
- An empty element is rendered until an auth status is received from Firebase
- If the auth status is null then all users are prompted to enter their email address
  - Existing users are then prompted to enter their password to sign in
  - New users are prompted to confirm their email address and set a password to sign up
- The root view will be rendered once auth status returns a valid Firebase user


## Firebase Setup

If you want to utilize Firebase Authentication for your own apps then you will need to create a Firebase Account and create a new project. This can be done for **free** at https://console.firebase.google.com.

> If you don't want to create your own project then you can use the example config below

Once you have created a project you will be presented with an app configuration like this:

```html
<script src="https://www.gstatic.com/firebasejs/4.3.0/firebase.js"></script>
<script>
  var config = {
    apiKey: "AIzaSyBKRtxwj3SrSZdlKs4x5CeFm4zxymv6JDU",
    authDomain: "hyperapp-497ce.firebaseapp.com",
    databaseURL: "https://hyperapp-497ce.firebaseio.com",
    projectId: "hyperapp-497ce",
    storageBucket: "hyperapp-497ce.appspot.com",
    messagingSenderId: "458459404992"
  };
  firebase.initializeApp(config);
</script>
```

Add this snippet to your `index.html` **before** your hyperapp application code. This ensures that the Firebase API exists when the mixin loads. It is possible to `require` or `import` the Firebase library into your project, but the setup for this is out of the scope of this example.

Once you are setup, visit the link below (replacing `${projectId}` with the projectId from your newly created Firebase project config) and `Enable` the `Email/Password` provider.

```
https://console.firebase.google.com/project/${projectId}/authentication/providers
```

That is all the back and front end configuration you need to do.. Phew :sweat_smile:
