import ValidationError from "../errors/ValidationError.js";





const validate = (schema) => {

  return (req, res, next) => {

    const { error } = schema.validate(
      req.body
    );




    if (error) {

      return next(

        new ValidationError(
          error.details[0].message
        )
      );
    }




    next();
  };
};

export default validate;