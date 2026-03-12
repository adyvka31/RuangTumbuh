import styles from "./Navbar.module.css";

import { useEffect, useState } from "react";



export default function Navbar() {

  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const [hideCursor, setHideCursor] = useState(false);



  useEffect(() => {

    const moveCursor = (e) => {

      setCursor({

        x: e.clientX,

        y: e.clientY,

      });

    };



    window.addEventListener("mousemove", moveCursor);



    return () => window.removeEventListener("mousemove", moveCursor);

  }, []);



  const disableCustomCursor = () => setHideCursor(true);

  const enableCustomCursor = () => setHideCursor(false);



  return (

    <>

      <div

        className={`${styles.cursor} ${hideCursor ? styles.cursorHide : ""}`}

        style={{

          left: cursor.x,

          top: cursor.y,

        }}

      >

        ✦

      </div>



      <div className={styles.headerContainer}>

        <nav className={styles.navbar}>

          <div className={styles.left}>

            <a

              href="#home"

              onMouseEnter={disableCustomCursor}

              onMouseLeave={enableCustomCursor}

            >

              HOME

            </a>

            <a

              href="#find_tutor"

              onMouseEnter={disableCustomCursor}

              onMouseLeave={enableCustomCursor}

            >

              LEARN & TEACH

            </a>

            <a

              href="#calendar"

              onMouseEnter={disableCustomCursor}

              onMouseLeave={enableCustomCursor}

            >

              CALENDAR

            </a>

            <a

              href="#calendar"

              onMouseEnter={disableCustomCursor}

              onMouseLeave={enableCustomCursor}

            >

              SESSION

            </a>

          </div>



          <div className={styles.divider}></div>



          <div className={styles.right}>

            <a

              href="#signin"

              onMouseEnter={disableCustomCursor}

              onMouseLeave={enableCustomCursor}

            >

              SIGN IN

            </a>



            <button

              className={styles.button}

              onMouseEnter={disableCustomCursor}

              onMouseLeave={enableCustomCursor}

            >

              GET STARTED

            </button>

          </div>

        </nav>

        <div

          className={styles.dashboard}

          onMouseEnter={disableCustomCursor}

          onMouseLeave={enableCustomCursor}

        >

          <img src="src/assets/logo.svg" alt="Logo RuangTumbuh" />

        </div>

      </div>

    </>

  );

}