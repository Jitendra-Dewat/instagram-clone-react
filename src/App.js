import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import {makeStyles} from '@material-ui/core/styles';
import Modal from "@material-ui/core/Modal";
import { db, auth } from './firebase';
import { Button } from '@material-ui/core';
import ImageUload from './ImageUpload';
import Developer from './Developer'
import InstagramEmbed from'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {


  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] =useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);


  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        // user hase logged in...
        console.log(authUser);
        setUser(authUser);

      }else{
            //user has logged out....
              setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }

    
  }, [user, username]);
    
  // useEffect -> runs a piece of code on a specific condition
  useEffect( () => {


    // onSnapshot is real time listner, so every time a post added onSnapshot  will update the post in real time and rerander the data on screen
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {

    setPosts(snapshot.docs.map((doc) => ({
      id: doc.id,
      post : doc.data()
    })));
     // setting the posts array with post with help of .map.......!   .map ittrate through the data
    })
  }, []);

const signup = (event) => {
  event.preventDefault();
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
    return authUser.user.updateProfile ({
      displayName: username
    })
  })
  .catch((error) => alert(error.message));
  setOpen(false);
}


const signIn = (event) =>{
  event.preventDefault();
  auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);

}
  

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>

        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                class="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
              <br />
              <input className="signup__input"
                type="text"
                placeholder="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <input
              className="signup__input"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <input
              className="signup__input"
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <Button className="signup__input" type="submit" onClick={signup}>
                Sign up
              </Button>
            </center>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                class="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
              <br />
              <input
              className="signup__input"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <input
              className="signup__input"
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <Button className="signup__input" type="submit" onClick={signIn}>
                Login
              </Button>
            </center>
          </form>
        </div>
      </Modal>

      <div class="app__header">
        <img
          class="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        
        <Developer />
        
      
        {user ? (
          <Button onClick={() => auth.signOut()}> Logout</Button>
         
          
        ) : (
          <div class="app_loginContainer">
           
            <Button onClick={() => setOpenSignIn(true)}>Login</Button>

            <Button onClick={() => setOpen(true)}> Sign Up</Button>
          </div>
        )}
      </div>

      
      <div class="app__posts">
        <div class="app__postLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div class="app__postRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/B-CtVXyhj1L/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUload username={user.displayName} />
      ) : (
        <h3 className="App__sorryMessageForLogin">Sorry you need to login to upload</h3>
      )}

      
    </div>
  );
}

export default App;
