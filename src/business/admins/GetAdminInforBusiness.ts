import AdminRepository from '@src/repository/AdminRepository';
import SystemConfigRepository from '@src/repository/SystemConfigRepository';

export const getAdminInforBusiness = async (id: string): Promise<any> => {
  try {
    const adminRes = new AdminRepository();
    const admin = await adminRes.getAdminById(id);
    const configRes = new SystemConfigRepository();
    const config = await configRes.findAll();
    return {admin, config};
  } catch (err) {
    throw err;
  }
};
