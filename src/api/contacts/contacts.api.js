import { AxiosInitializer } from "..";

export const searchContacts = async ({
  search,
  branchId,
  type,
  limit = 6,
  offset,
}) => {
  const params = {
    branchId,
    type,
    limit,
    offset,
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(type ? { type } : {}), // CLIENT o SUPPLIER
  };

  const response = await AxiosInitializer.get("/contacts/search", { params });
  return response.data;
};

export const createContact = async (contactData) => {
  const response = await AxiosInitializer.post("/contacts", contactData);
  return response.data;
};
export const findOneContact = async (id) => {
  const response = await AxiosInitializer.get(`/contacts/id/${id}`);
  return response.data;
};

export const updateContact = async (id, contactData) => {
  const response = await AxiosInitializer.patch(`/contacts/${id}`, contactData);
  return response.data;
};
