export const validateReqBody = (validationSchema) => {
  const validationFunc = async (req, res, next) => {
    try {
      const data = req.body;
      await validationSchema.validate(data);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }

    next();
  };

  return validationFunc;
};

//? improvised version of same code above
// export const validateReqBody = (validationSchema) => async (req, res, next) => {
//   try {
//     const data = req.body;
//     await validationSchema.validate(data);
//   } catch (error) {
//     return res.status(400).send({ message: error.message });
//   }

//   next();
// };
