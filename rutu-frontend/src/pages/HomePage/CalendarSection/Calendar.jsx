import styles from "./Calendar.module.css";

export default function Calendar() {
    return (
        <div className={styles.calendarWrapper}>
            <div className={styles.sticky}>
                <div className={styles.calendarCard}>

                    <div className={styles.calendarHeader}>

                        <h3 className={styles.monthTitle}>October 2026</h3>

                    </div>

                    <div className={styles.calendarGrid}>
                        <div className={styles.dayLabel}>Sun</div>
                        <div className={styles.dayLabel}>Mon</div>
                        <div className={styles.dayLabel}>Tue</div>
                        <div className={styles.dayLabel}>Wed</div>
                        <div className={styles.dayLabel}>Thu</div>
                        <div className={styles.dayLabel}>Fri</div>
                        <div className={styles.dayLabel}>Sat</div>

                        {[...Array(31)].map((_, i) => {
                            const day = i + 1;

                            let classList = `${styles.day}`;

                            if (day === 4) classList += ` ${styles.secondaryDay}`;
                            if (day === 11) classList += ` ${styles.accentDay}`;
                            if (day === 22) classList += ` ${styles.primaryDay}`;

                            return (
                                <button key={day} className={classList}>
                                    {day}
                                    {day === 4 && <div className={styles.eventDot}></div>}
                                </button>
                            );
                        })}
                    </div>

                    <div className={styles.events}>
                        <div className={styles.eventSecondary}>
                            <div className={styles.eventColorSecondary}></div>
                            <span className={styles.eventText}>
                                UI Design Workshop - 4th Oct
                            </span>
                        </div>

                        <div className={styles.eventAccent}>
                            <div className={styles.eventColorAccent}></div>
                            <span className={styles.eventText}>
                                Mentorship Session - 11th Oct
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}