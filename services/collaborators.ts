import { request } from "./request";

export type Collaborator = {
  id: number;
  user_id: number;
  name: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
};

export type CreateCollaboratorPayload = {
  name: string;
  amount: number;
};

export type UpdateCollaboratorPayload = Partial<CreateCollaboratorPayload>;

export async function getCollaboratorsService() {
  return request<Collaborator[]>("get", "/collaborators");
}

export async function createCollaboratorService(payload: CreateCollaboratorPayload) {
  return request<Collaborator>("post", "/collaborators", payload);
}

export async function updateCollaboratorService(id: number, payload: UpdateCollaboratorPayload) {
  return request<Collaborator>("put", `/collaborators/${id}`, payload);
}

export async function deleteCollaboratorService(id: number) {
  return request<{ message: string }>("delete", `/collaborators/${id}`);
}