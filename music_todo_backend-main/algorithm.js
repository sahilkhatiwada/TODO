// ?register
// check email uniqueness

// if email is not unique, throw error
// hash password => never store plain password

//? login
// check if user exists with email
// if not user of that email, throw error
// check for password match (compare hashed password from db to plain password entered by user)
//  if not password match, throw error
// generate token using encryption algorithm
// send user and token as response
