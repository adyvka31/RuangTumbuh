import { Link } from "react-router-dom";
import { FiAtSign, FiLock } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import styles from "./LoginForm.module.css";
import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { Popup } from "@components/Popup/Popup";
import { useLoginForm } from "@/hooks/useLoginForm";
import { LOGIN_MESSAGES } from "@/constants/loginMessages";

export const LoginForm = () => {
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors },
    },
    apiError,
    showPopup,
    loginMutation,
    onSubmit,
    navigate,
  } = useLoginForm();

  return (
    <>
      <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
        {apiError && (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              marginBottom: "10px",
              marginTop: "-15px",
            }}
          >
            {apiError}
          </p>
        )}

        <div className={styles.inputFormGroup}>
          <div>
            <Input
              type="email"
              id="email"
              label="Email"
              icon={FiAtSign}
              {...register("email")}
            />
            {errors.email && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <Input
              type="password"
              id="password"
              label="Password"
              icon={FiLock}
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.password.message}
              </span>
            )}
          </div>

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

        <Button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending
            ? LOGIN_MESSAGES.BUTTON_LOADING
            : LOGIN_MESSAGES.BUTTON_LOGIN}
        </Button>
      </form>

      {showPopup && (
        <Popup
          isOpen={true}
          icon={<MdCheckCircle />}
          title={LOGIN_MESSAGES.SUCCESS_TITLE}
          description={LOGIN_MESSAGES.SUCCESS_DESCRIPTION}
          buttonText="Pergi Ke Dashboard"
          onAction={() => navigate("/dashboard")}
        />
      )}
    </>
  );
};
