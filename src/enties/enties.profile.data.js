export const entiesProfileData = ({ data }) => {
  return {
    fullName: data?.fullName,
    document: data?.document,
    email: data?.email,
    phone: data?.phone,
    permission: data?.permission && data?.permission !== "off" ? "on" : "off",
    isMechanic: data?.isMechanic || false,
    isSupplier: data?.isSupplier || false,
    isManager: data?.isManager || false,
    mechanicData: { ...data?.mechanicData },
    supplierData: { ...data?.supplierData },
  };
};
