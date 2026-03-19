import styles from "./RegisterForm.module.css";
import { FiUser, FiAtSign, FiLock } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { Popup } from "@components/Popup/Popup";

export const RegisterForm = () => {
  return (
    <>
      <form className={styles.registerForm}>
        <div className={styles.inputFormGroup}>
          <Input type="text" id="name" name="name" label="Name" icon={FiUser} />
          <Input
            type="email"
            id="email"
            name="email"
            label="Email"
            icon={FiAtSign}
          />
          {/* ... input password ... */}
          <div className={styles.formRow}>
            <div className={styles.flexInput}>
              <Input
                type="password"
                id="password"
                name="password"
                label="Password"
                icon={FiLock}
              />
            </div>
            <div className={styles.flexInput}>
              <Input
                type="password"
                id="confirm-password"
                name="confirm-password"
                label="Confirm"
                icon={FiLock}
              />
            </div>
          </div>
        </div>

        <Button type="submit">Register</Button>
      </form>

      {/* POPUP diletakkan di sini agar logic-nya nyambung */}
      <Popup
        icon={<MdCheckCircle />}
        title="Berhasil!"
        description="Akun kamu berhasil dibuat, pergi ke login untuk melanjutkan pendaftaran."
        buttonText="Let's Login"
        onAction={() => navigate("/login")}
      />
    </>
  );
};
