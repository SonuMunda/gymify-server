import * as yup from "yup";

const userStatisticsValidationSchema = {
  updateExerciseSchema: yup.object({
    body: yup.object({
      exerciseName: yup.string().required("Exercise name is required"),
      weight: yup.number().required("Weight is required"),
      proof: yup.string().required("Proof is required"),
    }),
  }),
};

export default userStatisticsValidationSchema;
