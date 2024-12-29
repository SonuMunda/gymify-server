const validate = (schema: any) => async (req: any, res: any, next: any) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    next(err);
  }
};

export default validate;
