import React from "react";
import styles from "./RegisterForm.module.css";
import { FiUser, FiAtSign, FiLock } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { Popup } from "@components/Popup/Popup";
import { useRegister } from "@/hooks/useRegister";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    apiError,
    popup,
    isPending,
    navigate,
  } = useRegister();

  return (
    <>
      <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
        {apiError && <p className={styles.apiErrorMessage}>{apiError}</p>}

        <div className={styles.inputFormGroup}>
          <div className={styles.inputWrapper}>
            <Input
              type="text"
              id="name"
              label="Name"
              icon={FiUser}
              errorMessage={errors.name?.message}
              {...register("name")}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Input
              type="email"
              id="email"
              label="Email"
              icon={FiAtSign}
              errorMessage={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.flexInput}>
              <Input
                type="password"
                id="password"
                label="Password"
                icon={FiLock}
                autoComplete="new-password"
                errorMessage={errors.password?.message}
                {...register("password")}
              />
            </div>
            <div className={styles.flexInput}>
              <Input
                type="password"
                id="confirmPassword"
                label="Confirm"
                icon={FiLock}
                autoComplete="new-password"
                errorMessage={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Register"}
        </Button>
      </form>

      <Popup
        isOpen={popup.isOpen}
        type="success"
        icon={<MdCheckCircle />}
        title={popup.title}
        description={popup.description}
        buttonText="Pergi Ke Login"
        onAction={() => navigate("/login")}
      />
    </>
  );
};
