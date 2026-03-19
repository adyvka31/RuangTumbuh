import styles from "./LoginForm.module.css";
import { Link } from "react-router-dom";
import { FiAtSign, FiLock } from "react-icons/fi";
import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
export const LoginForm = ({}) => {
  return (
    <form className={styles.loginForm}>
      <div className={styles.inputFormGroup}>
        <Input
          type="text"
          id="email"
          name="email"
          label="Email"
          icon={FiAtSign}
        />
        <Input
          type="password"
          id="password"
          name="password"
          label="Password"
          icon={FiLock}
        />
        {/* Remember me & Forgot password column */}
        <div className={styles.passwordActionsForm}>
          <div className={styles.rememberMeGroup}>
            <input type="checkbox" name="Rememberme" id="rememberme" />
            <label htmlFor="rememberme">Ingatkan Saya</label>
          </div>
          <Link to="/forgot-password" className={styles.forgotPassword}>
            Lupa Password
          </Link>
        </div>
      </div>
      {/* Login Button */}
      <Button type="submit">Login</Button>
    </form>
  );
};
