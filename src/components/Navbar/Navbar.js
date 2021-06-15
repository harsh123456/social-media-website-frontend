import React, { useState, useEffect } from 'react';
import { Avatar, Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import { getPostsBySearch } from '../../actions/posts';
import memoriesLogo from '../../images/favicon.png';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [search, setSearch] = useState('');

  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  //const query = useQuery();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    history.push('/auth');

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  const searchPost = () => {
    if (search.trim()) {
      dispatch(getPostsBySearch({ search }));
      history.push(`/posts/search?searchQuery=${search || 'none'}`);
    } else {
      history.push('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  return (
    <div className={classes.grow}>
      <AppBar>
        <Toolbar>

          <Link to="/" className={classes.brandContainer}>
            <img className={classes.image} src={memoriesLogo} alt="icon" height="40px" />
          </Link>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search Memories"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onKeyDown={handleKeyPress} 
              name="search" 
              fullWidth 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={classes.grow} />
          <Toolbar className={classes.toolbar}>
            {user?.result ? (
              <div className={classes.profile}>
                <Avatar 
                  className={classes.purple} 
                  alt={user?.result.name} 
                  src={user?.result.imageUrl} 
                  onClick={logout}
                  style={{ cursor: 'pointer' }}
                >
                    {user?.result.name.charAt(0)}
                </Avatar>
              </div>
              ) : (
                <Button 
                  component={Link} 
                  to="/auth" 
                  variant="contained" 
                  color="secondary"
                  size="medium"
                >
                  SignIn
                </Button>
              )
            }
          </Toolbar>

        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
