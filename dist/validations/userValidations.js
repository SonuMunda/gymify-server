import yup from "yup";
const schemas = {
    profileSchema: yup.object({
        access: yup.object({
            userId: yup.string().required(),
        }),
    }),
    updateProfileSchema: yup.object({
        body: yup.object({
            fullName: yup.string().required(),
            username: yup.string().required(),
            about: yup.string().max(300),
        }),
    }),
    checkUsernameSchema: yup.object({
        body: yup.object({
            username: yup.string().required(),
        }),
    }),
    updateAvatarSchema: yup.object({
        body: yup.object({
            avatar: yup.string().url().required(),
        }),
    }),
};
export default schemas;
