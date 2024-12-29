import yup from "yup";

const schemas = {
  createChallengeSchema: yup.object({
    body: yup.object({
      challengeName: yup.string().required(),
      challengeType: yup.string().required(),
      exerciseType: yup.string().required(),
      challengerId: yup.string().required(),
      challengedUserId: yup.string().required(),
    }),
  }),
};

export default schemas;
