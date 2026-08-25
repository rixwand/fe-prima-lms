export interface CreateThreadPayload {
  title: string;
  content: { message?: string; images?: string[] };
}

export interface CreateThreadForm {
  title: string;
  message?: string;
  images?: File[];
}

export interface ReplyThreadForm extends Omit<CreateThreadForm, "title"> {}

export interface ReplyThreadPayload {
  repliedToId?: number;
  content: {
    message?: string;
    images?: string[];
  };
}
