import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './pages/Login';
import Protected from './components/Protected';
import Dashboard from './pages/Dashboard';
import Profile from './components/Profile';
import Blogs from './pages/Blogs';
import './App.css';
import AddBlog from './pages/AddBlog';
import Articles from './pages/Articles';
import Members from './pages/Members';
import AddArticle from './pages/AddArticle';
import AddMember from './pages/AddMember';
import EditBlog from './pages/EditBlog';
import EditArticle from './pages/EditArticle';
import EditMember from './pages/EditMember';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import EventBooking from './pages/EventBooking';
import AddBooking from './pages/AddBooking';
import Category from './pages/Category.jsx';
import Settings from './pages/Settings.jsx';
import Messages from './pages/Messages.jsx';

function App() {
  console.log('screen');
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/category" element={<Protected><Category /></Protected>} />
      <Route path="/blogs" element={<Protected><Blogs /></Protected>} />
      <Route path="/articles" element={<Protected><Articles /></Protected>} />
      <Route path="/members" element={<Protected><Members /></Protected>} />
      <Route path="/add-blog" element={<Protected><AddBlog /></Protected>} />
      <Route path="/blogs/edit-blog/:Blogid" element={<Protected><EditBlog /></Protected>} />
      <Route path="/add-article" element={<Protected><AddArticle /></Protected>} />
      <Route path="/articles/edit-article/:Articleid" element={<Protected><EditArticle /></Protected>} />
      <Route path="/members/edit-member/:member_id" element={<Protected><EditMember /></Protected>} />
      <Route path="/add-member" element={<Protected><AddMember /></Protected>} />
      <Route path="/gallery" element={<Protected><Gallery /></Protected>} />
      <Route path="/events" element={<Protected><Events /></Protected>} />
      <Route path="/events/event-booking" element={<Protected><EventBooking /></Protected>} />
      <Route path="/events/add-booking" element={<Protected><AddBooking /></Protected>} />
      <Route path="/settings" element={<Protected><Settings /></Protected>} />
      <Route path="/messages" element={<Protected><Messages /></Protected>} />

      <Route path="/profile" element={<Protected><Profile /></Protected>} />
    </Routes>
  );
}

export default App;
