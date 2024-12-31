import yup from "yup";

const oneVOneChallengeValidationSchemas = {
  createOneVOneChallengeSchema: yup.object({
    body: yup.object({
      challengedBy: yup.string().required(),
      challengedTo: yup.string().required(),
      challengeName: yup.string().required(),
      challengeType: yup.string().required(),
      exerciseType: yup.string().required(),
    }),
  }),
};

export default oneVOneChallengeValidationSchemas;
