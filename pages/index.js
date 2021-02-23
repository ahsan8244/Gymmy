import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [gymTimeSlots, setGymTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getGymTimeSlots = async () => {
      setLoading(true);
      const response = await fetch("/express-api/gymTimeSlots");
      const gymTimeSlotsData = await response.json();
      setGymTimeSlots(gymTimeSlotsData);
      setLoading(false);
    };

    getGymTimeSlots();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Gymmy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h2>Welcome to Gymmy.</h2>
        <p>Plan your gym sessions at HKU effectively</p>
      </div>

      <div>
        <h3>All timeslots:</h3>
        <p className={styles.notice}>Refreshes every three minutes</p>
        {gymTimeSlots.map((gym, index) => {
          return <div key={index}>
            <h4>{gym.name}</h4>
            {
              gym.timeSlots.map((slot, index) => (
                <p key={index}>{slot}</p>
              ))
            }
          </div>;
        })}
      </div>
    </div>
  );
}
