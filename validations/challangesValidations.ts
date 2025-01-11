import yup from "yup";

const challengesValidationSchema = {
  challengeAUser: yup.object({
    body: yup.object({
      challengedBy: yup.string().required(),
      challengedTo: yup.string().required(),
      challengeName: yup.string().required(),
      exerciseType: yup.string().required(),
    }),
  }),

  acceptChallenge: yup.object({
    body: yup.object({
      challengeId: yup.string().required(),
    }),
  }),

  rejectChallenge: yup.object({
    body: yup.object({
      challengeId: yup.string().required(),
    }),
  }),
};

export default challengesValidationSchema;
