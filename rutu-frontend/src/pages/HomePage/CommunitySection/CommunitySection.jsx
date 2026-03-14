import React from "react";
import styles from "./CommunitySection.module.css";
import { COMMUNITY_FEATURES } from "@/constants/communityData";
import CommunityMockup from "./CommunityMockup";
import CommunityCard from "./CommunityCard";

export default function CommunitySection() {
  return (
    <main className={styles.main} id="komunitas">
      <div className={styles.leftSection}>
        <div className={styles.headerArea}>
          <span className={styles.tag}>Feature Spotlight</span>
          <h1 className={styles.heroTitle}>Interaction Room</h1>
          <p className={styles.heroDesc}>
            Belajar coding sendirian itu berat. Bergabunglah dengan ratusan
            pembelajar lainnya, diskusikan masalahmu, dan temukan circle yang
            sefrekuensi.
          </p>
        </div>

        <div className={styles.featureList}>
          {COMMUNITY_FEATURES.map((feat, index) => (
            <CommunityCard key={feat.id} feat={feat} index={index} />
          ))}
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.stickyWrapper}>
          <CommunityMockup />
        </div>
      </div>
    </main>
  );
}
