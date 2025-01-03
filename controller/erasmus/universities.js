export const getStudentUniversity = async (user) => {
  await dbConnect();
  const student = await StudentRole.findOne({ user: user._id }).populate(
    "university"
  );

  if (!student) {
    return null;
  }

  return student.university;
};

export const getUniversity = async (id) => {
  await dbConnect();
  const university = await University.findById(id);

  if (!university) {
    return null;
  }

  return university;
};
