import React, { useState } from 'react';
import { Modal, Backdrop, Fade, Button, IconButton } from '@material-ui/core';
import { Close, Star } from '@material-ui/icons';
import Loader from '../../../Components/Loader';
import UserCard from "./Cards/User";
import ReviewCard from "./Cards/Review";
import styles from './Analytics.module.scss';
import defaultProf from '../../../assets/img/defaultProf.png';

import { useParams } from 'react-router';

import { firestore } from '../../../firebase';

import firebase from "firebase";

import IRating from '../../../types/IRating';

const Analytics: React.FC = (props) => {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userModalShown, setUserModalShown] = useState(false)
  const [reviewsModalShown, setReviewsModalShown] = useState(false)

  const [averageReview, setAverageReview] = useState(0)

  const [reviews, setReviews] = useState<IRating[]>([])

  const [loading, setLoading] = useState(false)

  const lastReviewDate: any = React.useRef(null)

  const { id } = useParams<{ id: string }>()

  const statsRef = firestore.collection(`venues/${id}/statistics`)

  React.useEffect(() => {
    getAverageReview()

    async function getAverageReview() {
      const average = await statsRef.doc("ratings").get().then((doc: any) => {
        if (doc.exists) {
          const { starsNum, ratingsNum } = doc.data()
          return Math.round((starsNum / ratingsNum) * 100) / 100
        }
      })

      if (average) {
        setAverageReview(average!)
      }
    }
  }, [statsRef])

  async function getReviews() {
    setLoading(true)

    let query = statsRef.doc("ratings").collection("all")
      .orderBy("date", "desc").limit(10)

    if (lastReviewDate.current) {
      query = query.startAfter(firebase.firestore.Timestamp.fromDate(new Date(lastReviewDate.current.seconds * 1000)))
    }

    await query.get().then((snapshot) => {
      const ratings: any = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      if (ratings.length > 0) {
        lastReviewDate.current = ratings[ratings.length - 1].date;

        setReviews(prevState => [...prevState, ...ratings])
      }
    })

    setLoading(false)
  }

  const data = [
    {
      uid: "d",
      firstname: 'King of Duck',
      scans: 100,
    },
    { uid: "2", firstname: 'Dude', scans: 1000, imgURL: 'https://posterspy.com/wp-content/uploads/2019/05/TheDude_lr.jpg' },
    {
      uid: "3",
      firstname: 'Funny Boy',
      scans: 500,
    },
    { uid: '4', firstname: 'Log', scans: 50, imgURL: 'https://s.felomena.com/wp-content/images/primety/bukva/p/poleno.jpg' }
  ];

  return (
    <div style={{ margin: 20 }}>
      <h3>Rating</h3>
      <div className={styles.Box}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <h1>
              <div style={{ display: "flex", alignItems: "center", color: "#ed4d1c" }}>
                {averageReview ? averageReview : "-"} <Star fontSize="large" color="inherit" />
              </div>
            </h1>
            <span className={styles.muted}>(visible only to you)</span>
          </div>

          <Button
            style={{ marginLeft: "auto" }}
            color="primary"
            onClick={() => {
              setReviewsModalShown(true)
              if (reviews.length === 0) {
                getReviews()
              }
            }}
          >
            see all reviews
          </Button>
        </div>

      </div>

      <h3>Users</h3>
      <div className={styles.Queries}>
        <Button variant="contained" color="primary" className={styles.btnQuery}>
          recently scanned
        </Button>

        <Button variant="contained" color="default" className={styles.btnQuery}>
          highest review
        </Button>
      </div>
      <div className={styles.Users}>
        {data.map(item => {
          return (
            <UserCard
              key={item.uid}
              {...item as any}
              openModal={(uid) => {
                setUserModalShown(true)
                setSelectedUser(uid)
              }}
            />
          )
        })}
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.Modal}
        open={userModalShown}
        onClose={() => { }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={userModalShown}>
          <div className={styles.ModalContent}>
            <IconButton
              style={{ position: "absolute", top: 5, right: 10 }}
              onClick={() => setUserModalShown(false)}
            >
              <Close />
            </IconButton>
            <h2 className={styles.ModalTitle}>User</h2>
            <div style={{ display: "flex", flexDirection: "row", marginTop: 5 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img src={defaultProf} className={styles.avatar} />
                <span className={styles.firstName}>User</span>
              </div>
              <div style={{ flex: 1 }}>

              </div>
            </div>
            {loading && <Loader />}
          </div>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.Modal}
        open={reviewsModalShown}
        onClose={() => { }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={reviewsModalShown}>
          <div className={styles.ModalContent}>
            <IconButton
              style={{ position: "absolute", top: 5, right: 10 }}
              onClick={() => setReviewsModalShown(false)}
            >
              <Close />
            </IconButton>
            <h2 className={styles.ModalTitle}>Latest Reviews</h2>
            <div className={styles.Users}>
              {reviews.map(review => <ReviewCard key={review.id} {...review} />)}
              {reviews.length > 0 ? <Button onClick={getReviews} color="primary">Load More</Button> : null}
            </div>

            {loading && <Loader />}
          </div>
        </Fade>
      </Modal>
    </div>
  )
}


export default Analytics;