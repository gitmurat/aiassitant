import { useEffect, useState } from "react";
import styles from "./fetching-loader.module.css";

const FetchingLoader = ({ fetching }: { fetching: boolean }) => {
  const [show, setShow] = useState(fetching);

  useEffect(() => {
    if (fetching) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 300);
    }
  }, [fetching]);

  return show ? (
    <div
      className={`${styles.fetchingLoader} ${
        fetching ? styles.fadeIn : styles.fadeOut
      }`}
    >
      <span>🔍 Obteniendo datos...</span>
    </div>
  ) : null;
};

export default FetchingLoader;
