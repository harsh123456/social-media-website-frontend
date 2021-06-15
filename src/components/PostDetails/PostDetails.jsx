import React, { useEffect } from 'react';
import {
  Paper, 
  Typography, 
  CircularProgress, 
  Divider, 
  Card,
  CardContent, 
  CardMedia, 
  Grid 
} from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';

import { getPost, getPostsBySearch } from '../../actions/posts';
import useStyles from './styles';

const Post = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
    }
  }, [post, dispatch]);

  if (!post) return null;

  const openPost = (_id) => history.push(`/posts/${_id}`);

  if (isLoading) {
    return (
      <div className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </div>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px', marginTop: '80px' }} elevation={6}>
      
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile} alt={post.title} />
        </div>
      </div>

      {!!recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">You might also like:</Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            <div className={classes.root}>
              <Grid
                    container
                    spacing={3}
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
              >
                {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
                  <Grid item xs={12} sm={6} md={3}>
                    <div style={{ margin: '20px', cursor: 'pointer' }} onClick={() => openPost(_id)} key={_id}>
                      <Card className={classes.card_1}>
                        <CardMedia className={classes.media_1} image={selectedFile} title={title} />
                        <div className={classes.overlay}>
                          <Typography variant="h6">{name}</Typography>
                        </div>
                        <div className={classes.details}>
                          <Typography variant="body2" color="textSecondary" component="h2">Likes: {likes.length}</Typography>
                        </div>
                        <Typography className={classes.title} gutterBottom variant="h5" component="h2">{title}</Typography>
                        <CardContent>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {message.split(' ').splice(0, 10).join(' ')}...
                          </Typography>
                        </CardContent>
                      </Card>
                    </div>
                  </Grid> 
                ))}
              </Grid>
            </div>
          </div>
        </div>
      )}
      
    </Paper>
  );
};

export default Post;
