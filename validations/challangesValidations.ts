import yup from "yup";

const challengesValidationSchema = {
  challengeAUserOneVOne: yup.object({
    body: yup.object({
      challengedTo: yup.string().required(),
      exerciseType: yup
        .string()
        .required()
        .oneOf(["bench press", "squat", "deadlift"]),
    }),
  }),

  acceptOneVOneChallenge: yup.object({
    body: yup.object({
      challengeId: yup.string().required(),
    }),
  }),

  rejectChallenge: yup.object({
    body: yup.object({
      reasonForRejectionFromChallengedUser: yup.string().required(),
      reasonForRejectionFromAdmin: yup.string().required(),
      challengeId: yup.string().required(),
    }),
  }),
};

export default challengesValidationSchema;
