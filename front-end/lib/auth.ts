import api from "./api";

export async function login(email: string, senha: string) {
  const response = await api.post("", {
    query: `
      mutation {
        login(email: "${email}", senha: "${senha}") {
          token
        }
      }
    `
  });

  const token = response.data.data?.login?.token;

  if (token) {
    localStorage.setItem("token", token);
  } else {
    throw new Error("Login falhou");
  }
}
