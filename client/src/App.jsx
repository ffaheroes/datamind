import React,{useContext} from 'react';
import { BrowserRouter as Router, Route, Routes,useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/index.scss';
import Loadable from 'react-loadable';
import Spinner from './components/shared/Spinner';
import Header from './components/shared/Header';
import { ContextWrapper, withContext } from './utils/context';
import GlobalProvider from './context/Provider';
import { GlobalContext } from '../src/context/Provider'


const BlogScreen = Loadable({
  loader: () => import('./screens/BlogScreen/BlogScreen'),
  loading: Spinner,
});

const ProfileScreen = Loadable({
  loader: () => import('./screens/ProfileScreen/ProfileScreen'),
  loading: Spinner,
});

const ProfileEditScreen = Loadable({
  loader: () => import('./screens/BlogScreen/BlogScreen'),
  loading: Spinner,
});

const PostViewScreen = Loadable({
  loader: () => import('./screens/PostViewScreen/PostViewScreen'),
  loading: Spinner,
});

const PostEditScreen= Loadable({
  loader: () => import('./screens/PostEditScreen/PostEditScreen'),
  loading: Spinner,
});

const CreateScreen= Loadable({
  loader: () => import('./screens/CreateScreen/CreateScreen'),
  loading: Spinner,
});

const LoginScreen = Loadable({
  loader: () => import('./screens/auth/LoginScreen'),
  loading: Spinner,
});

const RegisterScreen = Loadable({
  loader: () => import('./screens/auth/RegisterScreen'),
  loading: Spinner,
});


const App = () => {
  const {authDispatch,authState} = useContext(GlobalContext);
  return(
  <GlobalProvider>
    <Router>
      <React.Fragment>
        <Header />
        <Routes>
          <Route path="/blogs/:blogId/posts/:postId/edit" element={<PostEditScreen/>} />
          <Route path="/blogs/1/posts/:postId" element={<PostViewScreen/>}/>
          <Route path="/blogs/:blogName/edit" element={<ProfileEditScreen/>} />
          <Route path="/blogs/:blogName" element={<ProfileScreen/>}/>
          <Route path="/" element ={<BlogScreen/>} />
          <Route path="/register" element={<RegisterScreen/>} />
          <Route path="/create" element={<CreateScreen/>} />
          <Route path="/login" element={<LoginScreen/>} />
        </Routes>
      </React.Fragment>
    </Router>
  </GlobalProvider>
  )
};

export default App;