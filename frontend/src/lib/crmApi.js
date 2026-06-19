import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const getDashboard = async () => {
  const { data } = await axios.get(
    `${API}/api/crm/dashboard`
  );
  return data;
};

export const getConversations = async () => {
  const { data } = await axios.get(
    `${API}/api/crm/conversations`
  );
  return data;
};

export const getMessages = async (id) => {
  const { data } = await axios.get(
    `${API}/api/crm/messages/${id}`
  );
  return data;
};

export const sendMessage =
  async (
    conversationId,
    message
  ) => {

    const { data } =
      await axios.post(
        `${API}/api/crm/send-message`,
        {
          conversationId,
          message,
        }
      );

    return data;
  };

export const getContacts = async () => {
  const { data } = await axios.get(
    `${API}/api/crm/contacts`
  );

  return data;
};

export const createContact = async (
  payload
) => {
  const { data } = await axios.post(
    `${API}/api/crm/contacts`,
    payload
  );

  return data;
};

export const updateContact = async (
  id,
  payload
) => {
  const { data } = await axios.put(
    `${API}/api/crm/contacts/${id}`,
    payload
  );

  return data;
};



export const deleteContact = async (
  id
) => {
  const { data } = await axios.delete(
    `${API}/api/crm/contacts/${id}`
  );

  return data;
};
export const createFollowUp =
  async (payload) => {

    const { data } =
      await axios.post(
        `${API}/api/crm/followups`,
        payload
      );

    return data;

  };

export const getFollowUps =
  async () => {

    const { data } =
      await axios.get(
        `${API}/api/crm/followups`
      );

    return data;

  };
