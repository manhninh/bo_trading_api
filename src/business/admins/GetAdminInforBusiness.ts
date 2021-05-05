import AdminRepository from '@src/repository/AdminRepository';

export const getAdminInforBusiness = async (id: string): Promise<any> => {
  try {
    const adminRes = new AdminRepository();
    const admin = await adminRes.getAdminById(id);
    return admin;
  } catch (err) {
    throw err;
  }
};
