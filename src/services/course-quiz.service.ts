import { IUpdateQuiz } from "@/components/views/Instructor/Course/EditCourse/ContentEditor/QuizEditor/QuizEditor.types";
import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

const getURL = ({ courseId, sectionId, itemId }: IdsWithItemId) =>
  `${endpoint.MY_COURSE}/${courseId}/sections/${sectionId}/items/${itemId}/quiz`;
export default {
  get: (ids: IdsWithItemId) => api.get(getURL(ids)),
  update: ({ quiz, ...ids }: IdsWithItemId & { quiz: IUpdateQuiz }) => api.patch(getURL(ids) + ``, quiz),
  publish: ({ quiz, ...ids }: IdsWithItemId & { quiz?: IUpdateQuiz }) =>
    api.post(getURL(ids) + `/publish`, quiz ?? undefined),
  deleteQuestion: ({ questionId, ...ids }: IdsWithItemId & { questionId: number }) =>
    api.delete(getURL(ids) + `/question/${questionId}`),
  deleteManyQuestion: ({ questionIds, ...ids }: IdsWithItemId & { questionIds: number[] }) =>
    api.delete(getURL(ids) + `/question/deleteMany`, { data: { ids: questionIds } }),
};
