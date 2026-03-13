import styles from "./CalendarSection.module.css";
import Calendar from "./Calendar";

export default function SchedulingPage() {
    return (
        <main className={styles.main}>

            <div className={styles.leftSection}>
                <Calendar />
            </div>

            <div className={styles.rightSection}>

                <section className={styles.section}>
                    <span className={styles.tag}>Feature Spotlight</span>

                    <h1 className={styles.heroTitle}>
                        Integrated Schedule
                    </h1>

                    <p className={styles.heroDesc}>
                        Kuasai waktumu dengan antarmuka kalender built-in kami.
                        Didesain untuk fokus, dibangun untuk kecepatan, dan bikin
                        perencanaan harian jadi pengalaman visual yang seru, bukan beban.
                    </p>

                    <div>
                        <h2>Sesi Mentorship</h2>
                        <p>
                            Pesan sesi bimbingan langsung dengan mentor pilihanmu. Pilih tanggal, jam, dan topik bahasan tanpa perlu chat sana-sini.
                        </p>
                    </div>

                    <div>
                        <h2>Workshop Eksklusif</h2>
                        <p>
                            Pantau jadwal UI Design Workshop atau webinar teknologi terbaru. Tandai kalendermu dan dapatkan notifikasi pengingat otomatis.
                        </p>
                    </div>

                    <div>
                        <h2>Belajar Bareng (Group Sync)</h2>
                        <p>
                            Atur jadwal belajar bareng teman komunitas Ruang Tumbuh. Kalender akan menyesuaikan zona waktu secara otomatis biar nggak ada yang telat.
                        </p>
                    </div>

                    <div>
                        <h2>Target Belajar Publik</h2>
                        <p>
                            Tunjukkan komitmenmu dengan membagikan jadwal belajarmu secara publik. Bangun akuntabilitas dan saling dukung antar sesama pengguna.
                        </p>
                    </div>

                    <div>
                        <h2>Tracking Progres</h2>
                        <p>
                            Lihat seberapa konsisten kamu belajar dalam sebulan. Tandai hari-harimu dengan warna-warni pencapaian yang bikin semangat nambah!
                        </p>
                    </div>
                    <div>
                        <h2>Tracking Progres</h2>
                        <p>
                            Lihat seberapa konsisten kamu belajar dalam sebulan. Tandai hari-harimu dengan warna-warni pencapaian yang bikin semangat nambah!
                        </p>
                    </div>
                </section>
            </div>

        </main>
    );
}