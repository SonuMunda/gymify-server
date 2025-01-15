import yup from "yup";

const schemas = {
  loginSchema: yup.object({
    body: yup.object({
      email: yup.string().email().required(),
      password: yup
        .string()
        .required("please enter your password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 special Character"
        ),
    }),
  }),

  logoutSchema: yup.object({
    body: yup.object({
      refreshToken: yup.string().required(),
    }),
  }),

  refreshTokenSchema: yup.object({
    body: yup.object({
      refreshToken: yup.string().required(),
    }),
  }),

  registerSchema: yup.object({
    body: yup.object({
      fullName: yup
        .string()
        .matches(
          /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
          "Please enter a valid name"
        )
        .required(),
      username: yup
        .string()
        .matches(
          /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/,
          "Please enter a valid username"
        )
        .required(),
      email: yup.string().required(),
      password: yup
        .string()
        .required("please enter your password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 special Character"
        ),
    }),
  }),

  resetPasswordSchema: yup.object({
    body: yup.object({
      password: yup.string().min(3).max(128).required(),
      newPassword: yup
        .string()
        .required("please enter your password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 special Character"
        ),

      newPasswordConfirm: yup
        .string()
        .required()
        .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
    }),
  }),

  googleUserSchema: yup.object({
    body: yup.object({
      token: yup.string().required(),
    }),
  }),
};

export default schemas;
