/* eslint-disable @typescript-eslint/no-unused-vars */
/*eslint linebreak-style: ["error", "windows"]*/
import { Box, Container } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PostSkeleton from '../components/Posts/PostSkeleton';
import { auth, db } from '../firebase/firebaseConfig';
import { useAppDispatch } from '../redux/hooks/hooks';
import { Post, PostVote, addPosts, clearPostVotes, setPostVotes } from '../redux/slices/postsSlice';
import SinglePost from '../components/Posts/SinglePost';
import usePosts from '../hooks/usePosts';
import useCommunityInfo from '../hooks/useCommunityInfo';
import FredditPremium from '../components/HomeComponents/FredditPremium';
import HomeInfo from '../components/HomeComponents/HomeInfo';
import TopCommunites from '../components/HomeComponents/TopCommunites';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import PostFilter from '../components/PostFilter/PostFilter';

export default function AboutPage() {
  const isSmall = useMediaQuery('(max-width: 900px)');
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { posts, postVotes, deletePost, handleVote, selectPost } = usePosts();
  const { userCommunityInfo } = useCommunityInfo();
  const dispatch = useAppDispatch();

  const createNonUserPostsFeed = async () => {
    try {
      setLoading(true);
      const postQuery = query(collection(db, 'posts'), orderBy('numOfVotes', 'desc'), limit(10));
      const postDocs = await getDocs(postQuery);
      const sortedPosts = postDocs.docs.map((post) => ({
        id: post.id,
        ...post.data(),
      }));
      dispatch(addPosts(sortedPosts as Post[]));
    } catch (error: any) {
      console.log('error building home feed (non-user)', error.message);
    }
    setLoading(false);
  };

  const createUserPostsFeed = async () => {
    try {
      setLoading(true);
      if (userCommunityInfo.length) {
        const userCommunityIds = userCommunityInfo.map((community) => community.communityId);
        const postQuery = query(
          collection(db, 'posts'),
          where('communityId', 'in', userCommunityIds),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const sortedPosts = postDocs.docs.map((post) => ({
          id: post.id,
          ...post.data(),
        }));
        dispatch(addPosts(sortedPosts as Post[]));
      } else {
        createNonUserPostsFeed();
      }
    } catch (error: any) {
      console.log('Firebase error building home feed (user)', error.message);
    }
    setLoading(false);
  };

  const getHomeFeedPostVotes = async () => {
    try {
      const postIds = posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(db, `users/${user?.uid}/postVotes`),
        where('postId', 'in', postIds)
      );
      const postVotesDocs = await getDocs(postVotesQuery);
      const posVotes = postVotesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setPostVotes(posVotes as PostVote[]));
    } catch (error: any) {
      console.log('Firebase error on home page getting post votes', error.message);
    }
  };

  useEffect(() => {
    if (!user && !loadingUser) {
      createNonUserPostsFeed();
    }
    if (user && !loadingUser) {
      createUserPostsFeed();
    }
  }, [user, loadingUser]);

  useEffect(() => {
    if (user && posts.length) {
      getHomeFeedPostVotes();
    }
    return () => {
      dispatch(clearPostVotes());
    };
  }, [user, posts]);

  return (
    <Box>
      <Container
        size="xl"
        sx={{
          marginTop: '0.8rem',
        }}
      >
        <Box sx={{ padding: `${isSmall ? '0rem' : '2rem'}` }}>
          <h1>About Us</h1>
          <p>
            Welcome to <b>Noterep Forum</b>, the ultimate forum for college students who are
            passionate about technology, sharing resources, and discussing the latest news and
            trends.
          </p>
          <p>
            Our platform was born out of a need to provide students with a inclusive space to share
            their knowledge and ideas. I noticed that although many college students are
            enthusiastic about learning and exploring new things, they often lack a platform to
            express their thoughts and ideas beyond the classroom. Also often steps back from
            sharing on class WhatsApp groups. That&lsquo;s why I created Noterep - a community where
            students can freely share their thoughts and knowledge, and engage in discussions about
            the latest technological advancements and news.
          </p>
          <p>
            Noterep is more than just a notes-sharing platform; it&lsquo;s a space for
            collaboration, connection, and growth. Whether you&lsquo;re looking for study materials,
            exploring new fields of technology, or just want to connect with like-minded
            individuals, Noterep has got you covered. Our community is open, and I welcome all
            students. I believe that learning is a lifelong journey, and we&lsquo;re here to support
            and help each others. Create community today and start sharing your ideas, asking
            questions, and building your knowledge with Noterep Forum.
          </p>
          <i>This Platform is Re Structured and Developed by</i> <b>Shravan</b>
        </Box>
        <Box
          sx={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            marginTop: '0.2rem',
          }}
        >
          <ScrollToTop />
        </Box>
      </Container>
    </Box>
  );
}
